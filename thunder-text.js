document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[text-effect]").forEach(el => {
        const effectType = el.getAttribute("text-effect");
        const textColor = el.getAttribute("color") || "white";
        const glowColor = el.getAttribute("glow") || textColor;
        const flicker = el.hasAttribute("flicker");
        const lightning = el.hasAttribute("lightning");

        // Apply styles
        el.style.position = "relative";
        el.style.display = "inline-block";
        el.style.color = textColor;
        el.style.textShadow = `
            0 0 5px ${glowColor},
            0 0 10px ${glowColor},
            0 0 20px ${glowColor}
        `;

        // Add flickering effect using GSAP
        if (flicker && typeof gsap !== "undefined") {
            gsap.to(el, {
                opacity: 1,
                repeat: -1,
                yoyo: true,
                duration: 0.08,
                ease: "power1.inOut",
                opacity: () => Math.random() * 0.3 + 0.7
            });
        }

        // Add a lightning effect (optional)
        if (lightning) {
            const canvas = document.createElement("canvas");
            canvas.style.position = "absolute";
            canvas.style.top = "0";
            canvas.style.left = "0";
            canvas.style.pointerEvents = "none";
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
                for (let i = 0; i < 4; i++) {
                    x += (Math.random() - 0.5) * canvas.width * 0.5;
                    y += canvas.height / 4;
                    ctx.lineTo(x, y);
                }
                ctx.strokeStyle = glowColor;
                ctx.lineWidth = 2;
                ctx.shadowColor = glowColor;
                ctx.shadowBlur = 10;
                ctx.stroke();
                setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 80);
            }

            setInterval(drawLightning, 2000 + Math.random() * 3000);
        }
    });
});
