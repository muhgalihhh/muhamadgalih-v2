"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  // Large circle — slow, laggy spring for dramatic trail effect
  const circleX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.8 });
  const circleY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.8 });

  // Small dot — fast, precise
  const dotX = useSpring(mouseX, { stiffness: 700, damping: 38, mass: 0.3 });
  const dotY = useSpring(mouseY, { stiffness: 700, damping: 38, mass: 0.3 });

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    document.documentElement.classList.add("cursor-custom");

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.matches("a, button, [role='button'], input, textarea, select, label") ||
        !!target.closest("a, button, [role='button']")
      );
    };

    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup",   onUp);

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup",   onUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || isTouch) return null;

  return (
    <>
      {/* Large invert circle — mix-blend-mode: difference creates negative effect on content */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full z-[9998]"
        style={{
          x: circleX,
          y: circleY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "white",
          mixBlendMode: "difference",
        }}
        animate={{
          width:  isHovering ? 90 : isClicking ? 48 : 64,
          height: isHovering ? 90 : isClicking ? 48 : 64,
          opacity: isClicking ? 0.7 : 1,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
      />

      {/* Small precise dot — also mix-blend for seamless integration */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "white",
          mixBlendMode: "difference",
          width: 8,
          height: 8,
        }}
        animate={{ scale: isClicking ? 0.5 : 1 }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
