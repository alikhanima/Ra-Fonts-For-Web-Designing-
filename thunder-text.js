class ThunderText {
    constructor() {
        this.applyEffects();
        this.observeChanges();
    }

    applyEffects() {
        document.querySelectorAll('[text-effect="glow"]').forEach(el => {
            const color = el.getAttribute('color') || 'white';
            const glow = el.getAttribute('glow') || color;
            const flicker = el.hasAttribute('flicker');
            const lightning = el.hasAttribute('lightning');

            el.style.color = color;
            el.style.textShadow = `
                0 0 10px ${glow}, 
                0 0 20px ${glow}, 
                0 0 40px ${glow}
            `;

            if (flicker) this.flickerEffect(el);
            if (lightning) this.addLightningEffect(el);
        });
    }

    flickerEffect(el) {
        gsap.to(el, {
            opacity: 0.9,
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }

    addLightningEffect(el) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        el.style.position = 'relative';
        el.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        const drawLightning = () => {
            const { width, height } = el.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * width, 0);
                for (let j = 0; j < 5; j++) {
                    ctx.lineTo(Math.random() * width, (j / 5) * height);
                }
                ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
                ctx.lineWidth = 2;
                ctx.shadowColor = "white";
                ctx.shadowBlur = 10;
                ctx.stroke();
            }
            setTimeout(() => { canvas.style.opacity = "0"; }, 50);
        };

        setInterval(() => {
            canvas.style.opacity = "1";
            drawLightning();
        }, 3000);
    }

    observeChanges() {
        const observer = new MutationObserver(() => this.applyEffects());
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// ✅ Load GSAP for animations
const gsapScript = document.createElement('script');
gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
gsapScript.onload = () => {
    document.addEventListener('DOMContentLoaded', () => new ThunderText());
};
document.head.appendChild(gsapScript);
