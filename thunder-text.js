class ThunderTextXtreme {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      color: 'cyan',
      intensity: 120,
      interval: 1200,
      arcsPerStrike: 6,
      arcSegments: 8,
      flickerDuration: 0.05,
      glowSize: 5,
      fadeDuration: 60,
      boltWidth: 4,
      maxBranches: 3
    }, options);

    this.setupTextStyling();
    this.setupCanvas();
    this.startLightning();
  }

  setupTextStyling() {
    const { color, intensity, glowSize } = this.options;
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
    this.element.style.color = '#fff';
    this.element.style.textShadow = `
      0 0 ${intensity * glowSize * 0.5}px ${color},
      0 0 ${intensity * glowSize * 0.8}px ${color},
      0 0 ${intensity * glowSize * 1.5}px ${color}
    `;

    if (!document.querySelector('style[data-thunder-text]')) {
      const flickerKeyframes = `
        @keyframes thunderFlicker {
          0%, 100% { opacity: 1; }
          44% { opacity: 0.9; }
          46% { opacity: 0.3; }
          48% { opacity: 1; }
          50% { opacity: 0.6; }
          52% { opacity: 1; }
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
    this.canvas.style.transition = 'opacity 0.1s ease-out';
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

  drawLightningArc(x, y, depth = 0) {
    const { color, arcSegments, boltWidth, maxBranches } = this.options;
    const { width, height } = this.canvas;
    let startX = x || Math.random() * width;
    let startY = y || 0;
    
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);

    for (let i = 0; i < arcSegments; i++) {
      startX += (Math.random() - 0.5) * (width * 0.4);
      startY += height / arcSegments;
      this.ctx.lineTo(startX, startY);

      // Randomly create branches
      if (Math.random() < 0.3 && depth < maxBranches) {
        this.drawLightningArc(startX, startY, depth + 1);
      }
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = Math.random() * boltWidth + 1;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 30;
    this.ctx.stroke();
  }

  lightningStrike() {
    const { arcsPerStrike, fadeDuration } = this.options;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.canvas.style.opacity = '1';
    for (let i = 0; i < arcsPerStrike; i++) {
      this.drawLightningArc();
    }

    setTimeout(() => {
      this.canvas.style.opacity = '0';
    }, fadeDuration);

    if (typeof gsap !== 'undefined') {
      gsap.to(this.element, {
        duration: 0.08,
        textShadow: `
          0 0 ${this.options.intensity * 3}px ${this.options.color},
          0 0 ${this.options.intensity * 5}px ${this.options.color}
        `,
        onComplete: () => {
          gsap.to(this.element, {
            duration: 0.15,
            textShadow: `
              0 0 ${this.options.intensity * 0.5}px ${this.options.color},
              0 0 ${this.options.intensity * 1}px ${this.options.color}
            `
          });
        }
      });
    } else {
      const originalShadow = this.element.style.textShadow;
      this.element.style.textShadow = `
        0 0 ${this.options.intensity * 3}px ${this.options.color},
        0 0 ${this.options.intensity * 5}px ${this.options.color}
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
    new ThunderTextXtreme(el, {
      color: el.dataset.color || 'cyan',
      intensity: parseInt(el.dataset.intensity) || 120,
      interval: parseInt(el.dataset.interval) || 1200,
      arcsPerStrike: parseInt(el.dataset.arcs) || 6,
      arcSegments: parseInt(el.dataset.segments) || 8,
      flickerDuration: parseFloat(el.dataset.flicker) || 0.05,
      glowSize: parseInt(el.dataset.glow) || 5,
      fadeDuration: parseInt(el.dataset.fade) || 60,
      boltWidth: parseInt(el.dataset.boltWidth) || 4,
      maxBranches: parseInt(el.dataset.branches) || 3
    });
  });
});
