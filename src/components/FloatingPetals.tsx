"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// SVG petal shapes
const PetalSVG = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size * 1.4}
    viewBox="0 0 30 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 2 C22 2 28 10 28 20 C28 32 22 40 15 40 C8 40 2 32 2 20 C2 10 8 2 15 2 Z"
      fill={color}
      fillOpacity="0.7"
    />
    <path
      d="M15 8 C15 8 18 14 18 20 C18 28 15 34 15 34"
      stroke="white"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />
  </svg>
);

const LeafSVG = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size * 1.2}
    height={size}
    viewBox="0 0 40 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 15 C10 5 30 2 38 15 C30 28 10 25 2 15 Z"
      fill={color}
      fillOpacity="0.6"
    />
    <path d="M2 15 C10 5 30 2 38 15" stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />
  </svg>
);

const FlowerSVG = ({ color, size }: { color: string; size: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <ellipse
        key={i}
        cx={20 + 8 * Math.cos((angle * Math.PI) / 180)}
        cy={20 + 8 * Math.sin((angle * Math.PI) / 180)}
        rx={5}
        ry={8}
        transform={`rotate(${angle} ${20 + 8 * Math.cos((angle * Math.PI) / 180)} ${20 + 8 * Math.sin((angle * Math.PI) / 180)})`}
        fill={color}
        fillOpacity="0.75"
      />
    ))}
    <circle cx="20" cy="20" r="5" fill="#FBF5EF" fillOpacity="0.9" />
  </svg>
);

interface FloatingElement {
  id: number;
  x: number; // % from left
  type: "petal" | "leaf" | "flower";
  color: string;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  amplitude: number; // horizontal sway px
}

const colors = [
  "#F4D6C7", // blush
  "#E8A898", // peach
  "#C4849A", // dusty rose
  "#8B9D77", // sage
  "#D4AF7A", // gold
  "#FADADD", // light pink
];

function generateElements(count: number): FloatingElement[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    type: (["petal", "petal", "leaf", "flower"] as const)[Math.floor(Math.random() * 4)],
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 14 + Math.random() * 18,
    duration: 6 + Math.random() * 10,
    delay: Math.random() * 8,
    rotation: Math.random() * 360,
    amplitude: 20 + Math.random() * 40,
  }));
}

function FloatingItem({ el }: { el: FloatingElement }) {
  const Icon =
    el.type === "petal"
      ? PetalSVG
      : el.type === "leaf"
      ? LeafSVG
      : FlowerSVG;

  return (
    <motion.div
      key={el.id}
      className="absolute pointer-events-none select-none"
      style={{ left: `${el.x}%`, top: -60 }}
      animate={{
        y: ["0vh", "110vh"],
        x: [0, el.amplitude, -el.amplitude / 2, el.amplitude / 3, 0],
        rotate: [el.rotation, el.rotation + 180, el.rotation + 360],
        opacity: [0, 0.8, 0.8, 0],
      }}
      transition={{
        duration: el.duration,
        delay: el.delay,
        repeat: Infinity,
        ease: "linear",
        times: [0, 0.1, 0.9, 1],
      }}
    >
      <Icon color={el.color} size={el.size} />
    </motion.div>
  );
}

export default function FloatingPetals({ isMobile }: { isMobile?: boolean }) {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const count = isMobile ? 10 : 20;
    setElements(generateElements(count));
  }, [isMobile]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {elements.map((el) => (
        <FloatingItem key={el.id} el={el} />
      ))}
    </div>
  );
}
