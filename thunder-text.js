const ThunderText = (() => {
  const PARTICLE_POOL_SIZE = 200;
  let particlePool = [];

  class ThunderText extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.animationFrame = null;
      this.config = {
        color: '#00f7ff',
        intensity: 1,
        speed: 1,
        interval: 3000
      };
    }

    connectedCallback() {
      this._initializeComponent();
      this._createParticlePool();
      this._startAnimationLoop();
    }

    static get observedAttributes() {
      return ['color', 'intensity', 'speed', 'interval'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal !== newVal) {
        this._handleAttributeChange(name, newVal);
      }
    }

    _initializeComponent() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            --thunder-color: ${this.config.color};
            --intensity: ${this.config.intensity};
            --speed: ${this.config.speed};
          }
          ${this._componentStyles()}
        </style>
        <slot></slot>
      `;
    }

    _componentStyles() {
      return `
        /* CSS styles with dynamic variables */
        .lightning-particle {
          position: fixed;
          background: var(--thunder-color);
          border-radius: 50%;
          filter: blur(2px);
          pointer-events: none;
        }
        
        /* SVG filters and animations */
      `;
    }

    _createParticlePool() {
      for (let i = 0; i < PARTICLE_POOL_SIZE; i++) {
        const particle = document.createElement('div');
        particle.className = 'lightning-particle';
        particle.style.display = 'none';
        this.shadowRoot.appendChild(particle);
        particlePool.push(particle);
      }
    }

    _startAnimationLoop() {
      const animate = () => {
        this._updateParticles();
        this.animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    _updateParticles() {
      // Particle animation logic using GSAP
    }

    _handleAttributeChange(name, value) {
      switch(name) {
        case 'color':
          this._updateColor(value);
          break;
        case 'intensity':
          this._updateIntensity(value);
          break;
        // Additional cases...
      }
    }

    _updateColor(newColor) {
      this.shadowRoot.host.style.setProperty('--thunder-color', newColor);
    }

    // Additional update methods...
  }

  customElements.define('thunder-text', ThunderText);
  return ThunderText;
})();
// Particle system using physics-based animations
_createLightningStrike() {
  const particles = particlePool.splice(0, 30);
  const rect = this.getBoundingClientRect();

  particles.forEach(particle => {
    particle.style.display = 'block';
    gsap.fromTo(particle, {
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height,
      scale: 0,
      opacity: 1
    }, {
      duration: 0.8 * this.config.speed,
      x: `+=${(Math.random() - 0.5) * 200}`,
      y: `+=${Math.random() * 300}`,
      scale: 1.5,
      opacity: 0,
      ease: "power3.out",
      onComplete: () => {
        particle.style.display = 'none';
        particlePool.push(particle);
      }
    });
  });
}