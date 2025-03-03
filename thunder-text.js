class ThunderText {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      baseColor: '#00ffff',
      glowColor: '#00ffff',
      secondaryColor: '#ffffff',
      intensity: 150,
      boltWidth: [2, 5],
      segmentLength: 20,
      jitter: 0.8,
      branchProbability: 0.5,
      maxBranchDepth: 3,
      flickerSpeed: 0.08,
      strikeInterval: [2000, 5000],
      flashDuration: 100,
      afterglowDuration: 400,
      glowSpread: 20
    }, options);

    this.init();
  }

  init() {
    this.setupTextEffects();
    this.createCanvas();
    this.startLightning();
  }

  setupTextEffects() {
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
    this.updateTextGlow(1);

    if (!document.querySelector('style[data-thunder-text]')) {
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-thunder-text', '');
      styleTag.innerHTML = `
        @keyframes thunderFlicker {
          0%, 100% { opacity: 1; }
          30% { opacity: ${0.9}; }
          31% { opacity: ${0.3}; }
          50% { opacity: ${0.7}; }
        }
      `;
      document.head.appendChild(styleTag);
    }

    this.element.style.animation = `thunderFlicker ${this.options.flickerSpeed}s infinite`;
  }

  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    Object.assign(this.canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      pointerEvents: 'none',
      opacity: '0',
      transition: `opacity ${this.options.afterglowDuration}ms ease-out`
    });
    this.element.prepend(this.canvas);
    this.updateCanvasSize();

    this.resizeObserver = new ResizeObserver(() => this.updateCanvasSize());
    this.resizeObserver.observe(this.element);
  }

  updateCanvasSize() {
    const rect = this.element.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  drawLightning(startX, startY, endX, endY, thickness, depth = 0) {
    const dx = endX - startX;
    const dy = endY - startY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);

    let x = startX;
    let y = startY;
    let segments = Math.max(3, dist / this.options.segmentLength);

    for (let i = 0; i < segments; i++) {
      const variance = this.options.jitter * (1 - i / segments) * dist * 0.2;
      x += dx / segments + (Math.random() - 0.5) * variance;
      y += dy / segments + (Math.random() - 0.5) * variance;
      this.ctx.lineTo(x, y);

      if (depth < this.options.maxBranchDepth && Math.random() < this.options.branchProbability) {
        const branchAngle = angle + (Math.random() - 0.5) * Math.PI / 4;
        const branchLength = dist * (0.3 + Math.random() * 0.2);
        this.drawLightning(x, y, x + Math.cos(branchAngle) * branchLength, y + Math.sin(branchAngle) * branchLength, thickness * 0.7, depth + 1);
      }
    }

    this.ctx.strokeStyle = this.options.baseColor;
    this.ctx.lineWidth = thickness;
    this.ctx.shadowColor = this.options.glowColor;
    this.ctx.shadowBlur = this.options.glowSpread;
    this.ctx.stroke();
  }

  animateLightning() {
    const boltCount = Math.floor(Math.random() * (3 - 1)) + 1;
    const baseThickness = Math.random() * (this.options.boltWidth[1] - this.options.boltWidth[0]) + this.options.boltWidth[0];

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.style.opacity = '1';

    for (let i = 0; i < boltCount; i++) {
      const startX = Math.random() * this.canvas.width;
      this.drawLightning(startX, 0, startX + (Math.random() - 0.5) * this.canvas.width / 4, this.canvas.height, baseThickness);
    }

    setTimeout(() => { this.canvas.style.opacity = '0'; }, this.options.afterglowDuration);

    this.updateTextGlow(2);
    setTimeout(() => this.updateTextGlow(1.2), this.options.flashDuration);
    setTimeout(() => this.updateTextGlow(1), this.options.afterglowDuration);
  }

  updateTextGlow(intensityMultiplier = 1) {
    const intensity = this.options.intensity * intensityMultiplier;
    this.element.style.textShadow = `
      0 0 ${intensity * 0.3}px ${this.options.glowColor},
      0 0 ${intensity * 0.6}px ${this.options.glowColor},
      0 0 ${intensity}px ${this.options.baseColor},
      0 0 ${intensity * 1.2}px ${this.options.secondaryColor}
    `;
  }

  startLightning() {
    const strike = () => {
      const delay = Math.random() * (this.options.strikeInterval[1] - this.options.strikeInterval[0]) + this.options.strikeInterval[0];
      this.timeout = setTimeout(() => {
        this.animateLightning();
        strike();
      }, delay);
    };
    strike();
  }

  destroy() {
    clearTimeout(this.timeout);
    this.resizeObserver.disconnect();
    this.canvas.remove();
    this.element.style.cssText = '';
  }
}

// Auto-initialize elements with `.thunder-text`
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.thunder-text').forEach(el => {
    new ThunderText(el);
  });
});
