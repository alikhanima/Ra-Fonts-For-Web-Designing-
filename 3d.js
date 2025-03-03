// text-animations.js
(function () {
  // Define 3D Rotation Effect
  const apply3DEffect = (element) => {
    element.style.display = "inline-block";
    element.style.animation = "rotate3d 5s infinite ease-in-out";
  };

  // Define Color-Changing Effect
  const applyColorChangingEffect = (element) => {
    element.style.animation = "colorChange 3s infinite";
  };

  // Add CSS Keyframes dynamically
  const styleSheet = document.createElement("style");
  styleSheet.innerHTML = `
    @keyframes rotate3d {
      0% { transform: rotateY(0deg) scale(1); }
      25% { transform: rotateY(90deg) scale(1.2); }
      50% { transform: rotateY(180deg) scale(1); }
      75% { transform: rotateY(270deg) scale(1.2); }
      100% { transform: rotateY(360deg) scale(1); }
    }
    @keyframes colorChange {
      0% { color: #ff6f61; }
      25% { color: #6b5b95; }
      50% { color: #88b04b; }
      75% { color: #f7cac9; }
      100% { color: #ff6f61; }
    }
  `;
  document.head.appendChild(styleSheet);

  // Apply effects to custom tags
  document.querySelectorAll("3d").forEach((element) => {
    apply3DEffect(element);
  });

  document.querySelectorAll("color-changing").forEach((element) => {
    applyColorChangingEffect(element);
  });
})();
