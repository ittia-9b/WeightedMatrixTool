export class Button {
    constructor(text, options = {}) {
        this.text = text;
        this.options = {
            type: 'primary',
            size: 'md',
            disabled: false,
            onClick: null,
            ...options
        };
        this.element = this.create();
    }

    create() {
        const button = document.createElement('button');
        
        // Base classes
        const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2';
        
        // Size classes
        const sizeClasses = {
            sm: 'px-2 py-1 text-sm',
            md: 'px-4 py-2',
            lg: 'px-6 py-3 text-lg'
        };
        
        // Type classes
        const typeClasses = {
            primary: 'bg-primary hover:bg-primary-hover text-white focus:ring-primary/50',
            secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
            danger: 'bg-danger hover:bg-danger/80 text-white focus:ring-danger/50'
        };

        // Combine classes
        button.className = `
            ${baseClasses}
            ${sizeClasses[this.options.size]}
            ${typeClasses[this.options.type]}
            ${this.options.disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `.trim();

        button.textContent = this.text;
        button.disabled = this.options.disabled;

        if (this.options.onClick && !this.options.disabled) {
            button.addEventListener('click', this.options.onClick);
        }

        return button;
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