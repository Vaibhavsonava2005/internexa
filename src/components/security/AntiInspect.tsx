"use client";

import { useEffect } from "react";

export function AntiInspect() {
  useEffect(() => {
    // 1. Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Debugger Trap (Pauses execution if DevTools is open)
    const antiDebug = () => {
      setInterval(() => {
        const start = performance.now();
        // eslint-disable-next-line no-debugger
        debugger;
        if (performance.now() - start > 100) {
          // DevTools is likely open, we could redirect or clear the DOM
          // document.body.innerHTML = 'Security violation detected.';
        }
      }, 1000);
    };

    // Only run in production to allow developers to build the app
    if (process.env.NODE_ENV !== "development") {
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);
      antiDebug();
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
