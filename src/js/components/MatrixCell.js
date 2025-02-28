import { Input } from './Input.js';
import { getHeatmapColor } from '../utils.js';

export class MatrixCell {
    constructor(options = {}) {
        this.options = {
            value: '',
            weight: 1,
            isHeader: false,
            isPrimary: false,
            onChange: null,
            onWeightChange: null,
            minValue: 0,
            maxValue: 100,
            ...options
        };
        this.element = this.create();
    }

    create() {
        const cell = document.createElement('td');
        cell.className = `
            p-2
            transition-colors
            duration-200
            ${this.options.isHeader ? 'font-semibold' : ''}
            ${this.options.isPrimary ? 'text-right pr-4' : ''}
        `.trim();

        if (this.options.isHeader || this.options.isPrimary) {
            // Create editable text for headers
            const input = new Input({
                value: this.options.value,
                className: 'text-center',
                onChange: (value) => {
                    if (this.options.onChange) {
                        this.options.onChange(value);
                    }
                }
            });
            cell.appendChild(input.element);

            // Add weight controls for primary cells
            if (this.options.isPrimary) {
                const weightControls = this.createWeightControls();
                cell.appendChild(weightControls);
            }
        } else {
            // Create input for matrix values
            const input = new Input({
                type: 'number',
                value: this.options.value,
                className: 'text-center',
                onChange: (value) => {
                    if (this.options.onChange) {
                        this.options.onChange(value);
                    }
                    this.updateBackground(value);
                }
            });
            cell.appendChild(input.element);
        }

        return cell;
    }

    createWeightControls() {
        const container = document.createElement('div');
        container.className = 'flex items-center space-x-1 mt-1';

        const decreaseBtn = document.createElement('button');
        decreaseBtn.className = 'text-sm px-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700';
        decreaseBtn.textContent = '-';
        decreaseBtn.onclick = () => this.adjustWeight(-0.1);

        const weightSpan = document.createElement('span');
        weightSpan.className = 'text-sm min-w-[40px] text-center';
        weightSpan.textContent = `×${this.options.weight.toFixed(1)}`;

        const increaseBtn = document.createElement('button');
        increaseBtn.className = 'text-sm px-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700';
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => this.adjustWeight(0.1);

        container.appendChild(decreaseBtn);
        container.appendChild(weightSpan);
        container.appendChild(increaseBtn);

        return container;
    }

    adjustWeight(delta) {
        const newWeight = Math.max(0.1, Math.min(2, this.options.weight + delta));
        if (this.options.onWeightChange) {
            this.options.onWeightChange(newWeight);
        }
        this.update({ weight: newWeight });
    }

    updateBackground(value) {
        if (!this.options.isHeader && !this.options.isPrimary) {
            const normalizedValue = (value - this.options.minValue) / (this.options.maxValue - this.options.minValue);
            this.element.style.backgroundColor = getHeatmapColor(normalizedValue);
        }
    }

    render(container) {
        if (container instanceof HTMLElement) {
            container.appendChild(this.element);
        }
        return this.element;
    }

    update(options = {}) {
        this.options = { ...this.options, ...options };
        const newElement = this.create();
        this.element.replaceWith(newElement);
        this.element = newElement;
    }
} 