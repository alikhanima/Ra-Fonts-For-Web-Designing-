(function() {
  class ThreeDText extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: inline-block;
            perspective: 1000px; 
            transform-style: preserve-3d;
          }

          .text {
            position: relative;
            transform-style: preserve-3d;
            font-size: inherit;
            font-weight: inherit;
            color: inherit;
            text-transform: inherit;
            transition: transform 0.2s ease; 
          }

          :host(:hover) .text {
            transform: rotateY(15deg); 
          }

          .front {
            transform: translateZ(10px); 
          }

          .back {
            transform: translateZ(-10px);
            color: rgba(0, 0, 0, 0.7); 
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

          @keyframes rotate {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
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
      this.textContent = '';

      setTimeout(() => {
        this.shadowRoot.querySelector('.text').style.animation = 'rotate 3s linear infinite';
      }, 100);
    }
  }

  customElements.define('3d', ThreeDText);
})();
