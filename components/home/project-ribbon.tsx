"use client";

import { useEffect, useRef } from "react";
import type { RibbonProject } from "./types";
import { fontDisplay, fontMono, RevealTitle } from "./reveal-title";

type Frame = RibbonProject & {
  img?: HTMLImageElement;
  mobileImg?: HTMLImageElement;
};

const edge = "max(clamp(16px, 3vw, 40px), calc((100% - 1600px) / 2))";

function indexLabel(index: number, count: number, meta: string) {
  const num = String(index + 1).padStart(2, "0");
  const total = String(count).padStart(2, "0");
  return meta ? `${meta} · ${num} / ${total}` : `${num} / ${total}`;
}

export function ProjectRibbon({ projects }: { projects: RibbonProject[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const infoRef = useRef<HTMLSpanElement>(null);
  const count = projects.length;
  const trackHeight = count > 0 ? `${(count - 1) * 70 + 100}vh` : "100vh";
  const first = projects[0];

  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    const nameEl = nameRef.current;
    const infoEl = infoRef.current;
    if (!track || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames: Frame[] = projects.map((project) => ({
      ...project,
      pos: [
        Number.isFinite(project.pos?.[0]) ? project.pos[0] : 0.5,
        Number.isFinite(project.pos?.[1]) ? project.pos[1] : 0.5,
      ],
    }));
    const frameCount = frames.length;
    track.style.height = frameCount > 0 ? `${(frameCount - 1) * 70 + 100}vh` : "100vh";
    if (frameCount < 1) return;
    frames.forEach((frame) => {
      if (frame.src) {
        const image = new Image();
        image.src = frame.src;
        frame.img = image;
      }
      if (frame.mobileSrc) {
        const image = new Image();
        image.src = frame.mobileSrc;
        frame.mobileImg = image;
      }
    });

    let tp = 0;
    let cp = 0;
    let ip = 0;
    let ce = 0;
    let lt = 0;
    let sized = false;
    let curIdx = -1;
    let mx: number | null = null;
    let my: number | null = null;
    let lx: number | null = null;
    let ly: number | null = null;
    let rot = 0;
    let lensK = -1;
    const hz: number[] = [];
    const hzz: number[] = [];
    let hk = -1;
    let frameId = 0;

    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const viewH = window.innerHeight;
      const total = rect.height - viewH;
      ip = Math.max(0, Math.min(1, (viewH * 1.05 - rect.top) / (viewH * 0.5)));
      tp = Math.max(0, Math.min(1, -rect.top / (total || 1)));
    };

    const onResize = () => {
      sized = false;
      onScroll();
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = event.clientX - rect.left;
      my = event.clientY - rect.top;
    };

    const onLeave = () => {
      mx = null;
    };

    const onClick = () => {
      const href = hk >= 0 ? frames[hk]?.href : null;
      if (href) window.location.href = href;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);
    onScroll();

    const setCurrent = (index: number) => {
      if (index === curIdx) return;
      curIdx = index;
      const frame = frames[index];
      if (!frame) return;
      if (nameEl) nameEl.textContent = frame.name;
      if (infoEl) infoEl.textContent = indexLabel(index, count, frame.meta);
    };

    const draw = () => {
      const W = canvas.clientWidth;
      const H = canvas.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!sized || canvas.width !== Math.round(W * dpr)) {
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        sized = true;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const GT = Math.max(16, Math.min(40, W * 0.03));
      const FW = Math.min(1600 + 24, W - 2 * GT + 24);
      const BOT = H - 104;
      const FH = Math.min(FW * 0.66, BOT - H * 0.1);
      const GAP = 24;
      const now = performance.now();
      const dt = Math.min(0.05, (now - (lt || now)) / 1000 || 0.016);
      lt = now;
      const damp = 1 - Math.exp(-dt * 3.6);
      ce += (ip - ce) * damp;
      const ec = Math.max(0, Math.min(1, ce));
      const ee = reduce
        ? 1
        : ec < 0.5
          ? 4 * ec * ec * ec
          : 1 - Math.pow(-2 * ec + 2, 3) / 2;
      cp += (tp * (count - 1) - cp) * damp;
      setCurrent(Math.max(0, Math.min(count - 1, Math.round(cp))));
      const phone = W <= 700;
      const top = BOT - FH;
      const full = FW - GAP;
      const shown = (frame: Frame) => {
        const useMobile = phone && Boolean(frame.mobileSrc);
        const image =
          useMobile && frame.mobileImg?.naturalWidth ? frame.mobileImg : frame.img;
        return {
          image,
          pos: useMobile ? (frame.mobilePos ?? frame.pos) : frame.pos,
          ar: useMobile ? frame.mobileAr : frame.ar,
        };
      };
      const ws = frames.map((frame) => {
        const view = shown(frame);
        const aspect =
          view.image && view.image.naturalWidth
            ? view.image.naturalWidth / view.image.naturalHeight
            : view.ar || 1.6;
        return aspect < 1.2 ? Math.min(full, FH * aspect) : full;
      });
      const xs: number[] = [];
      let acc = 0;
      for (let q = 0; q < count; q += 1) {
        xs.push(acc);
        acc += ws[q] + GAP;
      }
      if (count < 1) return;
      const i0 = Math.max(0, Math.min(count - 1, Math.floor(cp)));
      const frc = cp - i0;
      const totalW = xs[count - 1] + ws[count - 1];
      const off = Math.max(
        GT - (xs[i0] + (i0 + 1 < count ? (xs[i0 + 1] - xs[i0]) * frc : 0)),
        Math.min(GT, W - GT - totalW),
      );

      hk = -1;
      if (mx != null && my != null && ee > 0.97) {
        for (let kk = 0; kk < count; kk += 1) {
          const xx = off + xs[kk];
          if (
            mx >= xx &&
            mx <= xx + ws[kk] &&
            my >= top &&
            my <= top + FH
          ) {
            hk = kk;
            break;
          }
        }
      }
      canvas.style.cursor = hk >= 0 ? "none" : "default";
      if (mx != null && my != null) {
        if (lx == null || ly == null) {
          lx = mx;
          ly = my;
        }
        lx += (mx - lx) * 0.18;
        ly += (my - ly) * 0.18;
      }
      if (hk >= 0) lensK = hk;

      rot += 0.006;

      for (let k = 0; k < count; k += 1) {
        hz[k] = (hz[k] || 0) + ((k === hk ? 1 : 0) - (hz[k] || 0)) * 0.12;
        hzz[k] = (hzz[k] || 0) + ((k === hk ? 1 : 0) - (hzz[k] || 0)) * 0.035;
        const x = off + xs[k];
        const w = ws[k];
        if (x > W || x + w < 0) continue;
        const hh = Math.max(1, (FH / 2) * ee);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, top + FH / 2 - hh, w, hh * 2);
        ctx.clip();
        const frame = frames[k];
        const view = shown(frame);
        if (view.image && view.image.complete && view.image.naturalWidth) {
          const iw = view.image.naturalWidth;
          const ih = view.image.naturalHeight;
          const ratio = Math.max(w / iw, FH / ih);
          const sw = w / ratio;
          const sh = FH / ratio;
          const ox = (iw - sw) * view.pos[0];
          const oy = (ih - sh) * view.pos[1];
          const t = hzz[k];
          const he = t * t * (3 - 2 * t);
          const z = 1 + he * 0.025;
          const ps = 1 + (1 - ee) * 0.12;
          const zz = z * ps;
          const pw = sw / zz;
          const ph = sh / zz;
          ctx.drawImage(
            view.image,
            ox + (sw - pw) / 2,
            oy + (sh - ph) / 2,
            pw,
            ph,
            x,
            top,
            w,
            FH,
          );
        } else {
          ctx.fillStyle = "#E4E2DC";
          ctx.fillRect(x, top, w, FH);
          ctx.fillStyle = "#787774";
          ctx.font = '13px "Geist Mono", monospace';
          ctx.textAlign = "center";
          ctx.fillText(frame.label || "[Foto]", x + w / 2, top + FH / 2);
        }
        ctx.restore();
      }

      if (lensK >= 0 && hz[lensK] > 0.01 && lx != null && ly != null) {
        const lensX = lx;
        const lensY = ly;
        const e = 1 - Math.pow(1 - hz[lensK], 3);
        const R = 60 * e;
        ctx.save();
        ctx.globalCompositeOperation = "difference";
        ctx.strokeStyle = `rgba(255,255,255,${(0.9 * e).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(lensX, lensY, R, 0, Math.PI * 2);
        ctx.stroke();
        const txt = "VER PROYECTO · VER PROYECTO · ";
        const TR = R + 14;
        const step = (Math.PI * 2) / txt.length;
        ctx.font = '500 10px "Geist Mono", monospace';
        ctx.fillStyle = `rgba(255,255,255,${e.toFixed(3)})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let i = 0; i < txt.length; i += 1) {
          const ang = rot + i * step - Math.PI / 2;
          ctx.save();
          ctx.translate(
            lensX + Math.cos(ang) * TR,
            lensY + Math.sin(ang) * TR,
          );
          ctx.rotate(ang + Math.PI / 2);
          ctx.fillText(txt[i], 0, 0);
          ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(lensX, lensY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const loop = () => {
      draw();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [projects, count]);

  return (
    <section id="trabajo" style={{ padding: 0 }}>
      <div
        id="trabajo-track"
        ref={trackRef}
        style={{ position: "relative", zIndex: 2, height: trackHeight }}
      >
        <div
          className="vh-screen"
          style={{ position: "sticky", top: 0, overflow: "hidden" }}
        >
          <canvas
            id="ribbon"
            ref={canvasRef}
            aria-label="Proyectos en una tira de fotos"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              zIndex: 3,
              top: "clamp(24px, 4vh, 48px)",
              left: edge,
              right: edge,
              pointerEvents: "none",
            }}
          >
            <RevealTitle text="Proyectos" />
          </div>
          <div
            style={{
              position: "absolute",
              left: edge,
              right: edge,
              bottom: 36,
              pointerEvents: "none",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "8px 24px",
            }}
          >
            <span
              id="cur-name"
              ref={nameRef}
              style={{
                fontFamily: fontDisplay,
                fontSize: "clamp(32px, 3vw, 48px)",
                lineHeight: 1,
                textTransform: "uppercase",
                color: "#111111",
              }}
            >
              {first?.name ?? ""}
            </span>
            <span
              id="cur-meta"
              ref={infoRef}
              style={{
                fontFamily: fontMono,
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#787774",
              }}
            >
              {count > 0 ? indexLabel(0, count, first?.meta ?? "") : ""}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
