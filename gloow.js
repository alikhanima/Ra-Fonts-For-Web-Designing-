function applyGlowEffect() {
  const glowingElements = document.querySelectorAll('[data-glow]');

  glowingElements.forEach(element => {
    // Parse numeric attributes
    const glowColor = element.getAttribute('data-glow-color') || '#00ff00';
    const glowIntensity = Number(element.getAttribute('data-glow-intensity')) || 10;
    const glowSpread = Number(element.getAttribute('data-glow-spread')) || 3;
    const textColor = element.getAttribute('data-glow-text-color') || '#ffffff';
    const animation = element.getAttribute('data-glow-animation') || 'none';
    const glowBlur = Number(element.getAttribute('data-glow-blur')) || 5;

    // Apply base styles
    element.style.color = textColor;
    element.style.display = 'inline-block'; // ensure inline-block so shadows follow text shape
    element.style.backgroundColor = 'transparent';
    element.style.border = 'none';

    // Create glow effect with multiple layered shadows
    const setShadows = (intensity) => {
      const shadows = [];
      for (let i = 0; i < glowSpread; i++) {
        const radius = intensity + (i * intensity / 2);
        const blur = glowBlur + (i * 2);
        shadows.push(`0 0 ${blur}px ${radius}px ${glowColor}`);
      }
      element.style.textShadow = shadows.join(', ');
    };

    // Set initial glow
    setShadows(glowIntensity);

    // If pulse animation is enabled, animate the glow intensity
    if (animation === 'pulse') {
      let baseIntensity = glowIntensity;
      const animate = () => {
        // Oscillate intensity over time using sine function
        const newIntensity = baseIntensity + (Math.sin(Date.now() / 300) * baseIntensity);
        setShadows(newIntensity);
        requestAnimationFrame(animate);
      };
      animate();
    }
  });
}

document.addEventListener('DOMContentLoaded', applyGlowEffect);
