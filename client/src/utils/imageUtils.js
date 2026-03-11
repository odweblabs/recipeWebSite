import API_BASE from './api';

/**
 * Safely formats an image URL to handle Base64, absolute URLs, and relative paths.
 * Prevents invalid concatenations like http://localhost:5000/data:image/...
 * 
 * @param {string} url - The raw image URL or Base64 string from the database.
 * @returns {string} The fully formatted, valid image URL.
 */
export const getImageUrl = (url) => {
    if (!url) return null;
    
    // If it's a base64 string, absolute url (http/https), simply return it
    if (url.startsWith('data:image') || url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Default: It's a relative path from our server, prepend API_BASE
    // Support paths with or without leading slash
    const formattedPath = url.startsWith('/') ? url : `/${url}`;
    return `${API_BASE}${formattedPath}`;
};
