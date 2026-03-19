// Use empty string to rely on Vite proxy in development, and relative URL in production
const API_BASE = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || '');
export default API_BASE;
