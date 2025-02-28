import { Matrix } from './components/Matrix.js';
import { Export } from './components/Export.js';

class App {
    constructor() {
        this.matrix = null;
        this.export = null;
        this.init();
    }

    init() {
        // Prevent right-click context menu
        document.addEventListener('contextmenu', event => event.preventDefault());
        
        // Initialize components
        this.initializeMatrix();
        this.initializeExport();
        this.setupEventListeners();
    }

    initializeMatrix() {
        this.matrix = new Matrix();
    }

    initializeExport() {
        this.export = new Export();
    }

    setupEventListeners() {
        // Column control events
        const columnControl = document.getElementById('columnControl');
        columnControl.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.addColumn();
            } else if (e.button === 2) {
                this.removeColumn();
            }
        });

        // Row control events
        const rowControl = document.getElementById('rowControl');
        rowControl.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.addRow();
            } else if (e.button === 2) {
                this.removeRow();
            }
        });

        // Export events
        document.querySelector('.export-controls button').addEventListener('click', () => {
            this.export.copyAsMarkdown();
        });

        // Reset matrix event
        document.querySelector('.intro-section button').addEventListener('click', () => {
            this.resetMatrix();
        });
    }

    addColumn() {
        const table = document.querySelector('.matrix-table');
        
        const headerCell = document.createElement('th');
        headerCell.innerHTML = `<input type="text" class="editable-label" value="S${table.rows[0].cells.length}">`;
        table.rows[0].appendChild(headerCell);

        for (let i = 1; i < table.rows.length; i++) {
            const td = document.createElement('td');
            td.className = 'matrix-cell';
            const span = document.createElement('span');
            span.textContent = '0';
            td.appendChild(span);
            this.matrix.setupCellControl(td);
            table.rows[i].appendChild(td);
        }

        this.matrix.updateMatrix();
    }

    removeColumn() {
        const table = document.querySelector('.matrix-table');
        if (table.rows[0].cells.length > 2) {
            for (let i = 0; i < table.rows.length; i++) {
                table.rows[i].deleteCell(table.rows[i].cells.length - 1);
            }
            this.matrix.updateMatrix();
        }
    }

    addRow() {
        const table = document.querySelector('.matrix-table');
        const newRow = document.createElement('tr');
        const columnCount = table.rows[0].cells.length;
        
        const primaryCell = document.createElement('td');
        primaryCell.innerHTML = `
            <div>
                <input type="text" class="editable-label" value="P${table.rows.length}">
                <div class="weight-control">
                    <span>1</span>
                </div>
            </div>
        `;

        this.matrix.setupWeightControl(primaryCell);
        newRow.appendChild(primaryCell);

        for (let i = 1; i < columnCount; i++) {
            const td = document.createElement('td');
            td.className = 'matrix-cell';
            const span = document.createElement('span');
            span.textContent = '0';
            td.appendChild(span);
            this.matrix.setupCellControl(td);
            newRow.appendChild(td);
        }

        table.appendChild(newRow);
        this.matrix.updateMatrix();
    }

    removeRow() {
        const table = document.querySelector('.matrix-table');
        if (table.rows.length > 2) {
            table.deleteRow(table.rows.length - 1);
            this.matrix.updateMatrix();
        }
    }

    resetMatrix() {
        const table = document.querySelector('.matrix-table');
        table.innerHTML = '';
        this.matrix = new Matrix();
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 