import { getHeatmapColor } from '../utils.js';

export class HeatmapScale {
    constructor(options = {}) {
        this.options = {
            min: 0,
            max: 100,
            steps: 10,
            width: 200,
            height: 20,
            showLabels: true,
            ...options
        };
        this.element = this.create();
    }

    create() {
        const container = document.createElement('div');
        container.className = 'flex flex-col items-center space-y-2';

        // Create gradient bar
        const gradientBar = document.createElement('div');
        gradientBar.style.width = `${this.options.width}px`;
        gradientBar.style.height = `${this.options.height}px`;
        gradientBar.className = 'rounded overflow-hidden flex';

        // Create gradient segments
        for (let i = 0; i < this.options.steps; i++) {
            const segment = document.createElement('div');
            const value = i / (this.options.steps - 1);
            segment.style.backgroundColor = getHeatmapColor(value);
            segment.style.flex = '1';
            gradientBar.appendChild(segment);
        }

        container.appendChild(gradientBar);

        // Add labels if enabled
        if (this.options.showLabels) {
            const labels = document.createElement('div');
            labels.className = 'flex justify-between w-full text-sm dark:text-gray-300';
            
            const minLabel = document.createElement('span');
            minLabel.textContent = this.options.min;
            
            const maxLabel = document.createElement('span');
            maxLabel.textContent = this.options.max;
            
            labels.appendChild(minLabel);
            labels.appendChild(maxLabel);
            
            container.appendChild(labels);
        }

        return container;
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