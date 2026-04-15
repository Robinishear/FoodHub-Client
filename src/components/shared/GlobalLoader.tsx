"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FullPageLoader } from "./FullPageLoader";

export function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.1, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-99999"
        >
          <FullPageLoader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
