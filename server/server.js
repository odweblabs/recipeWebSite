require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { initDb } = require('./database');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5050;

// Trust proxy (required for Vercel/proxies to get real IP/host)
app.set('trust proxy', 1);

// Security & Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP if it interferes with inline scripts/styles in dev
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper to fix image URLs in results
app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        // Use APP_URL from env if available, otherwise fallback to req host
        const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
        
        const fixUrl = (obj) => {
            if (!obj || typeof obj !== 'object') return obj;
            for (let key in obj) {
                if (typeof obj[key] === 'string' && obj[key].startsWith('/uploads/') && !obj[key].startsWith('data:')) {
                    obj[key] = baseUrl + obj[key];
                } else if (typeof obj[key] === 'object') {
                    fixUrl(obj[key]);
                }
            }
            return obj;
        };
        return originalJson.call(this, fixUrl(data));
    };
    next();
});

// Initialize DB and track health
let isDbConnected = false;
initDb().then(connected => {
    isDbConnected = connected;
});

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Routes
const recipesRoutes = require('./routes/recipes');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const favoritesRoutes = require('./routes/favorites');
const friendsRoutes = require('./routes/friends');
const listsRoutes = require('./routes/lists');
const feedbackRoutes = require('./routes/feedback');
const notificationsRoutes = require('./routes/notifications');
const menusRoutes = require('./routes/menus');
const seoRoutes = require('./routes/seo');
const imagesRoutes = require('./routes/images');

app.use('/api/recipes', recipesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/menus', menusRoutes);
app.use('/api/images', imagesRoutes);
app.use('/', seoRoutes);

// Health check endpoint with DB status
app.get('/api/health', async (req, res) => {
    let dbStatus = isDbConnected ? 'connected' : 'disconnected';
    const dbUrlSet = !!process.env.DATABASE_URL;
    let tablesStatus = 'unknown';

    // Attempt a simple query to verify live connection and check tables
    try {
        const { pool } = require('./database');
        const dbResult = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        dbStatus = 'connected';
        const tableNames = dbResult.rows.map(r => r.table_name);
        if (tableNames.includes('recipes')) {
            tablesStatus = 'tables_exist';
        } else {
            tablesStatus = 'no_tables_found';
        }
    } catch (err) {
        dbStatus = 'error: ' + err.message;
        tablesStatus = 'error';
    }

    res.status(200).json({
        status: 'ok',
        database: dbStatus,
        databaseUrlSet: dbUrlSet,
        tables: tablesStatus,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL
    });
});

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Recipe API is running...');
});

// Dynamic Sitemap Generation
app.get('/sitemap.xml', async (req, res) => {
    try {
        const { executeQuery } = require('./database');
        const baseUrl = process.env.APP_URL || 'https://tarifo.vercel.app';
        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Static Routes
        const staticRoutes = ['', '/recipes', '/what-to-cook', '/blog', '/trend'];
        staticRoutes.forEach(route => {
            xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${route === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        });

        // Dynamic Recipe Routes
        const recipes = await executeQuery('SELECT id, created_at FROM recipes');
        recipes.forEach(recipe => {
            let date = new Date().toISOString().split('T')[0];
            try {
                if (recipe.created_at) {
                    const parsedDate = new Date(recipe.created_at);
                    if (!isNaN(parsedDate.getTime())) {
                        date = parsedDate.toISOString().split('T')[0];
                    }
                }
            } catch (e) {}
            xml += `  <url>\n    <loc>${baseUrl}/recipes/${recipe.id}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
        });

        xml += `</urlset>`;
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (err) {
        console.error('Sitemap generation error stack:', err.stack);
        res.status(500).send(err.message + '\\n' + err.stack);
    }
});
// Error handling middleware should be added after all routes
app.use(errorHandler);

// Vercel serverless function olarak çalıştığında listen gerekmez
let server;
if (!process.env.VERCEL) {
    server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Graceful shutdown
const shutdown = () => {
    console.log('\nShutting down server gracefully...');
    const { pool } = require('./database');
    server.close(() => {
        console.log('HTTP server closed.');
        pool.end(() => {
            console.log('Database pool closed.');
            process.exit(0);
        });
    });

    // Force shut down if not done after 10s
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Vercel serverless export
module.exports = app;
