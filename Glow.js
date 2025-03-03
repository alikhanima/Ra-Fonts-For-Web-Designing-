document.addEventListener("DOMContentLoaded", () => {
  // Find all elements that use the glow text effect
  const elements = document.querySelectorAll('[text-effect="glow"]');
  
  elements.forEach(el => {
    // Get the base text and glow colors from attributes (defaults to white if not provided)
    const textColor = el.getAttribute('color') || 'white';
    const glowColor = el.getAttribute('glow') || textColor;
    // Check if color-changing is enabled via either "colorchange" attribute or a provided list via "glow-colors"
    const enableColorChange = el.hasAttribute('colorchange') || el.hasAttribute('glow-colors');
    
    // Function to set an ultra high-quality glow on the text using multiple text-shadow layers.
    const setGlow = (color) => {
      el.style.textShadow = `
        0 0 2px ${color},
        0 0 4px ${color},
        0 0 8px ${color},
        0 0 16px ${color},
        0 0 32px ${color}
      `;
    };
    
    // Set initial styles: text color and glow effect (only applied to the text, not the whole container)
    el.style.position = "relative";
    el.style.display = "inline-block";
    el.style.color = textColor;
    setGlow(glowColor);
    
    // If color-changing is enabled, animate the glow color using GSAP.
    if (enableColorChange && typeof gsap !== "undefined") {
      let colors = [];
      if (el.hasAttribute('glow-colors')) {
        // Get a comma-separated list of glow colors.
        colors = el.getAttribute('glow-colors').split(',').map(c => c.trim());
      }
      // If no list is provided, fall back to a default color cycle.
      if (colors.length === 0) {
        colors = [glowColor, 'red', 'blue', 'green', 'purple'];
      }
      // Create a GSAP timeline that repeatedly cycles through the glow colors.
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      colors.forEach(color => {
        tl.to(el, {
          duration: 1.5,
          onUpdate: () => { setGlow(color); },
          ease: "none"
        });
      });
    }
  });
});
