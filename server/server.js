require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./database');
const fs = require('fs');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5050; // Read from .env file or default

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

app.use('/api/recipes', recipesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/friends', friendsRoutes);

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
