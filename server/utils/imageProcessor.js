const sharp = require('sharp');

/**
 * Optimizes an image buffer:
 * - Resizes to max width of 1200px (preserves aspect ratio)
 * - Converts to WebP format
 * - Compresses with quality 80
 * - Returns a base64 string
 */
async function optimizeImage(buffer) {
    try {
        const optimizedBuffer = await sharp(buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
        
        return `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
    } catch (err) {
        console.error('Error optimizing image:', err);
        throw err;
    }
}

module.exports = { optimizeImage };
