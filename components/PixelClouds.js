"use client";
import { useEffect, useState } from "react";

/*
  Pixel-art clouds that drift slowly across the sky.
  Each cloud is a small SVG rendered with image-rendering: pixelated.
*/

const S = { imageRendering: "pixelated", display: "block" };

function P({ x, y, w = 1, h = 1, c }) {
    return <rect x={x} y={y} width={w} height={h} fill={c} />;
}

function CloudSmall() {
    return (
        <svg viewBox="0 0 16 8" width={64} style={S}>
            <P x={3} y={3} w={10} h={3} c="rgba(255,255,255,0.6)" />
            <P x={5} y={2} w={6} h={1} c="rgba(255,255,255,0.6)" />
            <P x={1} y={4} w={3} h={2} c="rgba(255,255,255,0.45)" />
            <P x={12} y={4} w={3} h={1} c="rgba(255,255,255,0.45)" />
            <P x={6} y={1} w={4} h={1} c="rgba(255,255,255,0.35)" />
        </svg>
    );
}

function CloudMedium() {
    return (
        <svg viewBox="0 0 24 10" width={96} style={S}>
            <P x={4} y={4} w={16} h={4} c="rgba(255,255,255,0.55)" />
            <P x={6} y={3} w={12} h={1} c="rgba(255,255,255,0.55)" />
            <P x={8} y={2} w={8} h={1} c="rgba(255,255,255,0.4)" />
            <P x={2} y={5} w={3} h={2} c="rgba(255,255,255,0.4)" />
            <P x={19} y={5} w={4} h={2} c="rgba(255,255,255,0.4)" />
            <P x={1} y={6} w={2} h={1} c="rgba(255,255,255,0.3)" />
        </svg>
    );
}

function CloudLarge() {
    return (
        <svg viewBox="0 0 32 12" width={140} style={S}>
            <P x={5} y={5} w={22} h={4} c="rgba(255,255,255,0.5)" />
            <P x={8} y={4} w={16} h={1} c="rgba(255,255,255,0.5)" />
            <P x={10} y={3} w={12} h={1} c="rgba(255,255,255,0.4)" />
            <P x={12} y={2} w={8} h={1} c="rgba(255,255,255,0.3)" />
            <P x={3} y={6} w={3} h={3} c="rgba(255,255,255,0.4)" />
            <P x={26} y={6} w={4} h={2} c="rgba(255,255,255,0.4)" />
            <P x={1} y={7} w={3} h={1} c="rgba(255,255,255,0.3)" />
            <P x={28} y={7} w={3} h={1} c="rgba(255,255,255,0.3)" />
        </svg>
    );
}

const CLOUDS = [
    { id: 0, Cloud: CloudLarge, y: "4%", speed: 0.012, startX: 5 },
    { id: 1, Cloud: CloudSmall, y: "8%", speed: 0.02, startX: 35 },
    { id: 2, Cloud: CloudMedium, y: "2%", speed: 0.015, startX: 60 },
    { id: 3, Cloud: CloudSmall, y: "12%", speed: 0.018, startX: 85 },
    { id: 4, Cloud: CloudMedium, y: "6%", speed: 0.01, startX: 15 },
    { id: 5, Cloud: CloudSmall, y: "14%", speed: 0.022, startX: 50 },
];

/* Tiny pixel birds */
function PixelBird({ flip }) {
    return (
        <svg viewBox="0 0 8 4" width={16} style={{ ...S, transform: flip ? "scaleX(-1)" : "none" }}>
            <P x={0} y={0} w={1} h={1} c="rgba(59,50,38,0.5)" />
            <P x={1} y={1} w={1} h={1} c="rgba(59,50,38,0.6)" />
            <P x={2} y={2} w={1} h={1} c="rgba(59,50,38,0.6)" />
            <P x={3} y={2} w={2} h={1} c="rgba(59,50,38,0.7)" />
            <P x={5} y={2} w={1} h={1} c="rgba(59,50,38,0.6)" />
            <P x={6} y={1} w={1} h={1} c="rgba(59,50,38,0.6)" />
            <P x={7} y={0} w={1} h={1} c="rgba(59,50,38,0.5)" />
        </svg>
    );
}

const BIRDS = [
    { id: 0, y: "10%", speed: 0.03, startX: 10, flip: false },
    { id: 1, y: "15%", speed: 0.025, startX: 70, flip: true },
    { id: 2, y: "7%", speed: 0.035, startX: 40, flip: false },
];

export default function PixelClouds() {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        let frame = 0;
        let animId;
        const update = () => {
            frame++;
            if (frame % 3 === 0) setTick(frame); // throttle re-renders
            animId = requestAnimationFrame(update);
        };
        animId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <div className="pixel-sky-layer">
            {CLOUDS.map(({ id, Cloud, y, speed, startX }) => {
                const x = ((startX + tick * speed) % 120) - 10; // loop across screen
                return (
                    <div
                        key={`cloud-${id}`}
                        className="pixel-cloud"
                        style={{ top: y, left: `${x}%` }}
                    >
                        <Cloud />
                    </div>
                );
            })}
            {BIRDS.map(({ id, y, speed, startX, flip }) => {
                const x = ((startX + tick * speed) % 130) - 15;
                return (
                    <div
                        key={`bird-${id}`}
                        className="pixel-bird"
                        style={{ top: y, left: `${x}%` }}
                    >
                        <PixelBird flip={flip} />
                    </div>
                );
            })}
        </div>
    );
}
