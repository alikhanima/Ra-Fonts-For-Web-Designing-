class ThunderText {
    constructor(element) {
        this.element = element;
        this.particles = [];
        this.init();
    }

    init() {
        this.config = {
            color: this.element.dataset.color || '#00f7ff', // Default color for text
            intensity: parseFloat(this.element.dataset.intensity) || 1,
            glowIntensity: parseFloat(this.element.dataset.glowIntensity) || 2, // Increased glow intensity
            shadowBlur: this.element.dataset.shadowBlur || '50px', // Increased blur for better glow effect
            particleSize: this.element.dataset.particleSize || '6px',
            animationSpeed: parseFloat(this.element.dataset.animationSpeed) || 0.5,
            interval: 2000
        };

        // Apply the color directly to the text
        this.element.style.color = this.config.color;

        // Apply the neon glow effect to text using text-shadow
        this.element.style.textShadow = `0 0 ${this.config.shadowBlur} rgba(0, 247, 255, ${this.config.glowIntensity}), 0 0 ${parseInt(this.config.shadowBlur) * 0.8}px rgba(0, 247, 255, ${this.config.glowIntensity * 0.7})`;

        this.element.style.setProperty('--thunder-color', this.config.color);
        this.element.style.setProperty('--glow-intensity', this.config.glowIntensity);
        this.element.style.setProperty('--shadow-blur', this.config.shadowBlur);
        this.element.style.setProperty('--particle-size', this.config.particleSize);
        this.element.style.setProperty('--animation-speed', this.config.animationSpeed);

        this.createParticles();
        this.animateText();
        this.setupHover();
    }

    createParticles() {
        const particleCount = 100 * this.config.intensity;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'thunder-particle';
            this.element.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animateText() {
        const text = this.element.innerText;
        this.element.innerHTML = text.split('').map(c =>
            `<span>${c}</span>`
        ).join('');

        gsap.to(this.element.children, {
            y: () => Math.random() * 10 - 5,
            duration: this.config.animationSpeed,
            repeat: -1,
            yoyo: true
        });
    }

    setupHover() {
        this.element.addEventListener('mouseenter', () => this.thunderStrike());
        setInterval(() => this.thunderStrike(), this.config.interval);
    }

    thunderStrike() {
        this.particles.forEach(particle => {
            const rect = this.element.getBoundingClientRect();
            const intensity = this.config.intensity;

            gsap.set(particle, {
                x: rect.left + Math.random() * rect.width,
                y: rect.top + Math.random() * rect.height,
                opacity: 1,
                scale: 0
            });

            gsap.to(particle, {
                duration: 0.8 * intensity,
                physics2D: {
                    velocity: 150 + Math.random() * 100 * intensity,
                    angle: Math.random() * 360,
                    gravity: 0.3
                },
                opacity: 0,
                scale: 1.5,
                ease: "power3.out"
            });
        });

        gsap.to(this.element, {
            duration: 0.2,
            textShadow: `0 0 ${parseInt(this.config.shadowBlur) * 2}px rgba(0, 247, 255, ${this.config.glowIntensity}), 0 0 ${parseInt(this.config.shadowBlur) * 1.5}px rgba(0, 247, 255, ${this.config.glowIntensity - 0.2})`,
            boxShadow: `0 0 ${parseInt(this.config.shadowBlur) * 2}px rgba(0, 247, 255, ${this.config.glowIntensity})`
        });

        setTimeout(() => {
            gsap.to(this.element, {
                duration: 0.5,
                textShadow: `0 0 ${this.config.shadowBlur} rgba(0, 247, 255, 0.8), 0 0 ${parseInt(this.config.shadowBlur) * 0.7}px rgba(0, 247, 255, 0.6)`,
                boxShadow: `0 0 ${parseInt(this.config.shadowBlur)}px rgba(0, 247, 255, 0.6)`
            });
        }, 500);
    }
}

document.querySelectorAll('.thunder-text').forEach(el => {
    new ThunderText(el);
});
