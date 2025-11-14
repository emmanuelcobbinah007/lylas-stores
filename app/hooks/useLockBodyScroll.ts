"use client";

import { useEffect } from "react";

/**
 * Lock body scroll while `locked` is true.
 * This uses a position:fixed approach to preserve scroll position on mobile
 * and prevents background scrolling / overscroll.
 */
export default function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const body = document.body;
    if (!locked) return;

    // Save current scroll position
    const scrollY = window.scrollY || window.pageYOffset;

    // Apply lock styles
    const previousOverflow = body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      // Restore styles
      body.style.overflow = previousOverflow || "";
      body.style.position = previousPosition || "";
      body.style.top = previousTop || "";
      body.style.width = previousWidth || "";

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}
