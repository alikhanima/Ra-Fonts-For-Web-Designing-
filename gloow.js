function applyGlowEffect() {
    const glowingElements = document.querySelectorAll('[data-glow]');

    glowingElements.forEach(element => {
        // Get custom attributes or use defaults
        const glowColor = element.getAttribute('data-glow-color') || '#00ff00';
        const glowIntensity = parseInt(element.getAttribute('data-glow-intensity')) || 10;
        const glowSpread = parseInt(element.getAttribute('data-glow-spread')) || 3;
        const textColor = element.getAttribute('data-glow-text-color') || '#ffffff';
        const animation = element.getAttribute('data-glow-animation') || 'none';
        const glowBlur = parseInt(element.getAttribute('data-glow-blur')) || 5;

        // Ensure numeric values
        if (isNaN(glowIntensity) || isNaN(glowSpread) || isNaN(glowBlur)) {
            console.warn('Glow.js: Invalid numeric values detected. Check data attributes.');
            return;
        }

        // Apply base styles
        element.style.color = textColor;
        element.style.display = 'inline'; // Keep it inline
        element.style.backgroundColor = 'transparent'; // Ensure transparency
        element.style.border = 'none';

        // Generate multiple-layer glow effect
        let shadows = [];
        for (let i = 0; i < glowSpread; i++) {
            let radius = glowIntensity + (i * 2);
            let blur = glowBlur + (i * 2);
            shadows.push(`0 0 ${blur}px ${radius}px ${glowColor}`);
        }

        // Apply the text-shadow effect
        element.style.textShadow = shadows.join(', ');

        // Debugging
        console.log(`Glow.js applied to ${element.tagName}:`, element.style.textShadow);

        // Animation: Pulse Effect
        if (animation === 'pulse') {
            let baseIntensity = glowIntensity;
            const animateGlow = () => {
                let dynamicIntensity = baseIntensity + (Math.sin(Date.now() / 300) * 5);
                element.style.textShadow = shadows
                    .map(sh => sh.replace(/\d+px/, `${dynamicIntensity}px`))
                    .join(', ');
                requestAnimationFrame(animateGlow);
            };
            animateGlow();
        }
    });
}

// Ensure script runs when the page loads
document.addEventListener('DOMContentLoaded', applyGlowEffect);
