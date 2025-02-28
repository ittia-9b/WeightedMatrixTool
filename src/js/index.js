/**
 * Weighted Matrix Tool - Main Application Entry Point
 */
import { Matrix } from './components/Matrix.js';
import { Export } from './components/Export.js';
import { Toast } from './components/Toast.js';
import { debounce } from './utils/helpers.js';

/**
 * Application class that initializes and manages all components
 */
class App {
    /**
     * Initialize the application
     */
    constructor() {
        // Initialize components
        this.initComponents();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Show welcome message
        this.showWelcomeMessage();
    }
    
    /**
     * Initialize all application components
     */
    initComponents() {
        // Create toast notification system
        this.toast = new Toast({
            duration: 3000,
            containerId: 'toast-container'
        });
        
        // Create matrix component
        this.matrix = new Matrix({
            selector: '.matrix-table',
            title: 'Weighted Matrix Tool',
            primaryLabels: ['Criteria 1', 'Criteria 2', 'Criteria 3'],
            secondaryLabels: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
        });
        
        // Create export component
        this.export = new Export({
            matrix: this.matrix,
            convertButtonId: 'convertButton',
            copyButtonId: 'copyButton',
            previewId: 'markdownPreview',
            onSuccess: (message) => this.toast.success(message),
            onError: (message) => this.toast.error(message)
        });
    }
    
    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Matrix control buttons
        document.getElementById('addRowButton')?.addEventListener('click', () => {
            this.matrix.addRow();
            this.toast.info('Row added');
        });
        
        document.getElementById('addColumnButton')?.addEventListener('click', () => {
            this.matrix.addColumn();
            this.toast.info('Column added');
        });
        
        document.getElementById('removeRowButton')?.addEventListener('click', () => {
            this.matrix.removeRow();
            this.toast.info('Row removed');
        });
        
        document.getElementById('removeColumnButton')?.addEventListener('click', () => {
            this.matrix.removeColumn();
            this.toast.info('Column removed');
        });
        
        document.getElementById('resetButton')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the matrix? All data will be lost.')) {
                this.matrix.resetMatrix();
                this.toast.warning('Matrix reset to default values');
            }
        });
        
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('change', (e) => {
            this.toggleDarkMode(e.target.checked);
        });
        
        // Handle initial theme based on user preference
        this.initializeTheme();
        
        // Handle window resize events
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    /**
     * Initialize theme based on user preference
     */
    initializeTheme() {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        const useDarkMode = savedTheme === 'dark' || (savedTheme !== 'light' && prefersDarkMode);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.checked = useDarkMode;
        }
        
        this.toggleDarkMode(useDarkMode);
    }
    
    /**
     * Toggle dark mode
     * @param {boolean} isDark - Whether to enable dark mode
     */
    toggleDarkMode(isDark) {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
    
    /**
     * Handle window resize events
     */
    handleResize() {
        // Update UI elements that need to respond to resize
        // Currently just a placeholder for future responsive adjustments
    }
    
    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        this.toast.info('Welcome to the Weighted Matrix Tool!', { duration: 4000 });
    }
}

/**
 * Initialize the application when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Handle service worker for PWA support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
} 