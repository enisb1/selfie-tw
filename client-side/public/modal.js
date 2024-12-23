class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML =
        `
        <link rel="stylesheet" href="output.css"/>
        <div class="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-20" id="modal">
            <div class="top-1/4 absolute bg-primary text-black w-3/4 left-1/2 -translate-x-1/2 p-4
                rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
                <slot></slot>
            </div>
        </div>
        `;
        
        // listener to close modal when clicking outside
        this.modal = this.shadowRoot.getElementById('modal');

        // Add event listener to close modal when clicking outside the modal content
        this.shadowRoot.querySelector('#modal').addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                this.close();
            }
        });
    }

    close() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('block');
    }

    open() {
        this.modal.classList.remove('hidden');
        this.modal.classList.add('block');
    }
}

customElements.define('modal-component', Modal);