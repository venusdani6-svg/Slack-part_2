"use client";

import { useEffect, useRef } from "react";
import HelpPage from "./help/HelpPage";

type Props = {
  open: boolean;
  onClose: () => void;
};

/**
 * Slack-style right-side help panel.
 * - Slides in from the right with a smooth cubic-bezier transition.
 * - Semi-transparent backdrop closes on click.
 * - Escape key closes the panel.
 * - Body scroll is locked while open.
 * - Focus is moved to the close button on open for keyboard accessibility.
 */
export default function HelpModal({ open, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll + move focus when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Defer focus so the panel has finished its CSS transition start
      const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`
          fixed inset-0 z-[9998] bg-black/30
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Help"
        className={`
          fixed top-0 right-0 z-[9999]
          h-full w-full max-w-[520px]
          bg-white
          shadow-[-8px_0_32px_rgba(0,0,0,0.18)]
          flex flex-col
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Visually-hidden close button receives focus on open */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:right-3 focus:z-10 focus:px-3 focus:py-1 focus:bg-white focus:rounded focus:shadow focus:text-sm"
          aria-label="Close help panel"
        >
          Close
        </button>

        <HelpPage onClose={onClose} />
      </div>
    </>
  );
}
