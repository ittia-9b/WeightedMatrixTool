class WeightedMatrix {
    constructor() {
        this.defaultTitle = "Weighted Matrix";
        this.defaultPrimary = ["P1", "P2", "P3"];
        this.defaultSecondary = ["S1", "S2", "S3", "S4"];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => this.createMatrix());
    }

    createMatrix() {
        const container = document.createElement('div');
        container.className = 'matrix-container';
        
        const table = document.createElement('table');
        table.className = 'matrix-table';
        
        this.createHeaderRow(table);
        this.createDataRows(table);
        this.addEdgeButtons(container, table);

        const matrixContainer = document.getElementById('matrixContainer');
        matrixContainer.innerHTML = '';
        matrixContainer.appendChild(container);

        this.updateMatrix();
    }

    createHeaderRow(table) {
        const headerRow = document.createElement('tr');
        
        // Title cell
        const titleCell = document.createElement('th');
        titleCell.className = 'title-cell';
        titleCell.innerHTML = `<input type="text" class="editable-label" value="${this.defaultTitle}">`;
        headerRow.appendChild(titleCell);
        
        // Secondary headers
        this.defaultSecondary.forEach(condition => {
            const th = document.createElement('th');
            th.innerHTML = `<input type="text" class="editable-label" value="${condition}">`;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
    }

    createDataRows(table) {
        this.defaultPrimary.forEach(condition => {
            const row = document.createElement('tr');
            
            // Primary cell
            const primaryCell = document.createElement('td');
            primaryCell.innerHTML = this.createPrimaryCellContent(condition);
            row.appendChild(primaryCell);

            // Value cells
            this.defaultSecondary.forEach(() => {
                const td = document.createElement('td');
                td.className = 'matrix-cell';
                td.innerHTML = `<input type="number" value="0" min="-10" max="10" onchange="matrix.updateMatrix()">`;
                row.appendChild(td);
            });

            table.appendChild(row);
        });
    }

    createPrimaryCellContent(condition) {
        return `
            <div>
                <div style="margin-bottom: 0.5rem;">
                    <input type="text" class="editable-label" value="${condition}">
                </div>
                <div class="weight-control">
                    <button onclick="matrix.adjustWeight(this, -1)">-</button>
                    <input type="number" value="1" min="0" max="10" onchange="matrix.updateMatrix()">
                    <button onclick="matrix.adjustWeight(this, 1)">+</button>
                </div>
            </div>
        `;
    }

    addEdgeButtons(container, table) {
        container.appendChild(table);
        container.appendChild(this.createRightButtons());
        container.appendChild(this.createBottomButtons());
    }

    createRightButtons() {
        const rightButtons = document.createElement('div');
        rightButtons.className = 'matrix-edge-buttons right';
        rightButtons.innerHTML = `
            <button class="edge-button" onclick="matrix.addRow()" title="Add Row">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
            </button>
            <button class="edge-button" onclick="matrix.removeRow()" title="Remove Row">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                </svg>
            </button>
        `;
        return rightButtons;
    }

    createBottomButtons() {
        const bottomButtons = document.createElement('div');
        bottomButtons.className = 'matrix-edge-buttons bottom';
        bottomButtons.innerHTML = `
            <button class="edge-button" onclick="matrix.addColumn()" title="Add Column">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
            </button>
            <button class="edge-button" onclick="matrix.removeColumn()" title="Remove Column">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                </svg>
            </button>
        `;
        return bottomButtons;
    }

    adjustWeight(button, change) {
        const input = button.parentElement.querySelector('input');
        const newValue = Math.max(0, Math.min(10, parseInt(input.value) + change));
        input.value = newValue;
        this.updateMatrix();
    }

    updateMatrix() {
        const cells = document.querySelectorAll('.matrix-cell input');
        const isDynamicScale = document.getElementById('scaleToggle').checked;
        
        const { minWeightedValue, maxWeightedValue } = this.calculateWeightedValues(cells, isDynamicScale);
        
        this.updateScaleLabels(minWeightedValue, maxWeightedValue);
        this.updateCellColors(cells, minWeightedValue, maxWeightedValue);
    }

    calculateWeightedValues(cells, isDynamicScale) {
        let minWeightedValue = 0;
        let maxWeightedValue = 0;
        let hasNonZeroValues = false;
        
        cells.forEach(cell => {
            const weightedValue = this.getWeightedValue(cell);
            
            if (weightedValue !== 0) {
                hasNonZeroValues = true;
                if (minWeightedValue === 0) minWeightedValue = weightedValue;
                if (maxWeightedValue === 0) maxWeightedValue = weightedValue;
            }
            
            minWeightedValue = Math.min(minWeightedValue, weightedValue);
            maxWeightedValue = Math.max(maxWeightedValue, weightedValue);
        });

        if (!hasNonZeroValues) {
            minWeightedValue = -1;
            maxWeightedValue = 1;
        }

        if (!isDynamicScale) {
            const maxWeight = Math.max(...Array.from(document.querySelectorAll('.weight-control input'))
                .map(input => parseFloat(input.value)));
            minWeightedValue = -10 * maxWeight;
            maxWeightedValue = 10 * maxWeight;
        }

        return { minWeightedValue: minWeightedValue || -1, maxWeightedValue: maxWeightedValue || 1 };
    }

    getWeightedValue(cell) {
        const row = cell.closest('tr');
        const weight = parseFloat(row.querySelector('.weight-control input').value);
        const value = parseFloat(cell.value) || 0;
        return value * weight;
    }

    updateScaleLabels(min, max) {
        document.getElementById('minLabel').textContent = `Negative Impact (${min.toFixed(1)})`;
        document.getElementById('maxLabel').textContent = `Positive Impact (+${max.toFixed(1)})`;
    }

    updateCellColors(cells, minWeightedValue, maxWeightedValue) {
        cells.forEach(cell => {
            const weightedValue = this.getWeightedValue(cell);
            const color = this.calculateColor(weightedValue, minWeightedValue, maxWeightedValue);
            
            cell.parentElement.style.backgroundColor = color;
            cell.style.backgroundColor = color;
        });
    }

    calculateColor(weightedValue, minWeightedValue, maxWeightedValue) {
        if (weightedValue < 0) {
            const intensity = Math.min(Math.abs(weightedValue) / Math.abs(minWeightedValue), 1);
            return `rgba(255, 69, 58, ${intensity})`; // iOS-style red
        } else if (weightedValue > 0) {
            const intensity = Math.min(weightedValue / maxWeightedValue, 1);
            return `rgba(50, 215, 75, ${intensity})`; // iOS-style green
        }
        return 'rgba(255, 255, 255, 0.1)'; // Subtle dark mode neutral
    }

    addRow() {
        const table = document.querySelector('.matrix-table');
        const newRow = document.createElement('tr');
        const columnCount = table.rows[0].cells.length;
        
        // Primary cell
        const primaryCell = document.createElement('td');
        primaryCell.innerHTML = this.createPrimaryCellContent(`P${table.rows.length}`);
        newRow.appendChild(primaryCell);

        // Value cells
        for (let i = 1; i < columnCount; i++) {
            const td = document.createElement('td');
            td.className = 'matrix-cell';
            td.innerHTML = `<input type="number" value="0" min="-10" max="10" onchange="matrix.updateMatrix()">`;
            newRow.appendChild(td);
        }

        table.appendChild(newRow);
        this.updateMatrix();
    }

    removeRow() {
        const table = document.querySelector('.matrix-table');
        if (table.rows.length > 2) {
            table.deleteRow(table.rows.length - 1);
            this.updateMatrix();
        }
    }

    addColumn() {
        const table = document.querySelector('.matrix-table');
        
        // Add header
        const headerCell = document.createElement('th');
        headerCell.innerHTML = `<input type="text" class="editable-label" value="S${table.rows[0].cells.length}">`;
        table.rows[0].appendChild(headerCell);

        // Add cells
        for (let i = 1; i < table.rows.length; i++) {
            const td = document.createElement('td');
            td.className = 'matrix-cell';
            td.innerHTML = `<input type="number" value="0" min="-10" max="10" onchange="matrix.updateMatrix()">`;
            table.rows[i].appendChild(td);
        }

        this.updateMatrix();
    }

    removeColumn() {
        const table = document.querySelector('.matrix-table');
        if (table.rows[0].cells.length > 2) {
            for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].deleteCell(table.rows[i].cells.length - 1);
            }
            this.updateMatrix();
        }
    }

    copyAsMarkdown() {
        const table = document.querySelector('.matrix-table');
        let markdown = [];
        
        // Headers
        const headers = Array.from(table.rows[0].cells)
            .map(cell => cell.querySelector('.editable-label').value);
        markdown.push('| ' + headers.join(' | ') + ' |');
        markdown.push('| ' + headers.map(() => '---').join(' | ') + ' |');
        
        // Data rows
        for (let i = 1; i < table.rows.length; i++) {
            const row = table.rows[i];
            const rowData = this.getRowMarkdownData(row);
            markdown.push('| ' + rowData.join(' | ') + ' |');
        }

        // Copy to clipboard
        navigator.clipboard.writeText(markdown.join('\n'))
            .then(() => this.showToast('Copied to clipboard!'))
            .catch(err => this.showToast('Failed to copy: ' + err));
    }

    getRowMarkdownData(row) {
        const primaryInput = row.cells[0].querySelector('.editable-label');
        const weightInput = row.cells[0].querySelector('.weight-control input');
        const rowData = [`${primaryInput.value} (${weightInput.value})`];
        
        for (let j = 1; j < row.cells.length; j++) {
            const input = row.cells[j].querySelector('input');
            const value = parseFloat(input.value);
            const weight = parseFloat(weightInput.value);
            rowData.push((value * weight).toFixed(1));
        }
        
        return rowData;
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// Initialize the matrix
const matrix = new WeightedMatrix(); 