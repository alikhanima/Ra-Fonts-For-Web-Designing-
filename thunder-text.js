class ThunderText {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      color: 'cyan',
      intensity: 100,
      interval: 1200,
      arcsPerStrike: 6,
      arcSegments: 8,
      glow: 5,
      boltWidth: 4,
      branches: 3,
      branchChance: 0.3,
      branchAngle: 30,
      flickerDuration: 0.05,
      fadeSpeed: 60
    }, options);

    this.setupTextStyling();
    this.setupCanvas();
    this.startLightning();
  }

  setupTextStyling() {
    const { color, intensity, glow } = this.options;
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
    this.element.style.color = '#fff';
    this.element.style.textShadow = `
      0 0 ${glow}px ${color},
      0 0 ${glow * 2}px ${color},
      0 0 ${intensity}px ${color}
    `;

    if (!document.querySelector('style[data-thunder-text]')) {
      const flickerKeyframes = `
        @keyframes thunderFlicker {
          0%, 100% { opacity: 1; }
          30% { opacity: 0.95; }
          31% { opacity: 0.3; }
          32% { opacity: 0.9; }
          33% { opacity: 1; }
          34% { opacity: 0.7; }
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

  drawLightningArc(startX, startY, endY, branch = false) {
    const { color, arcSegments, boltWidth, branches, branchChance, branchAngle } = this.options;
    let x = startX;
    let y = startY;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    for (let i = 0; i < arcSegments; i++) {
      x += (Math.random() - 0.5) * (this.canvas.width * 0.3);
      y += endY / arcSegments;
      this.ctx.lineTo(x, y);

      // Randomly generate branches
      if (!branch && Math.random() < branchChance) {
        this.drawLightningArc(x, y, endY, true);
      }
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = branch ? boltWidth / 2 : boltWidth;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();
  }

  lightningStrike() {
    const { arcsPerStrike, fadeSpeed } = this.options;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.canvas.style.opacity = '1';
    for (let i = 0; i < arcsPerStrike; i++) {
      let x = Math.random() * this.canvas.width;
      this.drawLightningArc(x, 0, this.canvas.height);
    }
    
    setTimeout(() => {
      this.canvas.style.opacity = '0';
    }, fadeSpeed);

    if (typeof gsap !== 'undefined') {
      gsap.to(this.element, {
        duration: 0.1,
        textShadow: `
          0 0 ${this.options.intensity * 2}px ${this.options.color},
          0 0 ${this.options.intensity * 2.5}px ${this.options.color}
        `,
        onComplete: () => {
          gsap.to(this.element, {
            duration: 0.3,
            textShadow: `
              0 0 ${this.options.glow}px ${this.options.color},
              0 0 ${this.options.glow * 2}px ${this.options.color},
              0 0 ${this.options.intensity}px ${this.options.color}
            `
          });
        }
      });
    } else {
      let originalShadow = this.element.style.textShadow;
      this.element.style.textShadow = `
        0 0 ${this.options.intensity * 2}px ${this.options.color},
        0 0 ${this.options.intensity * 2.5}px ${this.options.color}
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.thunder-text').forEach(el => {
    new ThunderText(el, {
      color: el.dataset.color || 'cyan',
      intensity: parseInt(el.dataset.intensity) || 100,
      interval: parseInt(el.dataset.interval) || 1200,
      arcsPerStrike: parseInt(el.dataset.arcs) || 6,
      arcSegments: parseInt(el.dataset.segments) || 8,
      glow: parseInt(el.dataset.glow) || 5,
      boltWidth: parseInt(el.dataset.boltwidth) || 4,
      branches: parseInt(el.dataset.branches) || 3,
      branchChance: parseFloat(el.dataset.branchchance) || 0.3,
      branchAngle: parseInt(el.dataset.branchangle) || 30,
      flickerDuration: parseFloat(el.dataset.flicker) || 0.05,
      fadeSpeed: parseInt(el.dataset.fade) || 60
    });
  });
});
