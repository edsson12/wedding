"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import Image from "next/image";

function ParallaxFlower({
  src,
  width,
  posStyle,
  yRange,
  scrollYProgress,
  rotate = 0,
  flipX = false,
  opacity = 0.88,
}: {
  src: string;
  width: number;
  posStyle: React.CSSProperties;
  yRange: [number, number];
  scrollYProgress: MotionValue<number>;
  rotate?: number;
  flipX?: boolean;
  opacity?: number;
}) {
  const y = useTransform(scrollYProgress, [0, 1], yRange);
  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ ...posStyle, y, rotate, scaleX: flipX ? -1 : 1, opacity }}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={width}
        className="h-auto object-contain"
        style={{ filter: "drop-shadow(0 4px 14px rgba(155,107,126,0.18))" }}
      />
    </motion.div>
  );
}

const SETS = [
  [
    { src: "/images/flower1.png", width: 200, posStyle: { bottom: "-30px", left: "-40px" }, yRange: [60, -30] as [number, number], rotate: 20,  flipX: false, opacity: 0.88 },
    { src: "/images/flower2.png", width: 130, posStyle: { top: "35%",     left: "-20px" }, yRange: [-20,  40] as [number, number], rotate: -12, flipX: false, opacity: 0.70 },
    { src: "/images/flower3.png", width: 200, posStyle: { top: "-30px",   right: "-40px" }, yRange: [-60, 30] as [number, number], rotate: -20, flipX: true,  opacity: 0.88 },
    { src: "/images/flower4.png", width: 130, posStyle: { bottom: "30%",  right: "-20px" }, yRange: [20, -40] as [number, number], rotate: 15,  flipX: true,  opacity: 0.70 },
  ],
  [
    { src: "/images/flower3.png", width: 200, posStyle: { bottom: "-30px", left: "-40px" }, yRange: [60, -30] as [number, number], rotate: 15,  flipX: false, opacity: 0.88 },
    { src: "/images/flower4.png", width: 130, posStyle: { top: "40%",     left: "-20px" }, yRange: [-20,  40] as [number, number], rotate: -10, flipX: false, opacity: 0.70 },
    { src: "/images/flower5.png", width: 200, posStyle: { top: "-30px",   right: "-40px" }, yRange: [-60, 30] as [number, number], rotate: -15, flipX: true,  opacity: 0.88 },
    { src: "/images/flower6.png", width: 130, posStyle: { bottom: "35%",  right: "-20px" }, yRange: [20, -40] as [number, number], rotate: 10,  flipX: true,  opacity: 0.70 },
  ],
  [
    { src: "/images/flower5.png", width: 200, posStyle: { bottom: "-30px", left: "-40px" }, yRange: [60, -30] as [number, number], rotate: 25,  flipX: false, opacity: 0.88 },
    { src: "/images/flower6.png", width: 130, posStyle: { top: "30%",     left: "-20px" }, yRange: [-20,  40] as [number, number], rotate: -8,  flipX: false, opacity: 0.70 },
    { src: "/images/flower1.png", width: 200, posStyle: { top: "-30px",   right: "-40px" }, yRange: [-60, 30] as [number, number], rotate: -25, flipX: true,  opacity: 0.88 },
    { src: "/images/flower2.png", width: 130, posStyle: { bottom: "28%",  right: "-20px" }, yRange: [20, -40] as [number, number], rotate: 8,   flipX: true,  opacity: 0.70 },
  ],
];

export default function ScrollBouquets({ delay, set = 0 }: { delay?: number; set?: number }) {
  void delay;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {SETS[set % 3].map((f, i) => (
        <ParallaxFlower key={i} {...f} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}