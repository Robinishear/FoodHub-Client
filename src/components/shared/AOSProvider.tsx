"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const AOSProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Wait for hydration to stabilize before initializing AOS
    const timer = setTimeout(() => {
      AOS.init({
        duration: 800,
        once: false,
        mirror: false,
      });
      AOS.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
};
