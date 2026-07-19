"use client";

import { useEffect, useRef } from "react";

interface SideRaysProps {
  speed?: number;
  rayColor1?: string;
  rayColor2?: string;
  intensity?: number;
  spread?: number;
  origin?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  tilt?: number;
  saturation?: number;
  blend?: number;
  falloff?: number;
  opacity?: number;
}

export default function SideRays({
  speed = 2.5,
  rayColor1 = "#e4af0b",
  rayColor2 = "#c4ffc4",
  intensity = 1.5,
  spread = 2.4,
  origin = "top-right",
  tilt = -4,
  opacity = 1,
}: SideRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 228, g: 175, b: 11 };
    };

    const c1 = hexToRgb(rayColor1);
    const c2 = hexToRgb(rayColor2);

    const NUM_RAYS = Math.round(8 * spread);

    const draw = (ts: number) => {
      timeRef.current = ts * 0.001 * speed;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const ox = origin.includes("right") ? w : 0;
      const oy = origin.includes("bottom") ? h : 0;

      const tiltRad = (tilt * Math.PI) / 180;
      const baseAngle = origin.includes("right")
        ? Math.PI + tiltRad
        : 0 + tiltRad;

      const halfSpread = (spread * Math.PI) / 4;

      for (let i = 0; i < NUM_RAYS; i++) {
        const t = i / (NUM_RAYS - 1);
        const angle = baseAngle + (t - 0.5) * halfSpread + Math.sin(timeRef.current * 0.3 + i * 0.7) * 0.05;

        const len = Math.max(w, h) * 2.2;
        const ex = ox + Math.cos(angle) * len;
        const ey = oy + Math.sin(angle) * len;

        const rayWidth = (30 + Math.sin(timeRef.current + i) * 10) * intensity;

        const alpha = (0.06 + Math.sin(timeRef.current * 0.5 + i * 1.3) * 0.03) * opacity;
        const frac = t;
        const r = Math.round(c1.r + (c2.r - c1.r) * frac);
        const g = Math.round(c1.g + (c2.g - c1.g) * frac);
        const b = Math.round(c1.b + (c2.b - c1.b) * frac);

        const perp = angle + Math.PI / 2;
        const dx = Math.cos(perp) * rayWidth;
        const dy = Math.sin(perp) * rayWidth;

        const grad = ctx.createLinearGradient(ox, oy, ex, ey);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 2})`);
        grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.moveTo(ox + dx, oy + dy);
        ctx.lineTo(ex + dx, ey + dy);
        ctx.lineTo(ex - dx, ey - dy);
        ctx.lineTo(ox - dx, oy - dy);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [speed, rayColor1, rayColor2, intensity, spread, origin, tilt, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
}
