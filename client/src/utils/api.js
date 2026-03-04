const API_BASE = import.meta.env.MODE === 'production' ? '' : (import.meta.env.VITE_API_URL || '');
export default API_BASE;
