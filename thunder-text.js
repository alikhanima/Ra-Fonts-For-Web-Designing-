// thunder-text.js
function applyGlowEffect() {
    // Select all elements with the 'data-glow' attribute
    const glowingElements = document.querySelectorAll('[data-glow]');
    
    glowingElements.forEach(element => {
        // Get custom attributes or use defaults
        const glowColor = element.getAttribute('data-glow-color') || '#00ff00';
        const glowIntensity = element.getAttribute('data-glow-intensity') || '10';
        const glowSpread = element.getAttribute('data-glow-spread') || '3';
        const textColor = element.getAttribute('data-glow-text-color') || '#ffffff';
        const animation = element.getAttribute('data-glow-animation') || 'none';

        // Apply base styles
        element.style.color = textColor;
        element.style.display = 'inline-block';
        
        // Create realistic glow effect with multiple shadows
        const shadows = [];
        for (let i = 0; i < glowSpread; i++) {
            const radius = (glowIntensity * 1) + (i * glowIntensity / 2);
            shadows.push(`0 0 ${radius}px ${glowColor}`);
        }
        
        // Apply the glow effect
        element.style.textShadow = shadows.join(', ');

        // Add animation if specified
        if (animation === 'pulse') {
            let intensity = glowIntensity;
            const animate = () => {
                intensity = glowIntensity + (Math.sin(Date.now() / 300) * glowIntensity);
                element.style.textShadow = shadows
                    .map(sh => sh.replace(/\d+px/, `${intensity}px`))
                    .join(', ');
                requestAnimationFrame(animate);
            };
            animate();
        }
    });
}

// Initialize the glow effect when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', applyGlowEffect);
