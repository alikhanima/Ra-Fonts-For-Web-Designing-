(function() {
  class ThreeDText extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            perspective: 500px;
            transform-style: preserve-3d;
          }

          .text {
            position: relative;
            transform-style: preserve-3d;
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
            text-transform: inherit;
          }

          .front {
            transform: translateZ(5px);
          }

          .back {
            transform: translateZ(-5px);
            color: rgba(0, 0, 0, 0.5);
          }

          .front, .back {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
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
