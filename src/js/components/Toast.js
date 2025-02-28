import { generateId } from '../utils/helpers.js';

/**
 * Toast notification component for displaying messages
 */
export class Toast {
    /**
     * @param {Object} options - Configuration options
     * @param {string} [options.containerId='toast-container'] - ID of the toast container
     * @param {number} [options.duration=3000] - Duration in ms to show the toast
     * @param {number} [options.animationDuration=300] - Duration in ms for animations
     * @param {boolean} [options.autoCreate=true] - Whether to auto-create the container
     * @param {Object} [options.types] - Toast type configurations
     */
    constructor(options = {}) {
        // Configuration
        this.config = {
            containerId: options.containerId || 'toast-container',
            duration: options.duration || 3000,
            animationDuration: options.animationDuration || 300,
            autoCreate: options.autoCreate !== false,
            types: options.types || {
                success: { icon: '✓', className: 'toast-success' },
                error: { icon: '✕', className: 'toast-error' },
                info: { icon: 'ℹ', className: 'toast-info' },
                warning: { icon: '⚠', className: 'toast-warning' }
            }
        };
        
        // State
        this.state = {
            activeToasts: [],
            containerCreated: false
        };
        
        // Initialize
        if (this.config.autoCreate) {
            this.createContainer();
        }
    }
    
    /**
     * Create the toast container if it doesn't exist
     * @returns {HTMLElement} The toast container
     */
    createContainer() {
        if (this.state.containerCreated) {
            return document.getElementById(this.config.containerId);
        }
        
        let container = document.getElementById(this.config.containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = this.config.containerId;
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        this.state.containerCreated = true;
        return container;
    }
    
    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {Object} options - Toast options
     * @param {string} [options.type='info'] - Toast type (success, error, info, warning)
     * @param {number} [options.duration] - Custom duration for this toast
     * @param {Function} [options.onClose] - Callback when toast is closed
     * @returns {string} The ID of the created toast
     */
    show(message, options = {}) {
        const container = this.createContainer();
        const type = options.type || 'info';
        const duration = options.duration || this.config.duration;
        const typeConfig = this.config.types[type] || this.config.types.info;
        
        // Create toast element
        const toastId = generateId('toast');
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast ${typeConfig.className}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        
        // Create toast content
        toast.innerHTML = `
            <div class="toast-icon">${typeConfig.icon}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;
        
        // Add to container
        container.appendChild(toast);
        
        // Track active toast
        this.state.activeToasts.push({
            id: toastId,
            element: toast,
            timeoutId: null
        });
        
        // Add close button event
        const closeButton = toast.querySelector('.toast-close');
        closeButton.addEventListener('click', () => {
            this.close(toastId);
        });
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('toast-visible');
        }, 10);
        
        // Auto close after duration
        const timeoutId = setTimeout(() => {
            this.close(toastId);
        }, duration);
        
        // Update timeout ID
        const toastIndex = this.state.activeToasts.findIndex(t => t.id === toastId);
        if (toastIndex !== -1) {
            this.state.activeToasts[toastIndex].timeoutId = timeoutId;
        }
        
        return toastId;
    }
    
    /**
     * Show a success toast
     * @param {string} message - The message to display
     * @param {Object} [options] - Toast options
     * @returns {string} The ID of the created toast
     */
    success(message, options = {}) {
        return this.show(message, { ...options, type: 'success' });
    }
    
    /**
     * Show an error toast
     * @param {string} message - The message to display
     * @param {Object} [options] - Toast options
     * @returns {string} The ID of the created toast
     */
    error(message, options = {}) {
        return this.show(message, { ...options, type: 'error' });
    }
    
    /**
     * Show an info toast
     * @param {string} message - The message to display
     * @param {Object} [options] - Toast options
     * @returns {string} The ID of the created toast
     */
    info(message, options = {}) {
        return this.show(message, { ...options, type: 'info' });
    }
    
    /**
     * Show a warning toast
     * @param {string} message - The message to display
     * @param {Object} [options] - Toast options
     * @returns {string} The ID of the created toast
     */
    warning(message, options = {}) {
        return this.show(message, { ...options, type: 'warning' });
    }
    
    /**
     * Close a specific toast
     * @param {string} id - The ID of the toast to close
     */
    close(id) {
        const toastIndex = this.state.activeToasts.findIndex(t => t.id === id);
        
        if (toastIndex === -1) return;
        
        const { element, timeoutId } = this.state.activeToasts[toastIndex];
        
        // Clear timeout if exists
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        
        // Animate out
        element.classList.remove('toast-visible');
        element.classList.add('toast-hidden');
        
        // Remove after animation
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            
            // Remove from active toasts
            this.state.activeToasts = this.state.activeToasts.filter(t => t.id !== id);
        }, this.config.animationDuration);
    }
    
    /**
     * Close all active toasts
     */
    closeAll() {
        [...this.state.activeToasts].forEach(toast => {
            this.close(toast.id);
        });
    }
} 