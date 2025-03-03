class ThunderTextXtreme {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      color: 'cyan',
      intensity: 120,         // Base intensity for glow
      interval: 1200,         // Milliseconds between strikes
      arcsPerStrike: 6,       // How many separate lightning bolts per strike
      arcSegments: 8,         // How many segments in each bolt (controls jaggedness)
      flickerDuration: 0.05,  // CSS flicker animation duration (seconds)
      glowSize: 5,            // Multiplier for text glow
      fadeDuration: 60,       // How quickly the drawn bolt fades (ms)
      boltWidth: 4,           // Base bolt width in pixels
      maxBranches: 3,         // Maximum recursive branch depth
      branchChance: 0.3,      // Chance of a branch occurring at any segment
      branchAngle: 30         // Maximum deviation in degrees for a branch
    }, options);

    this.setupTextStyling();
    this.setupCanvas();
    this.startLightning();
  }

  setupTextStyling() {
    const { color, intensity, glowSize } = this.options;
    // Ensure the text element is positioned relative for canvas overlay
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
    this.element.style.color = '#fff';
    this.element.style.textShadow = `
      0 0 ${intensity * glowSize * 0.5}px ${color},
      0 0 ${intensity * glowSize * 0.8}px ${color},
      0 0 ${intensity * glowSize * 1.5}px ${color}
    `;

    // Add a CSS flicker keyframe if not already added
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
    // Create an overlay canvas for drawing lightning arcs
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
    // Make the canvas match the size of the text element
    const rect = this.element.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  drawLightningSegment(x, y, length, angle, depth) {
    // Recursively draw a lightning segment with optional branching
    if (depth > this.options.arcSegments) return;

    // Calculate end coordinates with some random jitter
    let dx = x + length * Math.cos(angle) + (Math.random() - 0.5) * 10;
    let dy = y + length * Math.sin(angle) + (Math.random() - 0.5) * 10;

    this.ctx.lineTo(dx, dy);

    // Random chance to create a branch if within allowed depth
    if (depth < this.options.maxBranches && Math.random() < this.options.branchChance) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(dx, dy);
      // New branch angle with a small random deviation
      let branchAngle = angle + (Math.random() - 0.5) * (this.options.branchAngle * Math.PI / 180);
      this.drawLightningSegment(dx, dy, length * 0.6, branchAngle, depth + 1);
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Continue drawing the main bolt recursively
    this.drawLightningSegment(dx, dy, length, angle, depth + 1);
  }

  drawLightningArc() {
    const { width, height } = this.canvas;
    const { color, boltWidth } = this.options;

    this.ctx.beginPath();
    // Start at a random x along the top edge
    let startX = Math.random() * width;
    let startY = 0;
    this.ctx.moveTo(startX, startY);

    // Start with a downward angle (around 90°) with some variation
    let angle = (Math.PI / 2) + (Math.random() - 0.5) * (Math.PI / 8);
    let segmentLength = height / this.options.arcSegments;

    this.drawLightningSegment(startX, startY, segmentLength, angle, 0);

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = Math.random() * boltWidth + 1;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 30;
    this.ctx.stroke();
  }

  lightningStrike() {
    const { arcsPerStrike, fadeDuration } = this.options;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Display the lightning bolts on the canvas
    this.canvas.style.opacity = '1';
    for (let i = 0; i < arcsPerStrike; i++) {
      this.drawLightningArc();
    }

    // Fade the lightning quickly
    setTimeout(() => {
      this.canvas.style.opacity = '0';
    }, fadeDuration);

    // Animate the text glow using GSAP if available
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
      // Fallback flash effect without GSAP
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

// Auto-initialize for all elements with the class 'thunder-text'
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
      boltWidth: parseInt(el.dataset.boltwidth) || 4,
      maxBranches: parseInt(el.dataset.branches) || 3,
      branchChance: parseFloat(el.dataset.branchchance) || 0.3,
      branchAngle: parseFloat(el.dataset.branchangle) || 30
    });
  });
});
