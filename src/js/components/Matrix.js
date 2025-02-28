import { getHeatmapColor } from '../utils/helpers.js';

/**
 * Matrix class responsible for creating and managing the weighted decision matrix
 */
export class Matrix {
    /**
     * @param {Object} options - Configuration options
     * @param {string} [options.selector='.matrix-table'] - CSS selector for the matrix table
     * @param {string} [options.title='WMT'] - Default title for the matrix
     * @param {string[]} [options.primaryLabels=['P1', 'P2', 'P3']] - Default primary row labels
     * @param {string[]} [options.secondaryLabels=['S1', 'S2', 'S3', 'S4']] - Default secondary column labels
     * @param {number} [options.defaultWeight=1.0] - Default weight for primary items
     * @param {number} [options.defaultValue=0.0] - Default value for matrix cells
     * @param {number} [options.minValue=-10] - Minimum allowed value
     * @param {number} [options.maxValue=10] - Maximum allowed value
     */
    constructor(options = {}) {
        // Configuration
        this.config = {
            selector: options.selector || '.matrix-table',
            title: options.title || 'WMT',
            primaryLabels: options.primaryLabels || ['P1', 'P2', 'P3'],
            secondaryLabels: options.secondaryLabels || ['S1', 'S2', 'S3', 'S4'],
            defaultWeight: options.defaultWeight || 1.0,
            defaultValue: options.defaultValue || 0.0,
            minValue: options.minValue || -10,
            maxValue: options.maxValue || 10
        };

        // DOM elements
        this.elements = {
            table: document.querySelector(this.config.selector),
            scaleToggle: document.getElementById('scaleToggle'),
            opacitySlider: document.getElementById('opacitySlider'),
            minLabel: document.getElementById('minLabel'),
            maxLabel: document.getElementById('maxLabel')
        };

        // State
        this.state = {
            isDynamicScale: this.elements.scaleToggle?.checked || false,
            colorOpacity: (this.elements.opacitySlider?.value || 50) / 100
        };

        // Initialize the matrix
        if (this.elements.table) {
            this.init();
        } else {
            console.error(`Matrix table element not found with selector: ${this.config.selector}`);
        }
    }

    /**
     * Initialize the matrix
     */
    init() {
        this.createHeaderRow();
        this.createDataRows();
        this.setupEventListeners();
        this.updateMatrix();
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        // Listen for scale toggle changes
        this.elements.scaleToggle?.addEventListener('change', () => {
            this.state.isDynamicScale = this.elements.scaleToggle.checked;
            this.updateMatrix();
        });

        // Listen for opacity slider changes
        this.elements.opacitySlider?.addEventListener('input', () => {
            this.state.colorOpacity = this.elements.opacitySlider.value / 100;
            this.updateMatrix();
        });
        
        // Update opacity value display
        this.elements.opacitySlider?.addEventListener('input', () => {
            const opacityValue = document.getElementById('opacityValue');
            if (opacityValue) {
                opacityValue.textContent = `${this.elements.opacitySlider.value}%`;
            }
        });
    }

    // ===== CELL CREATION METHODS =====

    /**
     * Create the header row with title and secondary labels
     */
    createHeaderRow() {
        const headerRow = document.createElement('tr');
        headerRow.appendChild(this.createTitleCell());
        
        this.config.secondaryLabels.forEach(label => {
            headerRow.appendChild(this.createHeaderCell(label));
        });
        
        this.elements.table.appendChild(headerRow);
    }

    /**
     * Create the title cell
     * @returns {HTMLTableCellElement} The title cell element
     */
    createTitleCell() {
        const cell = document.createElement('th');
        cell.className = 'title-cell';
        cell.innerHTML = `<input type="text" class="editable-label" value="${this.config.title}">`;
        return cell;
    }

    /**
     * Create a header cell with the given label
     * @param {string} label - The label text
     * @returns {HTMLTableCellElement} The header cell element
     */
    createHeaderCell(label) {
        const cell = document.createElement('th');
        cell.innerHTML = `<input type="text" class="editable-label" value="${label}">`;
        return cell;
    }

    /**
     * Create data rows with primary labels and matrix cells
     */
    createDataRows() {
        this.config.primaryLabels.forEach(label => {
            const row = document.createElement('tr');
            row.appendChild(this.createPrimaryCell(label));
            
            this.config.secondaryLabels.forEach(() => {
                row.appendChild(this.createMatrixCell());
            });
            
            this.elements.table.appendChild(row);
        });
    }

    /**
     * Create a primary cell with the given label and weight control
     * @param {string} label - The label text
     * @returns {HTMLTableCellElement} The primary cell element
     */
    createPrimaryCell(label) {
        const cell = document.createElement('td');
        cell.className = 'primary-cell';
        cell.innerHTML = `
            <div>
                <input type="text" class="editable-label" value="${label}">
                <div class="weight-control">
                    <span>${this.config.defaultWeight.toFixed(1)}</span>
                </div>
            </div>
        `;
        this.setupWeightControl(cell);
        return cell;
    }

