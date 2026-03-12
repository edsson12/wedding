"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const flowers = [
  { src: "/images/flower1.png", from: "left",  delay: 0 },
  { src: "/images/flower2.png", from: "right", delay: 0.1 },
  { src: "/images/flower3.png", from: "left",  delay: 0.2 },
  { src: "/images/flower4.png", from: "right", delay: 0.3 },
  { src: "/images/flower5.png", from: "left",  delay: 0.4 },
  { src: "/images/flower6.png", from: "right", delay: 0.5 },
] as const;

function FlowerItem({ src, from, delay }: { src: string; from: "left" | "right"; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: from === "left" ? -70 : 70, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 1.1, ease: "easeOut", delay }}
      className="flex justify-center"
    >
      <Image
        src={src}
        alt=""
        width={180}
        height={180}
        className="w-24 sm:w-32 md:w-40 h-auto object-contain drop-shadow-md"
      />
    </motion.div>
  );
}

export default function AnimatedFlowers() {
  return (
    <div className="relative py-12 sm:py-16 overflow-hidden" style={{ background: "#FBF0EE" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px" style={{ background: "#EAB5BC" }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-10 items-end justify-items-center">
          {flowers.map((f, i) => (
            <FlowerItem key={i} src={f.src} from={f.from} delay={f.delay} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px" style={{ background: "#EAB5BC" }} />
    </div>
  );
}
