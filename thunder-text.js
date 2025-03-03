document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('[text-effect="glow"]');
  elements.forEach(el => {
    // Get base text and glow colors
    const baseColor = el.getAttribute('color') || 'white';
    const glowColor = el.getAttribute('glow') || baseColor;
    const enableColorChange = el.hasAttribute('colorchange') || el.hasAttribute('glow-colors');

    // Function to apply an ultra high quality glow using multiple layered text shadows.
    const setGlow = (color) => {
      el.style.textShadow = `
        0 0 2px ${color},
        0 0 4px ${color},
        0 0 8px ${color},
        0 0 16px ${color},
        0 0 32px ${color}
      `;
    };

    // Set the text color and initial glow
    el.style.color = baseColor;
    setGlow(glowColor);

    // If color-changing is enabled, animate the glow color
    if (enableColorChange && typeof gsap !== "undefined") {
      let colors = [];
      if (el.hasAttribute('glow-colors')) {
        // Expect comma-separated list of colors
        colors = el.getAttribute('glow-colors').split(',').map(c => c.trim());
      }
      // Fallback cycle if no glow-colors attribute is provided
      if (colors.length === 0) {
        colors = [glowColor, 'red', 'blue', 'green', 'purple'];
      }
      // Create a GSAP timeline that cycles through the colors
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      colors.forEach(color => {
        tl.to(el, {
          duration: 1.5,
          onUpdate: () => {
            setGlow(color);
          },
          ease: "none"
        });
      });
    }
  });
});
