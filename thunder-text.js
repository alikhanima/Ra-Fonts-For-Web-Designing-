class ThunderText {
    constructor() {
        this.applyEffects();
        this.observeChanges();
    }

    applyEffects() {
        document.querySelectorAll('[text-effect="glow"]').forEach(el => {
            const color = el.getAttribute('color') || 'white';
            const glow = el.getAttribute('glow') || color;

            el.style.color = color;
            el.style.textShadow = `
                0 0 10px ${glow}, 
                0 0 20px ${glow}, 
                0 0 40px ${glow}
            `;
        });
    }

    observeChanges() {
        const observer = new MutationObserver(() => this.applyEffects());
        observer.observe(document.body, { childList: true, subtree: true });
    }
}

// ✅ Auto-apply when the page loads
document.addEventListener('DOMContentLoaded', () => new ThunderText());
