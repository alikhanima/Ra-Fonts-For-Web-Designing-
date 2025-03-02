# ⚡ Thunder Text Effect

A dynamic, customizable lightning text effect component that brings your text to life with realistic thunder animations. Easily integrable and performance-optimized.

## Features

- 🌩️ Real-time lightning particle effects
- 🎨 Customizable colors and intensity
- ⚡ Automatic & hover-triggered animations
- 📦 Single-file component (No build required)
- 📱 Mobile-friendly & responsive
- 🚀 Optimized performance with GSAP

## Quick Start

### CDN Implementation

```html
<head>
  <!-- Include component -->
  <script src="[https://cdn.jsdelivr.net/gh/yourusername/thunder-text-effect@main/thunder-text.html](https://cdn.jsdelivr.net/gh/alikhanima/Ra-Fonts-For-Web-Designing-@main/thunder-text.html)"></script>
  
  <!-- Required GSAP dependencies -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Physics2DPlugin.min.js"></script>
</head>

<body>
  <!-- Basic implementation -->
  <div class="thunder-text">LIGHTNING</div>

  <!-- Customized example -->
  <div class="thunder-text" 
       data-color="#ff00ff"
       data-intensity="2.5"
       data-interval="1500">
    THUNDER
  </div>
</body>
