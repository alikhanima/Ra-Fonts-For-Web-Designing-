(function() {
  class ThreeDText extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            transform-style: preserve-3d;
          }

          .text {
            position: relative;
            transform-style: preserve-3d;
            font-size: inherit; /* Inherit font size from parent */
            font-weight: inherit; /* Inherit font weight */
            color: inherit; /* Inherit color */
            text-transform: inherit; /* Inherit text transform */
          }

          .front {
            transform: translateZ(20px);
          }

          .back {
            transform: translateZ(-20px);
            color: rgba(0, 0, 0, 0.5); /* Darker back */
          }

          .front, .back {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: nowrap; /* Prevent text wrapping */
          }
        </style>
        <div class="text">
          <div class="front"></div>
          <div class="back"></div>
        </div>
      `;
    }

    connectedCallback() {
      const textContent = this.textContent;
      this.shadowRoot.querySelector('.front').textContent = textContent;
      this.shadowRoot.querySelector('.back').textContent = textContent;
      this.textContent = ''; // Clear original text
    }
  }

  customElements.define('3d', ThreeDText);
})();
