"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Fallback gradient — replace with your photo at /images/hero-bg.jpg */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg'), linear-gradient(135deg, #3d1a27 0%, #6b3a4a 35%, #a05c72 65%, #c4849a 85%, #d4af7a 100%)`,
            backgroundColor: "#5a2d42",
          }}
        />
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center text-white px-6 max-w-2xl mx-auto flex flex-col items-center justify-center"
      >
        {/* Save the date label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.3em" }}
          animate={{ opacity: 1, letterSpacing: "0.4em" }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-xs sm:text-sm uppercase tracking-[0.4em] text-white/80 mb-6 font-lato font-light"
        >
          Save the Date
        </motion.p>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mb-4"
        >
          <h1 className="font-script text-[4.5rem] sm:text-[7rem] md:text-[9rem] leading-none font-light italic text-white drop-shadow-lg">
            Vale
          </h1>
          <p className="font-script text-3xl sm:text-4xl md:text-5xl text-white/80 italic font-light my-1">
            &amp;
          </p>
          <h1 className="font-script text-[4.5rem] sm:text-[7rem] md:text-[9rem] leading-none font-light italic text-white drop-shadow-lg">
            Edu
          </h1>
        </motion.div>

        {/* Date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.0 }}
          className="mt-6 mb-10 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-white/50" />
            <p className="font-lato text-sm sm:text-base tracking-[0.25em] uppercase text-white/90">
              25 · Julio · 2026
            </p>
            <div className="h-px w-12 bg-white/50" />
          </div>
          <p className="font-lato text-xs tracking-[0.2em] uppercase text-white/70">
            Zaragoza, España
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — fixed at bottom of section, outside content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.button
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() =>
            document
              .getElementById("countdown")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Scroll hacia abajo"
        >
          <span className="text-white/60 text-xs tracking-widest uppercase font-lato">
            Scroll
          </span>
          <svg
            className="w-5 h-5 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>
      </motion.div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
            fill="#FBF5EF"
          />
        </svg>
      </div>
    </section>
  );
}
