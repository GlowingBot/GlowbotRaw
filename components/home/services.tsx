"use client";

import { useEffect, useRef } from "react";
import type { ServiceItem } from "./types";
import { fontMono, sectionTitle } from "./reveal-title";

const rotations = ["-4", "3", "-2"];

const rowStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: "12px 48px",
  padding: "16px 0 18px",
  borderBottom: "1px solid rgba(243,241,234,0.16)",
} as const;

export function Services({ services }: { services: ServiceItem[] }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const rows = services.map((service, index) => ({
    ...service,
    rot: rotations[index % rotations.length],
  }));
  const peekSrc = rows.find((row) => row.peek)?.peek;

  useEffect(() => {
    const box = boxRef.current;
    const img = imgRef.current;
    if (!box || !img) return;

    let on = false;
    let x = 0;
    let y = 0;
    let rot = 0;

    const paint = () => {
      img.style.opacity = on ? "1" : "0";
      img.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${on ? 1 : 0.6}) rotate(${on ? rot : 0}deg)`;
    };

    const onMove = (event: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      on = true;
      paint();
    };

    const onLeave = () => {
      on = false;
      paint();
    };

    const rowNodes = Array.from(box.querySelectorAll<HTMLElement>(".srow"));
    const enters = rowNodes.map((row) => {
      const onEnter = () => {
        if (row.dataset.peek) img.src = row.dataset.peek;
        rot = parseFloat(row.dataset.rot || "") || 0;
        on = true;
        paint();
      };
      row.addEventListener("mouseenter", onEnter);
      return { row, onEnter };
    });

    box.addEventListener("mousemove", onMove);
    box.addEventListener("mouseleave", onLeave);

    return () => {
      box.removeEventListener("mousemove", onMove);
      box.removeEventListener("mouseleave", onLeave);
      enters.forEach(({ row, onEnter }) => {
        row.removeEventListener("mouseenter", onEnter);
      });
    };
  }, []);

  return (
    <section
      id="servicios"
      style={{
        padding: "clamp(96px, 10vw, 160px) clamp(16px, 3vw, 40px)",
        background: "#0E0E0D",
        color: "#F3F1EA",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1600,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: fontMono,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9C988F",
          }}
        >
          Para quién trabajo
        </p>
        <div
          id="srows"
          ref={boxRef}
          className="srows"
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {peekSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              id="peek"
              ref={imgRef}
              className="peek"
              src={peekSrc}
              alt=""
              aria-hidden="true"
              style={{ opacity: 0 }}
            />
          ) : null}
          {rows.map((row, index) => (
            <div
              key={`${row.number}-${index}`}
              className="srow"
              data-peek={row.peek}
              data-rot={row.rot}
              style={rowStyle}
            >
              <h3 style={{ ...sectionTitle, color: "#F3F1EA" }}>{row.title}</h3>
              <p
                style={{
                  margin: 0,
                  flex: "0 1 460px",
                  display: "flex",
                  gap: 32,
                  fontFamily: fontMono,
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1.5,
                  color: "#D6D3CA",
                }}
              >
                <span style={{ color: "#9C988F" }}>{row.number}</span>
                <span>{row.copy}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
