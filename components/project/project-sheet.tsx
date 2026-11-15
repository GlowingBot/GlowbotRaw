"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const EASE_MS = 750;

let pendingScroll = 0;

export function rememberSheetScroll(y: number) {
  pendingScroll = y;
}

function focusable(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])")].filter(
    (node) => !node.hasAttribute("disabled"),
  );
}

export function ProjectSheet({ children }: { children: ReactNode }) {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<() => void>(() => {});
  const [open, setOpen] = useState(false);

  useLayoutEffect(() => {
    sheetRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const frame = document.getElementById("site-frame");
    const shift = document.getElementById("site-shift");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = pendingScroll || window.scrollY;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const html = document.documentElement;
    const body = document.body;
    const htmlOverflow = html.style.overflow;
    const bodyOverflow = body.style.overflow;
    const previousRestoration = history.scrollRestoration;
    let alive = true;
    let frameId = 0;
    let timer = 0;
    let closing = false;

    history.scrollRestoration = "manual";
    if (shift) shift.style.transform = `translateY(${-y}px)`;
    if (frame) {
      frame.style.position = "fixed";
      frame.style.inset = "0";
      frame.style.overflow = "hidden";
      frame.style.transformOrigin = "center top";
      frame.setAttribute("inert", "");
    }
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const show = () => {
      if (!alive) return;
      frame?.classList.add("is-behind");
      setOpen(true);
      sheetRef.current?.focus({ preventScroll: true });
    };

    if (reduce) show();
    else frameId = window.requestAnimationFrame(show);

    const close = () => {
      if (!alive || closing) return;
      closing = true;
      setOpen(false);
      frame?.classList.remove("is-behind");
      if (reduce) {
        routerRef.current.back();
        return;
      }
      timer = window.setTimeout(() => routerRef.current.back(), EASE_MS);
    };
    closeRef.current = close;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const root = sheetRef.current;
      if (!root) return;
      const nodes = focusable(root);
      if (!nodes.length) {
        event.preventDefault();
        root.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === root || !root.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !root.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      alive = false;
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timer) window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      frame?.classList.remove("is-behind");
      if (frame) {
        frame.style.position = "";
        frame.style.inset = "";
        frame.style.overflow = "";
        frame.style.transformOrigin = "";
        frame.removeAttribute("inert");
      }
      if (shift) shift.style.transform = "";
      html.style.overflow = htmlOverflow;
      body.style.overflow = bodyOverflow;
      const pin = () => window.scrollTo({ top: y, left: 0, behavior: "instant" });
      pin();
      window.requestAnimationFrame(() => {
        pin();
        window.requestAnimationFrame(pin);
      });
      window.setTimeout(() => {
        pin();
        history.scrollRestoration = previousRestoration;
      }, 80);
      const photo = document.getElementById("ribbon");
      const stillThere = previous && document.contains(previous) && previous !== sheetRef.current;
      const target = photo ?? (stillThere ? previous : null);
      target?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <>
      <div className={open ? "sheet-backdrop is-open" : "sheet-backdrop"} onClick={() => closeRef.current()} />
      <div
        ref={sheetRef}
        className={open ? "sheet is-open" : "sheet"}
        role="dialog"
        aria-modal="true"
        aria-label="Proyecto"
        tabIndex={-1}
      >
        <header className="sheet-bar">
          <div className="sheet-grab" aria-hidden="true" />
          <div className="sheet-bar-row">
            <span className="sheet-brand">Guillermo López</span>
            <button type="button" className="sheet-close" onClick={() => closeRef.current()}>
              Cerrar
              <span className="sheet-x" aria-hidden="true">
                ✕
              </span>
            </button>
          </div>
        </header>
        {children}
      </div>
    </>
  );
}
