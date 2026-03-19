// Utility functions for formatting numbers and strings

/**
 * Formats a number with suffixes like K and M (e.g., 1200 -> 1.2K)
 * @param {number} num 
 * @returns {string|number}
 */
export const formatStat = (num) => {
    if (!num) return 0;
    const n = Number(num);
    if (isNaN(n)) return num;

    if (n >= 1000000) {
        return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (n >= 1000) {
        return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return n;
};
