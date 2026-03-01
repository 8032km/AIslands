"use client";
import { useRef, useEffect } from "react";

/*
  Calm pixel-art ocean.
  Static gradient base + gentle shimmering highlights
  that drift slowly across the surface.
*/

const TILE = 8;

/* Ocean color palette — calm gradient from top to bottom */
const DEEP = "#4A8CC2";
const MID = "#5B9BD5";
const LIGHT = "#6AAADE";
const SHALLOW = "#7BB8E8";

function getBaseColor(row, totalRows) {
    const t = row / totalRows;
    if (t < 0.25) return DEEP;
    if (t < 0.5) return MID;
    if (t < 0.75) return LIGHT;
    return SHALLOW;
}

export default function WaterCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let frame = 0;
        let lastDrawTime = 0;
        const FPS_INTERVAL = 1000 / 15; // Cap at 15fps — gentle waves don't need 60fps

        const resize = () => {
            const parent = canvas.parentElement;
            canvas.width = parent.offsetWidth;
            canvas.height = parent.offsetHeight;
        };

        const draw = (timestamp) => {
            animId = requestAnimationFrame(draw);

            // Throttle to ~15fps for performance
            if (timestamp - lastDrawTime < FPS_INTERVAL) return;
            lastDrawTime = timestamp;

            const { width, height } = canvas;
            const cols = Math.ceil(width / TILE);
            const rows = Math.ceil(height / TILE);

            /* ── 1. Draw static ocean base ── */
            for (let r = 0; r < rows; r++) {
                ctx.fillStyle = getBaseColor(r, rows);
                ctx.fillRect(0, r * TILE, width, TILE);
            }

            /* ── 2. Subtle horizontal wave highlights ── */
            const time = frame * 0.012; // very slow progression

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    // Two overlapping sine waves at different frequencies
                    const wave1 = Math.sin(time + c * 0.25 + r * 0.8);
                    const wave2 = Math.sin(time * 0.7 + c * 0.4 - r * 0.3);
                    const combined = (wave1 + wave2) * 0.5;

                    if (combined > 0.55) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
                        ctx.fillRect(c * TILE, r * TILE, TILE, TILE * 0.4);
                    } else if (combined > 0.35) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
                        ctx.fillRect(c * TILE, r * TILE, TILE, TILE * 0.3);
                    } else if (combined < -0.5) {
                        ctx.fillStyle = "rgba(0, 30, 80, 0.08)";
                        ctx.fillRect(c * TILE, r * TILE, TILE, TILE);
                    }
                }
            }

            /* ── 3. Sparse sparkle pixels (sun reflections) ── */
            for (let r = 0; r < rows; r += 3) {
                for (let c = 0; c < cols; c += 4) {
                    const sparkle = Math.sin(time * 1.5 + c * 1.7 + r * 2.3);
                    if (sparkle > 0.92) {
                        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
                        ctx.fillRect(c * TILE + 2, r * TILE + 2, TILE * 0.5, TILE * 0.5);
                    }
                }
            }

            frame++;
        };

        resize();
        animId = requestAnimationFrame(draw);
        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return <canvas ref={canvasRef} className="water-canvas" />;
}
