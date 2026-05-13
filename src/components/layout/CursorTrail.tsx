import { useEffect } from "react";

const TRAIL_INTERVAL_MS = 28;

export function CursorTrail() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHoverPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (prefersReducedMotion || !hasHoverPointer) return;

    let lastTrailAt = 0;

    const addTrailDot = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;

      const now = performance.now();
      if (now - lastTrailAt < TRAIL_INTERVAL_MS) return;
      lastTrailAt = now;

      const dot = document.createElement("span");
      dot.className = "cursor-trail-dot";
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;

      document.body.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
    };

    window.addEventListener("pointermove", addTrailDot, { passive: true });

    return () => {
      window.removeEventListener("pointermove", addTrailDot);
      document.querySelectorAll(".cursor-trail-dot").forEach(dot => dot.remove());
    };
  }, []);

  return null;
}
