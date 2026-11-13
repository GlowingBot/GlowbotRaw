"use client";

import { useEffect, useRef } from "react";

type Dot = {
  x: number;
  y: number;
  t: number;
  el: HTMLSpanElement;
};

export function HeatTrail() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const main = layer?.parentElement;
    if (!layer || !main) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover || reduce) return;

    let trail: Dot[] = [];
    let target: { x: number; y: number } | null = null;
    let sm: { x: number; y: number } | null = null;
    let last: { x: number; y: number } | null = null;
    const LIFE = 8000;

    const onMove = (event: MouseEvent) => {
      const rect = main.getBoundingClientRect();
      target = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    main.addEventListener("mousemove", onMove);

    const timer = window.setInterval(() => {
      const now = Date.now();
      if (target) {
        if (!sm) sm = { x: target.x, y: target.y };
        sm.x += (target.x - sm.x) * 0.55;
        sm.y += (target.y - sm.y) * 0.55;
        if (!last || Math.hypot(sm.x - last.x, sm.y - last.y) > 8) {
          last = { x: sm.x, y: sm.y };
          const el = document.createElement("span");
          el.className = "heat-dot";
          layer.appendChild(el);
          trail.push({ x: sm.x, y: sm.y, t: now, el });
          if (trail.length > 260) {
            const old = trail.shift();
            old?.el.remove();
          }
        }
      }

      trail = trail.filter((point) => {
        const age = (now - point.t) / LIFE;
        if (age >= 1) {
          point.el.remove();
          return false;
        }
        const hue = Math.round(30 + age * 190);
        const alpha = 1 - age;
        const size = Math.round(120 * (1 - age * 0.82));
        const style = point.el.style;
        style.width = `${size}px`;
        style.height = `${size}px`;
        style.opacity = Math.min(1, alpha * 1.4).toFixed(3);
        style.transform = `translate(${point.x}px,${point.y}px) translate(-50%,-50%)`;
        style.background = `radial-gradient(circle, hsla(${hue},95%,55%,${(0.85 * alpha).toFixed(3)}) 0%, hsla(${hue + 20},90%,50%,${(0.45 * alpha).toFixed(3)}) 40%, hsla(${hue + 40},90%,50%,0) 70%)`;
        return true;
      });
    }, 30);

    return () => {
      window.clearInterval(timer);
      main.removeEventListener("mousemove", onMove);
      trail.forEach((point) => point.el.remove());
    };
  }, []);

  return (
    <div
      id="heat"
      ref={layerRef}
      className="heat"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
