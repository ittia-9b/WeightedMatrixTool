export class Toast {
    constructor() {
        this.container = null;
        this.timeout = null;
        this.init();
    }

    init() {
        this.container = document.createElement('div');
        this.container.className = 'fixed bottom-4 right-4 transform transition-all duration-300 translate-y-full opacity-0';
        document.body.appendChild(this.container);
    }

    show(message, type = 'success', duration = 3000) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        const typeClasses = {
            success: 'bg-success text-white',
            error: 'bg-danger text-white',
            info: 'bg-primary text-white'
        };

        this.container.innerHTML = `
            <div class="px-4 py-2 rounded-lg shadow-lg ${typeClasses[type] || typeClasses.info}">
                ${message}
            </div>
        `;

        // Show toast
        requestAnimationFrame(() => {
            this.container.classList.remove('translate-y-full', 'opacity-0');
        });

        // Hide toast after duration
        this.timeout = setTimeout(() => {
            this.container.classList.add('translate-y-full', 'opacity-0');
        }, duration);
    }
} 