    /**
     * Create a matrix cell with base and weighted values
     * @returns {HTMLTableCellElement} The matrix cell element
     */
    createMatrixCell() {
        const cell = document.createElement('td');
        cell.className = 'matrix-cell';
        cell.innerHTML = `
            <span class="base-value">${this.config.defaultValue.toFixed(1)}</span>
            <span class="weighted-value">${this.config.defaultValue.toFixed(1)}</span>
        `;
        this.setupCellControl(cell);
        return cell;
    }

    // ===== EVENT HANDLERS =====

    /**
     * Set up weight control event handlers
     * @param {HTMLElement} cell - The cell containing the weight control
     */
    setupWeightControl(cell) {
        const weightControl = cell.querySelector('.weight-control');
        const weightSpan = weightControl.querySelector('span');
        
        if (!weightControl || !weightSpan) return;
        
        const handleWeightChange = (e) => {
            e.preventDefault();
            const currentValue = parseFloat(weightSpan.textContent) || this.config.defaultWeight;
            let newValue = currentValue;
            
            if (e.button === 0) { // Left click
                newValue = Math.min(this.config.maxValue, currentValue + 1);
            } else if (e.button === 2) { // Right click
                newValue = Math.max(-this.config.maxValue, currentValue - 1);
            }
            
            weightSpan.textContent = newValue.toFixed(1);
            this.updateMatrix();
        };
        
        weightControl.addEventListener('mousedown', handleWeightChange);
        weightControl.addEventListener('contextmenu', e => e.preventDefault());
    }

    /**
     * Set up matrix cell event handlers
     * @param {HTMLElement} cell - The matrix cell
     */
    setupCellControl(cell) {
        if (!cell) return;
        
        const handleValueChange = (e) => {
            e.preventDefault();
            const baseValue = cell.querySelector('.base-value');
            if (!baseValue) return;
            
            const currentValue = parseFloat(baseValue.textContent) || this.config.defaultValue;
            let newValue = currentValue;
            
            if (e.button === 0) { // Left click
                newValue = Math.min(this.config.maxValue, currentValue + 1);
            } else if (e.button === 2) { // Right click
                newValue = Math.max(this.config.minValue, currentValue - 1);
            }
            
            // Update the cell value
            this.updateCellValue(cell, newValue);
            
            // If in dynamic scale mode, we need to update the entire matrix
            // since the range of values may have changed
            if (this.state.isDynamicScale) {
                this.updateMatrix();
            }
        };

        cell.addEventListener('mousedown', handleValueChange);
        cell.addEventListener('contextmenu', e => e.preventDefault());
    }

    // ===== UPDATE METHODS =====

    /**
     * Update a cell's value and appearance
     * @param {HTMLElement} cell - The cell to update
     * @param {number} value - The new base value
     */
    updateCellValue(cell, value) {
        if (!cell) return;
        
        const baseValue = cell.querySelector('.base-value');
        const weightedValue = cell.querySelector('.weighted-value');
        const row = cell.closest('tr');
        
        if (!baseValue || !weightedValue || !row) return;
        
        const weightSpan = row.cells[0]?.querySelector('.weight-control span');
        if (!weightSpan) return;
        
        const weight = parseFloat(weightSpan.textContent) || this.config.defaultWeight;
        const weightedProduct = value * weight;
        
        baseValue.textContent = value.toFixed(1);
        weightedValue.textContent = weightedProduct.toFixed(1);
        
        // Only update the cell color if we're not in dynamic scale mode
        // If we are in dynamic scale mode, the full matrix update will handle it
        if (!this.state.isDynamicScale) {
            this.updateCellColor(cell, value, weightedProduct);
        }
    }

    /**
     * Update a cell's background color based on its value
     * @param {HTMLElement} cell - The cell to update
     * @param {number} baseValue - The base value
     * @param {number} weightedValue - The weighted value
     */
    updateCellColor(cell, baseValue, weightedValue) {
        if (!cell) return;
        
        const { min, max } = this.getWeightedRange();
        const valueToUse = this.state.isDynamicScale ? weightedValue : baseValue;
        const minToUse = this.state.isDynamicScale ? min : this.config.minValue;
        const maxToUse = this.state.isDynamicScale ? max : this.config.maxValue;
        
        cell.style.backgroundColor = getHeatmapColor(
            valueToUse, 
            minToUse, 
            maxToUse, 
            this.state.colorOpacity
        );
    }

