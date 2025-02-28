export class Input {
    constructor(options = {}) {
        this.options = {
            type: 'text',
            value: '',
            placeholder: '',
            onChange: null,
            onFocus: null,
            onBlur: null,
            className: '',
            ...options
        };
        this.element = this.create();
    }

    create() {
        const input = document.createElement('input');
        
        // Base classes for all inputs
        const baseClasses = `
            w-full
            bg-transparent
            border-none
            focus:outline-none
            focus:ring-1
            focus:ring-primary
            rounded
            transition-all
            duration-200
            dark:text-white
            ${this.options.className}
        `.trim();

        input.className = baseClasses;
        input.type = this.options.type;
        input.value = this.options.value;
        input.placeholder = this.options.placeholder;

        // Event listeners
        if (this.options.onChange) {
            input.addEventListener('input', (e) => this.options.onChange(e.target.value, e));
        }
        
        if (this.options.onFocus) {
            input.addEventListener('focus', this.options.onFocus);
        }
        
        if (this.options.onBlur) {
            input.addEventListener('blur', this.options.onBlur);
        }

        return input;
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

    getValue() {
        return this.element.value;
    }

    setValue(value) {
        this.element.value = value;
    }

    focus() {
        this.element.focus();
    }

    blur() {
        this.element.blur();
    }
} 