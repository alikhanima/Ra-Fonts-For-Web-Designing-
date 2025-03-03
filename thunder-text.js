document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('[text-effect="glow"]');
    elements.forEach(el => {
        const textColor = el.getAttribute('color') || 'white';
        const glowColor = el.getAttribute('glow') || textColor;
        const flicker = el.hasAttribute('flicker');
        const lightning = el.hasAttribute('lightning');

        // Apply base styles: text color and glow
        el.style.position = "relative";
        el.style.display = "inline-block";
        el.style.color = textColor;
        el.style.textShadow = `0 0 5px ${glowColor}, 0 0 10px ${glowColor}, 0 0 20px ${glowColor}`;

        // Flicker effect using GSAP (if enabled and GSAP is loaded)
        if (flicker && typeof gsap !== "undefined") {
            gsap.to(el, {
                opacity: 0.7,
                duration: 0.1,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });
        }

        // Lightning effect: create a canvas overlay for periodic lightning bolts
        if (lightning) {
            const canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.pointerEvents = "none";
            canvas.style.zIndex = "1";
            el.appendChild(canvas);
            const ctx = canvas.getContext("2d");

            function resizeCanvas() {
                canvas.width = el.clientWidth;
                canvas.height = el.clientHeight;
            }
            resizeCanvas();
            window.addEventListener("resize", resizeCanvas);

            function drawLightning() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                let x = Math.random() * canvas.width;
                let y = 0;
                ctx.moveTo(x, y);
                // Create 5 segments for a jagged bolt
                for (let i = 0; i < 5; i++) {
                    x += (Math.random() - 0.5) * canvas.width * 0.5;
                    y += canvas.height / 5;
                    ctx.lineTo(x, y);
                }
                ctx.strokeStyle = glowColor;
                ctx.lineWidth = 2;
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 10;
                ctx.stroke();
                // Erase the bolt after 100ms
                setTimeout(() => { ctx.clearRect(0, 0, canvas.width, canvas.height); }, 100);
            }
            // Draw lightning every 2000ms
            setInterval(drawLightning, 2000);
        }
    });
});
