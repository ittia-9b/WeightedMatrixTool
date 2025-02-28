/**
 * Utility functions for the Weighted Matrix Tool
 */

/**
 * Calculate the weighted value based on a base value and weight
 * @param {number} value - The base value
 * @param {number} weight - The weight to apply
 * @returns {number} The weighted value
 */
export function calculateWeightedValue(value, weight) {
    // Ensure inputs are numbers
    const numValue = Number(value) || 0;
    const numWeight = Number(weight) || 1;
    return numValue * numWeight;
}

/**
 * Generate a color based on a value within a range
 * @param {number} value - The value to represent
 * @param {number} min - The minimum value in the range
 * @param {number} max - The maximum value in the range
 * @param {number} opacity - The opacity of the color (0-1)
 * @returns {string} The color as an rgba string
 */
export function getHeatmapColor(value, min, max, opacity = 0.7) {
    // Validate inputs
    const numValue = Number(value) || 0;
    const numMin = Number(min) || -10;
    const numMax = Number(max) || 10;
    const numOpacity = Math.max(0, Math.min(1, Number(opacity) || 0.7));
    
    // Handle edge cases
    if (numMin === numMax) {
        return `rgba(200, 200, 200, ${numOpacity})`;  // Gray for no range
    }
    
    // Normalize the value to a 0-1 range
    const normalizedValue = (numValue - numMin) / (numMax - numMin);
    
    // Calculate RGB values
    let r, g, b;
    
    if (normalizedValue < 0.5) {
        // Red to white gradient for negative to neutral
        const factor = normalizedValue * 2;
        r = 255;
        g = b = Math.round(255 * factor);
    } else {
        // White to green gradient for neutral to positive
        const factor = (normalizedValue - 0.5) * 2;
        g = 255;
        r = b = Math.round(255 * (1 - factor));
    }
    
    return `rgba(${r}, ${g}, ${b}, ${numOpacity})`;
}

/**
 * Format a number to a specified number of decimal places
 * @param {number} value - The number to format
 * @param {number} [decimals=1] - The number of decimal places
 * @returns {string} The formatted number
 */
export function formatNumber(value, decimals = 1) {
    // Ensure inputs are valid
    const numValue = Number(value);
    const numDecimals = Math.max(0, Math.floor(Number(decimals) || 0));
    
    if (isNaN(numValue)) {
        return '0' + (numDecimals > 0 ? '.' + '0'.repeat(numDecimals) : '');
    }
    
    return numValue.toFixed(numDecimals);
}

/**
 * Create a debounced function that delays invoking the provided function
 * @param {Function} func - The function to debounce
 * @param {number} [wait=300] - The delay in milliseconds
 * @returns {Function} The debounced function
 */
export function debounce(func, wait = 300) {
    if (typeof func !== 'function') {
        throw new TypeError('Expected a function');
    }
    
    let timeout;
    
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Generate a unique ID
 * @param {string} [prefix='id'] - Prefix for the ID
 * @returns {string} A unique ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clamp a number between a minimum and maximum value
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum allowed value
 * @param {number} max - The maximum allowed value
 * @returns {number} The clamped value
 */
export function clamp(value, min, max) {
    const numValue = Number(value) || 0;
    const numMin = Number(min) || 0;
    const numMax = Number(max) || 1;
    
    return Math.max(numMin, Math.min(numMax, numValue));
}

/**
 * Convert a matrix to markdown format
 * @param {Object} data - The matrix data
 * @param {string} data.title - The matrix title
 * @param {string[]} data.headers - The column headers
 * @param {Array} data.rows - The row data
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.includeWeights=true] - Whether to include weights
 * @param {boolean} [options.includeWeightedValues=true] - Whether to include weighted values
 * @returns {string} The markdown representation
 */
export function matrixToMarkdown(data, options = {}) {
    const { title, headers, rows } = data;
    const { includeWeights = true, includeWeightedValues = true } = options;
    
    if (!headers || !rows || !Array.isArray(headers) || !Array.isArray(rows)) {
        return '# Invalid Matrix Data';
    }
    
    let markdown = `# ${title || 'Weighted Matrix'}\n\n`;
    
    // Create header row
    markdown += '| Criteria ';
    if (includeWeights) {
        markdown += '| Weight ';
    }
    
    headers.forEach(header => {
        markdown += `| ${header} `;
    });
    markdown += '|\n';
    
    // Create separator row
    markdown += '|:-------';
    if (includeWeights) {
        markdown += '|:-----:';
    }
    
    headers.forEach(() => {
        markdown += '|:-----:';
    });
    markdown += '|\n';
    
    // Create data rows
    rows.forEach(row => {
        markdown += `| ${row.label} `;
        
        if (includeWeights) {
            markdown += `| ${formatNumber(row.weight)} `;
        }
        
        row.values.forEach(cell => {
            if (includeWeightedValues) {
                markdown += `| ${formatNumber(cell.base)} (${formatNumber(cell.weighted)}) `;
            } else {
                markdown += `| ${formatNumber(cell.base)} `;
            }
        });
        
        markdown += '|\n';
    });
    
    return markdown;
}

/**
 * Deep clone an object
 * @param {*} obj - The object to clone
 * @returns {*} A deep clone of the object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (obj instanceof Object) {
        const copy = {};
        Object.keys(obj).forEach(key => {
            copy[key] = deepClone(obj[key]);
        });
        return copy;
    }
    
    return obj;
}

/**
 * Show a toast notification
 * This is a simple implementation that will be used as a fallback
 * when the Toast component is not available
 * @param {string} message - The message to display
 * @param {Object} [options] - Toast options
 */
export function showToast(message, options = {}) {
    // Try to use the existing toast container
    const container = document.getElementById('toast-container');
    
    if (!container) {
        // If no container exists, create a simple toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Hide the toast after a delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, options.duration || 3000);
        
        return;
    }
    
    // Create a simple toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-message">${message}</div>
        <button class="toast-close" aria-label="Close">&times;</button>
    `;
    
    // Add to container
    container.appendChild(toast);
    
    // Show the toast
    setTimeout(() => toast.classList.add('toast-visible'), 10);
    
    // Add close button event
    const closeButton = toast.querySelector('.toast-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            toast.classList.remove('toast-visible');
            toast.classList.add('toast-hidden');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    }
    
    // Auto close after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('toast-visible');
            toast.classList.add('toast-hidden');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }, options.duration || 3000);
}

/**
 * Map a value from one range to another
 * @param {number} value - The value to map
 * @param {number} fromLow - The lower bound of the input range
 * @param {number} fromHigh - The upper bound of the input range
 * @param {number} toLow - The lower bound of the output range
 * @param {number} toHigh - The upper bound of the output range
 * @returns {number} The mapped value
 */
export function map(value, fromLow, fromHigh, toLow, toHigh) {
    return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
}