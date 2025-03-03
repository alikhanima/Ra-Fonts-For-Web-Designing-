class ThunderText {
  constructor(element, options = {}) {
    this.element = element;
    this.options = Object.assign({
      // Color settings
      baseColor: '#00ffff',
      secondaryColor: '#ffffff',
      glowColor: '#00ffff',
      
      // Lightning behavior
      strikeInterval: [1500, 3000], // Min/max interval between strikes
      arcCount: [3, 6],             // Min/max arcs per strike
      branchProbability: 0.4,        // Chance to create branch
      maxBranchDepth: 3,             // Maximum branch generations
      
      // Visual properties
      baseIntensity: 100,
      maxFlashIntensity: 300,
      boltThickness: [1, 3],        // Min/max bolt thickness
      glowSpread: 15,
      trailFadeTime: 100,           // Milliseconds
      
      // Animation timing
      strikeDuration: 50,           // Main flash duration
      afterglowDuration: 300,       // Residual glow
      flickerSpeed: 0.05,
      
      // Physics-based parameters
      boltJitter: 0.8,              // 0-1 (0=straight, 1=chaotic)
      branchAngle: Math.PI/6,       // Max branch angle
      segmentLength: 15             // Pixels per bolt segment
    }, options);

    this.initStyles();
    this.setupCanvas();
    this.setupTimers();
  }

  initStyles() {
    // Container setup
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
    this.updateTextGlow(1);

    // Dynamic flicker animation
    if (!document.querySelector('style[data-thunder-text]')) {
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-thunder-text', '');
      styleTag.innerHTML = `
        @keyframes thunderFlicker {
          0%, 100% { opacity: 1; }
          30% { opacity: ${0.8 + Math.random() * 0.2}; }
          31% { opacity: ${0.2 + Math.random() * 0.3}; }
          50% { opacity: ${0.7 + Math.random() * 0.3}; }
        }
      `;
      document.head.appendChild(styleTag);
    }

    this.element.style.animation = 
      `thunderFlicker ${this.options.flickerSpeed}s infinite`;
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    Object.assign(this.canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      pointerEvents: 'none',
      opacity: '0',
      transition: `opacity ${this.options.trailFadeTime}ms ease-out`
    });
    this.element.prepend(this.canvas);
    this.updateCanvasSize();
    
    this.resizeObserver = new ResizeObserver(() => this.updateCanvasSize());
    this.resizeObserver.observe(this.element);
  }

  updateCanvasSize() {
    const rect = this.element.getBoundingClientRect();
    [this.canvas.width, this.canvas.height] = [rect.width, rect.height];
  }

  createBolt(x1, y1, x2, y2, thickness, depth = 0) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    
    let currentX = x1;
    let currentY = y1;
    const segments = Math.max(3, dist / this.options.segmentLength);
    
    for (let i = 1; i <= segments; i++) {
      const progress = i / segments;
      const variance = this.options.boltJitter * (1 - progress) * dist / 4;
      
      const midX = currentX + dx/segments + (Math.random() - 0.5) * variance;
      const midY = currentY + dy/segments + (Math.random() - 0.5) * variance;
      
      this.ctx.lineTo(midX, midY);
      
      // Create branches
      if (depth < this.options.maxBranchDepth && 
          Math.random() < this.options.branchProbability) {
        const branchAngle = angle + (Math.random() - 0.5) * this.options.branchAngle;
        const branchLength = dist * (0.2 + Math.random() * 0.3);
        this.createBolt(
          midX, midY,
          midX + Math.cos(branchAngle) * branchLength,
          midY + Math.sin(branchAngle) * branchLength,
          thickness * 0.7,
          depth + 1
        );
      }
      
      currentX = midX;
      currentY = midY;
    }
    
    this.ctx.strokeStyle = this.options.baseColor;
    this.ctx.lineWidth = thickness;
    this.ctx.shadowColor = this.options.glowColor;
    this.ctx.shadowBlur = this.options.glowSpread;
    this.ctx.stroke();
  }

  animateLightning() {
    // Randomize strike parameters
    const boltCount = Math.floor(Math.random() * 
      (this.options.arcCount[1] - this.options.arcCount[0])) + this.options.arcCount[0];
    const baseThickness = Math.random() * 
      (this.options.boltThickness[1] - this.options.boltThickness[0]) + this.options.boltThickness[0];

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.style.opacity = '1';

    // Create multiple bolts
    for (let i = 0; i < boltCount; i++) {
      const startX = Math.random() * this.canvas.width;
      this.createBolt(
        startX, 0,
        startX + (Math.random() - 0.5) * this.canvas.width/4,
        this.canvas.height,
        baseThickness
      );
    }

    // Fade out effect
    setTimeout(() => {
      this.canvas.style.opacity = '0';
    }, this.options.trailFadeTime);

    // Text flash effect
    this.updateTextGlow(1.8);
    setTimeout(() => this.updateTextGlow(1.2), this.options.strikeDuration);
    setTimeout(() => this.updateTextGlow(1), this.options.afterglowDuration);
  }

  updateTextGlow(intensityMultiplier = 1) {
    const intensity = this.options.baseIntensity * intensityMultiplier;
    this.element.style.textShadow = `
      0 0 ${intensity * 0.3}px ${this.options.glowColor},
      0 0 ${intensity * 0.6}px ${this.options.glowColor},
      0 0 ${intensity}px ${this.options.baseColor},
      0 0 ${intensity * 1.2}px ${this.options.secondaryColor}
    `;
  }

  setupTimers() {
    const nextStrike = () => {
      const delay = Math.random() * 
        (this.options.strikeInterval[1] - this.options.strikeInterval[0]) + 
        this.options.strikeInterval[0];
        
      this.timeout = setTimeout(() => {
        this.animateLightning();
        nextStrike();
      }, delay);
    };
    nextStrike();
  }

  destroy() {
    clearTimeout(this.timeout);
    this.resizeObserver.disconnect();
    this.canvas.remove();
    this.element.style.cssText = '';
  }
}

// Auto-initialization with data attributes
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.thunder-text').forEach(el => {
    new ThunderText(el, {
      baseColor: el.dataset.baseColor || '#00ffff',
      secondaryColor: el.dataset.secondaryColor || '#ffffff',
      glowColor: el.dataset.glowColor || '#00ffff',
      strikeInterval: JSON.parse(el.dataset.interval || '[1500, 3000]'),
      arcCount: JSON.parse(el.dataset.arcs || '[3, 6]'),
      branchProbability: parseFloat(el.dataset.branchProb || 0.4),
      maxBranchDepth: parseInt(el.dataset.maxBranches || 3),
      boltThickness: JSON.parse(el.dataset.boltSize || '[1, 3]'),
      glowSpread: parseInt(el.dataset.glow || 15),
      trailFadeTime: parseInt(el.dataset.fade || 100),
      strikeDuration: parseInt(el.dataset.flash || 50),
      afterglowDuration: parseInt(el.dataset.glowTime || 300),
      flickerSpeed: parseFloat(el.dataset.flicker || 0.05),
      boltJitter: parseFloat(el.dataset.jitter || 0.8),
      branchAngle: Math.PI/(parseFloat(el.dataset.branchAngle || 6)),
      segmentLength: parseInt(el.dataset.segment || 15),
      baseIntensity: parseInt(el.dataset.intensity || 100)
    });
  });
});