    /**
     * Update the entire matrix
     */
    updateMatrix() {
        // First, get the weighted range for dynamic scaling
        const { min, max } = this.getWeightedRange();
        
        // Update the heatmap scale labels
        this.updateHeatmapScale(min, max);
        
        // Update all cells
        const cells = this.elements.table.querySelectorAll('.matrix-cell');
        cells.forEach(cell => {
            const baseValue = cell.querySelector('.base-value');
            const weightedValue = cell.querySelector('.weighted-value');
            
            if (baseValue && weightedValue) {
                const baseVal = parseFloat(baseValue.textContent) || this.config.defaultValue;
                const weightedVal = parseFloat(weightedValue.textContent) || this.config.defaultValue;
                
                // Update the cell color based on the current scale mode
                this.updateCellColor(cell, baseVal, weightedVal);
            }
        });
    }

    /**
     * Update the heatmap scale labels
     * @param {number} min - The minimum value
     * @param {number} max - The maximum value
     */
    updateHeatmapScale(min, max) {
        if (this.elements.minLabel) {
            this.elements.minLabel.textContent = `Negative Impact (${min.toFixed(1)})`;
        }
        
        if (this.elements.maxLabel) {
            this.elements.maxLabel.textContent = `Positive Impact (+${max.toFixed(1)})`;
        }
    }

    // ===== UTILITY METHODS =====

    /**
     * Get the range of weighted values in the matrix
     * @returns {Object} The min and max weighted values
     */
    getWeightedRange() {
        if (!this.state.isDynamicScale) {
            const weights = Array.from(this.elements.table.querySelectorAll('.weight-control span'))
                .map(span => Math.abs(parseFloat(span.textContent) || this.config.defaultWeight));
            
            const maxWeight = weights.length > 0 ? Math.max(...weights) : this.config.defaultWeight;
            return { 
                min: this.config.minValue * maxWeight, 
                max: this.config.maxValue * maxWeight 
            };
        }
        
        const values = Array.from(this.elements.table.querySelectorAll('.weighted-value'))
            .map(el => parseFloat(el.textContent) || 0);
        
        if (values.length === 0) {
            return { min: -1, max: 1 };
        }
        
        return {
            min: Math.min(...values),
            max: Math.max(...values)
        };
    }

    /**
     * Get the current matrix data
     * @returns {Object} The matrix data
     */
    getMatrixData() {
        const headerRow = this.elements.table.rows[0];
        const title = headerRow.cells[0].querySelector('input').value;
        
        const headers = Array.from(headerRow.cells).slice(1).map(cell => 
            cell.querySelector('input').value
        );
        
        const rows = [];
        for (let i = 1; i < this.elements.table.rows.length; i++) {
            const row = this.elements.table.rows[i];
            const label = row.cells[0].querySelector('input').value;
            const weight = parseFloat(row.cells[0].querySelector('.weight-control span').textContent);
            
            const values = Array.from(row.cells).slice(1).map(cell => ({
                base: parseFloat(cell.querySelector('.base-value').textContent),
                weighted: parseFloat(cell.querySelector('.weighted-value').textContent)
            }));
            
            rows.push({ label, weight, values });
        }
        
        return { title, headers, rows };
    }

    // ===== MATRIX MANIPULATION METHODS =====

    /**
     * Add a new row to the matrix
     */
    addRow() {
        const row = document.createElement('tr');
        const newIndex = this.elements.table.rows.length;
        const label = `P${newIndex}`;
        
        row.appendChild(this.createPrimaryCell(label));
        
        const numCols = this.elements.table.rows[0].cells.length - 1;
        for (let i = 0; i < numCols; i++) {
            row.appendChild(this.createMatrixCell());
        }
        
        this.elements.table.appendChild(row);
        this.updateMatrix();
        
        return row;
    }

    /**
     * Add a new column to the matrix
     */
    addColumn() {
        const headerRow = this.elements.table.rows[0];
        const newIndex = headerRow.cells.length;
        const label = `S${newIndex}`;
        
        headerRow.appendChild(this.createHeaderCell(label));
        
        for (let i = 1; i < this.elements.table.rows.length; i++) {
            this.elements.table.rows[i].appendChild(this.createMatrixCell());
        }
        
        this.updateMatrix();
    }

    /**
     * Remove the last row from the matrix
     */
    removeRow() {
        if (this.elements.table.rows.length > 2) {
            this.elements.table.deleteRow(-1);
            this.updateMatrix();
        }
    }

    /**
     * Remove the last column from the matrix
     */
    removeColumn() {
        if (this.elements.table.rows[0].cells.length > 2) {
            Array.from(this.elements.table.rows).forEach(row => row.deleteCell(-1));
            this.updateMatrix();
        }
    }

    /**
     * Reset the matrix to default values
     */
    resetMatrix() {
        // Clear the table
        while (this.elements.table.firstChild) {
            this.elements.table.removeChild(this.elements.table.firstChild);
        }
        
        // Rebuild the matrix
        this.init();
    }
} 