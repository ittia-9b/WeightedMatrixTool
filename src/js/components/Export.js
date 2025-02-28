import { matrixToMarkdown, showToast } from '../utils/helpers.js';

/**
 * Export class responsible for exporting the matrix data to different formats
 */
export class Export {
    /**
     * @param {Object} options - Configuration options
     * @param {Matrix} options.matrix - The Matrix instance to export data from
     * @param {string} [options.convertButtonId='convertButton'] - ID of the convert button
     * @param {string} [options.copyButtonId='copyButton'] - ID of the copy button
     * @param {string} [options.previewId='markdownPreview'] - ID of the preview element
     * @param {Function} [options.onSuccess] - Callback for successful operations
     * @param {Function} [options.onError] - Callback for error handling
     */
    constructor(options = {}) {
        // Dependencies
        this.matrix = options.matrix;
        
        if (!this.matrix) {
            console.error('Export: Matrix instance is required');
            return;
        }
        
        // Configuration
        this.config = {
            convertButtonId: options.convertButtonId || 'convertButton',
            copyButtonId: options.copyButtonId || 'copyButton',
            previewId: options.previewId || 'markdownPreview',
            onSuccess: options.onSuccess || this.defaultSuccessHandler,
            onError: options.onError || this.defaultErrorHandler
        };
        
        // DOM elements
        this.elements = {
            convertButton: document.getElementById(this.config.convertButtonId),
            copyButton: document.getElementById(this.config.copyButtonId),
            previewElement: document.getElementById(this.config.previewId),
            table: document.querySelector('.matrix-table')
        };
        
        // State
        this.state = {
            currentMarkdown: '',
            isConverted: false
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the export functionality
     */
    init() {
        if (!this.elements.convertButton || !this.elements.copyButton || !this.elements.previewElement) {
            console.error('Export: Required DOM elements not found');
            return;
        }
        
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Convert button click
        this.elements.convertButton.addEventListener('click', () => {
            this.convertToMarkdown();
        });
        
        // Copy button click
        this.elements.copyButton.addEventListener('click', () => {
            this.copyToClipboard();
        });
    }
    
    /**
     * Convert matrix data to markdown and update the preview
     */
    convertToMarkdown() {
        try {
            // Get matrix data
            const matrixData = this.matrix.getMatrixData();
            
            // Convert to markdown
            this.state.currentMarkdown = matrixToMarkdown(matrixData, {
                includeWeights: true,
                includeWeightedValues: true
            });
            
            // Update preview
            this.elements.previewElement.textContent = this.state.currentMarkdown;
            
            // Show copy button
            this.elements.copyButton.classList.remove('hidden');
            this.state.isConverted = true;
            
            // Notify success
            this.config.onSuccess('Matrix converted to Markdown');
        } catch (error) {
            this.config.onError('Failed to convert matrix: ' + error.message);
        }
    }
    
    /**
     * Copy the markdown to clipboard
     */
    copyToClipboard() {
        if (!this.state.isConverted || !this.state.currentMarkdown) {
            this.config.onError('No markdown available to copy');
            return;
        }
        
        try {
            navigator.clipboard.writeText(this.state.currentMarkdown)
                .then(() => {
                    this.config.onSuccess('Markdown copied to clipboard');
                })
                .catch(error => {
                    this.config.onError('Failed to copy: ' + error.message);
                });
        } catch (error) {
            // Fallback for browsers that don't support clipboard API
            this.fallbackCopyToClipboard();
        }
    }
    
    /**
     * Fallback method to copy text to clipboard
     */
    fallbackCopyToClipboard() {
        try {
            // Create a temporary textarea
            const textarea = document.createElement('textarea');
            textarea.value = this.state.currentMarkdown;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // Select and copy
            textarea.select();
            document.execCommand('copy');
            
            // Clean up
            document.body.removeChild(textarea);
            
            this.config.onSuccess('Markdown copied to clipboard');
        } catch (error) {
            this.config.onError('Failed to copy: ' + error.message);
        }
    }
    
    /**
     * Export to CSV format
     */
    exportToCSV() {
        try {
            const matrixData = this.matrix.getMatrixData();
            const { title, headers, rows } = matrixData;
            
            let csv = `"${title}"\n`;
            
            // Header row
            csv += '"Criteria","Weight",';
            csv += headers.map(header => `"${header}"`).join(',');
            csv += '\n';
            
            // Data rows
            rows.forEach(row => {
                csv += `"${row.label}","${row.weight}",`;
                csv += row.values.map(cell => `"${cell.base}"`).join(',');
                csv += '\n';
            });
            
            // Create download link
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}_matrix.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.config.onSuccess('Matrix exported to CSV');
        } catch (error) {
            this.config.onError('Failed to export to CSV: ' + error.message);
        }
    }
    
    /**
     * Legacy method for simple markdown export
     * Kept for backward compatibility
     */
    copyAsMarkdown() {
        let markdown = [];
        
        let headers = [];
        const headerRow = this.elements.table.rows[0];
        for (let i = 0; i < headerRow.cells.length; i++) {
            const input = headerRow.cells[i].querySelector('.editable-label');
            headers.push(input.value);
        }
        markdown.push('| ' + headers.join(' | ') + ' |');
        markdown.push('| ' + headers.map(() => '---').join(' | ') + ' |');
        
        for (let i = 1; i < this.elements.table.rows.length; i++) {
            const row = this.elements.table.rows[i];
            let rowData = [];
            
            const primaryInput = row.cells[0].querySelector('.editable-label');
            const weightSpan = row.cells[0].querySelector('.weight-control span');
            rowData.push(`${primaryInput.value} (${weightSpan.textContent})`);
            
            for (let j = 1; j < row.cells.length; j++) {
                const span = row.cells[j].querySelector('span');
                const value = parseFloat(span.textContent);
                const weight = parseFloat(weightSpan.textContent);
                rowData.push((value * weight).toFixed(1));
            }
            
            markdown.push('| ' + rowData.join(' | ') + ' |');
        }

        navigator.clipboard.writeText(markdown.join('\n'))
            .then(() => showToast('Copied to clipboard!'))
            .catch(err => showToast('Failed to copy: ' + err));
    }
    
    /**
     * Default success handler
     * @param {string} message - Success message
     */
    defaultSuccessHandler(message) {
        console.log('Export success:', message);
        if (typeof showToast === 'function') {
            showToast(message);
        }
    }
    
    /**
     * Default error handler
     * @param {string} message - Error message
     */
    defaultErrorHandler(message) {
        console.error('Export error:', message);
        if (typeof showToast === 'function') {
            showToast(message);
        }
    }
} 