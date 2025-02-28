/**
 * Generates a color for the heatmap based on a value between 0 and 1
 * @param {number} value - Value between 0 and 1
 * @returns {string} - RGB color string
 */
export const getHeatmapColor = (value) => {
    const hue = ((1 - value) * 120).toString(10);
    return `hsl(${hue}, 80%, 50%)`;
};

/**
 * Formats a number to a specified number of decimal places
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted number
 */
export const formatNumber = (num, decimals = 2) => {
    return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
};

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Generates a unique ID
 * @returns {string} - Unique ID
 */
export const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}; 