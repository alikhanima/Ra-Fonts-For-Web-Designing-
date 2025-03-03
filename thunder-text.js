// thunder-text.js
class ThunderText {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      color: 'aqua',
      intensity: 60,
      interval: 2000,
      arcsPerStrike: 3,
      arcSegments: 4,
      flickerDuration: 0.1
    }, options);

    this.setupTextStyling();
    this.setupCanvas();
    this.startLightning();
  }

  setupTextStyling() {
    const { color, intensity } = this.options;
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
    this.element.style.color = '#fff';
    this.element.style.textShadow = `
      0 0 ${intensity * 0.3}px ${color},
      0 0 ${intensity * 0.6}px ${color},
      0 0 ${intensity * 1.2}px ${color}
    `;

    // Add keyframes only once
    if (!document.querySelector('style[data-thunder-text]')) {
      const flickerKeyframes = `
        @keyframes thunderFlicker {
          0%, 100% { opacity: 1; }
          45%      { opacity: 0.95; }
          46%      { opacity: 0.5; }
          47%      { opacity: 0.8; }
          48%      { opacity: 1; }
          49%      { opacity: 0.9; }
        }
      `;
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-thunder-text', '');
      styleTag.innerHTML = flickerKeyframes;
      document.head.appendChild(styleTag);
    }

    this.element.style.animation = `thunderFlicker ${this.options.flickerDuration}s infinite`;
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.transition = 'opacity 0.3s ease-out';
    this.canvas.style.opacity = '0';

    this.element.appendChild(this.canvas);
    this.updateCanvasSize();

    this.resizeObserver = new ResizeObserver(() => this.updateCanvasSize());
    this.resizeObserver.observe(this.element);
  }

  updateCanvasSize() {
    const rect = this.element.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  drawLightningArc() {
    const { color, arcSegments } = this.options;
    const { width, height } = this.canvas;
    let x = Math.random() * width;
    let y = 0;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    for (let i = 0; i < arcSegments; i++) {
      x += (Math.random() - 0.5) * (width * 0.3);
      y += height / arcSegments;
      this.ctx.lineTo(x, y);
    }
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = Math.random() * 2 + 1;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 15;
    this.ctx.stroke();
  }

  lightningStrike() {
    const { arcsPerStrike } = this.options;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Make canvas visible and draw new arcs
    this.canvas.style.opacity = '1';
    for (let i = 0; i < arcsPerStrike; i++) {
      this.drawLightningArc();
    }
    
    // Start fade out after short delay
    setTimeout(() => {
      this.canvas.style.opacity = '0';
    }, 50);

    // GSAP flash effect if available
    if (typeof gsap !== 'undefined') {
      gsap.to(this.element, {
        duration: 0.1,
        textShadow: `
          0 0 ${this.options.intensity * 1.5}px ${this.options.color},
          0 0 ${this.options.intensity * 2}px ${this.options.color}
        `,
        onComplete: () => {
          gsap.to(this.element, {
            duration: 0.2,
            textShadow: `
              0 0 ${this.options.intensity * 0.3}px ${this.options.color},
              0 0 ${this.options.intensity * 0.6}px ${this.options.color},
              0 0 ${this.options.intensity * 1.2}px ${this.options.color}
            `
          });
        }
      });
    } else {
      // Fallback flash effect
      const originalShadow = this.element.style.textShadow;
      this.element.style.textShadow = `
        0 0 ${this.options.intensity * 1.5}px ${this.options.color},
        0 0 ${this.options.intensity * 2}px ${this.options.color}
      `;
      setTimeout(() => {
        this.element.style.textShadow = originalShadow;
      }, 100);
    }
  }

  startLightning() {
    this.lightningStrike();
    setInterval(() => this.lightningStrike(), this.options.interval);
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.canvas.remove();
  }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.thunder-text').forEach(el => {
    new ThunderText(el, {
      color: el.dataset.color || 'aqua',
      intensity: parseInt(el.dataset.intensity) || 60,
      interval: parseInt(el.dataset.interval) || 2000,
      arcsPerStrike: parseInt(el.dataset.arcs) || 3,
      arcSegments: parseInt(el.dataset.segments) || 4,
      flickerDuration: parseFloat(el.dataset.flicker) || 0.1
    });
  });
});
