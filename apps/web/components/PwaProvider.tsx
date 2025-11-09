"use client";

import { useEffect } from "react";

const SW_PATH = "/sw.js";

/**
 * Registers the service worker to enable offline caching when supported.
 */
export function PwaProvider() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    let mounted = true;

    const register = async () => {
      try {
        const existing = await navigator.serviceWorker.getRegistration();
        if (
          existing &&
          existing.active &&
          existing.active.scriptURL.includes(SW_PATH) &&
          existing.active.state !== "redundant"
        ) {
          return;
        }
        await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
      } catch (error) {
        console.error("Service Worker registration failed", error);
      }
    };

    if (window.isSecureContext || window.location.hostname === "localhost") {
      register();
    }

    return () => {
      mounted = false;
      if (!("serviceWorker" in navigator)) return;
      navigator.serviceWorker.ready.then((registration) => {
        if (!mounted) {
          return;
        }
        registration.update().catch(() => {
          // Ignore update failures; SW will try again on next load.
        });
      });
    };
  }, []);

  return null;
}
