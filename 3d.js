/* Custom Text Effects CSS */
const style = document.createElement("style");
style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Arial+Black&display=swap');

.tag-3d {
    font-family: 'Arial Black', sans-serif;
    font-size: 48px;
    color: #FF5733;
    text-shadow: 5px 5px 10px #000000;
}

.neon-glow {
    font-family: 'Verdana', sans-serif;
    font-size: 40px;
    color: #00FFFF;
    text-shadow: 0 0 15px #00FFFF, 0 0 30px #00FFFF;
}

.embossed {
    font-family: 'Times New Roman', serif;
    font-size: 42px;
    color: #CCCCCC;
    text-shadow: 1px 1px 2px #FFFFFF, -1px -1px 2px #888888;
}

.gradient-fill {
    font-family: 'Tahoma', sans-serif;
    font-size: 45px;
    background: linear-gradient(45deg, #FF0000, #0000FF);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}`;

document.head.appendChild(style);

// Apply effects to custom tags
document.addEventListener("DOMContentLoaded", function() {
    const effects = {
        "tag-3d": "tag-3d",
        "neon-glow": "neon-glow",
        "embossed": "embossed",
        "gradient-fill": "gradient-fill"
    };

    Object.keys(effects).forEach(effect => {
        const elements = document.querySelectorAll(effect);
        elements.forEach(element => {
            element.classList.add(effects[effect]);
        });
    });
});
