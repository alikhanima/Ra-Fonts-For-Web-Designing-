// thunder-text.js
class ThunderText {
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({
            color: "white",
            intensity: 30,
            flashOpacity: 0.9,
            interval: 3000,
            repeat: 3
        }, options);
        
        this.flash = document.createElement("div");
        this.flash.classList.add("thunder-flash");
        this.element.parentElement.appendChild(this.flash);
        this.initStyles();
        this.bindEvents();
    }

    initStyles() {
        this.element.style.position = "relative";
        this.element.style.fontWeight = "bold";
        this.element.style.textTransform = "uppercase";
        this.element.style.color = this.options.color;
        this.flash.style.position = "absolute";
        this.flash.style.top = "50%";
        this.flash.style.left = "50%";
        this.flash.style.width = "100%";
        this.flash.style.height = "100%";
        this.flash.style.background = `rgba(255, 255, 255, ${this.options.flashOpacity})`;
        this.flash.style.opacity = "0";
        this.flash.style.transform = "translate(-50%, -50%)";
    }

    bindEvents() {
        if (this.options.interval > 0) {
            setInterval(() => this.triggerEffect(), this.options.interval);
        }
        this.element.addEventListener("mouseenter", () => this.triggerEffect());
    }

    triggerEffect() {
        gsap.to(this.flash, {
            opacity: 1,
            duration: 0.1,
            repeat: this.options.repeat,
            yoyo: true,
            onComplete: () => gsap.to(this.flash, { opacity: 0, duration: 0.1 })
        });
        gsap.to(this.element, {
            textShadow: `0 0 ${this.options.intensity}px rgba(255, 255, 255, 0.8)`,
            duration: 0.1,
            repeat: this.options.repeat,
            yoyo: true
        });
    }
}

// Automatically apply effect to elements with class "thunder-text"
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".thunder-text").forEach(el => {
        const options = {
            color: el.getAttribute("data-color") || "white",
            intensity: parseInt(el.getAttribute("data-intensity")) || 30,
            flashOpacity: parseFloat(el.getAttribute("data-flash-opacity")) || 0.9,
            interval: parseInt(el.getAttribute("data-interval")) || 3000,
            repeat: parseInt(el.getAttribute("data-repeat")) || 3
        };
        new ThunderText(el, options);
    });
});
