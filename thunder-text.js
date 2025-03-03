class ThunderText {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            color: options.color || 'white',
            intensity: options.intensity || 50,
            flashOpacity: options.flashOpacity || 0.9,
            interval: options.interval || 3000,
            repeat: options.repeat || 3
        };
        
        this.createLightningEffect();
    }

    createLightningEffect() {
        const el = this.element;
        const options = this.options;
        el.style.position = "relative";
        el.style.transition = "color 0.1s ease-in-out";
        
        // Create lightning overlay effect
        const lightning = document.createElement("div");
        lightning.style.position = "absolute";
        lightning.style.top = "50%";
        lightning.style.left = "50%";
        lightning.style.transform = "translate(-50%, -50%)";
        lightning.style.width = "120%";
        lightning.style.height = "150%";
        lightning.style.pointerEvents = "none";
        lightning.style.background = `radial-gradient(circle, ${options.color} 10%, transparent 70%)`;
        lightning.style.opacity = "0";
        lightning.style.filter = `blur(${options.intensity / 5}px)`;
        el.appendChild(lightning);

        const lightningEffect = () => {
            const tl = gsap.timeline({ repeat: options.repeat, repeatDelay: Math.random() * 0.2 });
            
            tl.to(el, { 
                textShadow: `0 0 ${options.intensity}px ${options.color}, 0 0 ${options.intensity * 2}px ${options.color}`,
                color: options.color,
                duration: 0.05,
                ease: "power2.out"
            })
            .to(lightning, { opacity: options.flashOpacity, duration: 0.05 })
            .to(el, { 
                textShadow: "none", 
                color: "", 
                duration: 0.1,
                ease: "power2.in"
            })
            .to(lightning, { opacity: 0, duration: 0.1 })
            .to(el, { 
                textShadow: `0 0 ${options.intensity * 1.5}px ${options.color}, 0 0 ${options.intensity * 2.5}px ${options.color}`,
                color: options.color,
                duration: 0.05
            })
            .to(lightning, { opacity: options.flashOpacity * 0.8, duration: 0.05 })
            .to(el, { 
                textShadow: "none", 
                color: "", 
                duration: 0.1
            })
            .to(lightning, { opacity: 0, duration: 0.1 });
        };

        setInterval(lightningEffect, options.interval);
        lightningEffect(); // Start immediately
    }
}

// Initialize for all elements with class 'thunder-text'
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".thunder-text").forEach(el => {
        new ThunderText(el, {
            color: el.getAttribute("data-color") || "white",
            intensity: parseInt(el.getAttribute("data-intensity")) || 50,
            flashOpacity: parseFloat(el.getAttribute("data-flash-opacity")) || 0.9,
            interval: parseInt(el.getAttribute("data-interval")) || 3000,
            repeat: parseInt(el.getAttribute("data-repeat")) || 3
        });
    });
});
