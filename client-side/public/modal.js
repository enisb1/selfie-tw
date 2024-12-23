class Modal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML =
        `
        <link rel="stylesheet" href="output.css"/>
        <div class="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-20">
            <div class="top-1/4 absolute bg-primary text-black w-3/4 left-1/2 -translate-x-1/2 p-4
                rounded-md shadow-sm ring-1 ring-inset ring-gray-300">
                <slot></slot>
            </div>
        </div>
        `;
    }
}

customElements.define('modal-component', Modal);