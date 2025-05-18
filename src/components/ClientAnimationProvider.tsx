"use client";

import { ReactNode, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface ClientAnimationProviderProps {
  children: ReactNode;
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function ClientAnimationProvider({ children }: ClientAnimationProviderProps) {
  const pathname = usePathname();
  // Handle initial load animation
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    // After component mounts, it's no longer the first mount
    setIsFirstMount(false);
  }, []);

  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.main
        key={pathname}
        className="min-h-screen flex flex-col"
        initial={isFirstMount ? "hidden" : "hidden"}
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ 
          duration: 0.4, 
          ease: [0.22, 1, 0.36, 1] // Custom easing for smoother transitions
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
} 