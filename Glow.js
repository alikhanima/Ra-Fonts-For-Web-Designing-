(function() {
  function createGlowText(element) {
    const text = element.textContent;
    const glowColor = element.getAttribute('glow-color') || 'yellow';
    const textColor = element.getAttribute('text-color') || 'white';
    const fontSize = element.getAttribute('font-size') || '30px';
    const fontFamily = element.getAttribute('font-family') || 'Arial';
    const glowStrength = element.getAttribute('glow-strength') || '5';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Measure text to determine canvas size
    ctx.font = `${fontSize} ${fontFamily}`;
    const textMetrics = ctx.measureText(text);
    const width = textMetrics.width + parseInt(glowStrength) * 2;
    const height = parseInt(fontSize) * 1.5 + parseInt(glowStrength) * 2; // Add some extra height for glow

    canvas.width = width;
    canvas.height = height;

    // Redraw with proper glow and text
    ctx.font = `${fontSize} ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Apply glow effect using shadow
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = parseInt(glowStrength);
    ctx.fillStyle = textColor;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Replace the original element with the canvas
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    element.parentNode.replaceChild(img, element);
  }

  function processGlowElements() {
    const glowElements = document.querySelectorAll('glow');
    glowElements.forEach(createGlowText);
  }

  // Process glow elements on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processGlowElements);
  } else {
    processGlowElements();
  }
})();
