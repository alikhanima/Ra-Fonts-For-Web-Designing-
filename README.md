# Thunder Text Effect

A dynamic, customizable lightning text effect component that brings your text to life with realistic thunder animations. Easily integrable and performance-optimized.

## Features
- 🌩️ Real-time lightning particle effects
- 🎨 Customizable colors, intensity, and animation settings
- ⚡ Automatic & hover-triggered animations
- 📦 Single-file component (No build required)
- 📱 Mobile-friendly & responsive
- 🚀 Optimized performance with GSAP

## Quick Start
### CDN Implementation
Include the following script in your HTML file:
```html
<head>
  <!-- Include Thunder Text Component -->
  <script src="https://cdn.jsdelivr.net/gh/alikhanima/Ra-Fonts-For-Web-Designing-@refs/heads/main/thunder-text.js"></script>
  
  <!-- Required GSAP dependencies -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/Physics2DPlugin.min.js"></script>
</head>
```

### Usage
Simply add the class `thunder-text` to any text element:
```html
<h1 class="thunder-text">THUNDER</h1>
```

### Customization
You can customize the effect using `data-` attributes:
```html
<h1 class="thunder-text"
    data-color="yellow"
    data-intensity="50"
    data-flash-opacity="0.8"
    data-interval="5000"
    data-repeat="5">
    LIGHTNING EFFECT
</h1>
```

#### Available Options:
| Attribute | Description | Default Value |
|-----------|-------------|---------------|
| `data-color` | Text color | `white` |
| `data-intensity` | Glow intensity | `30` |
| `data-flash-opacity` | Flash brightness | `0.9` |
| `data-interval` | Time between flashes (ms) | `3000` |
| `data-repeat` | Number of flashes per effect | `3` |

## License
This project is open-source and free to use. Feel free to contribute or customize!

---
Enjoy the **Thunder Text Effect**! ⚡

