"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const navLinks = [
  { href: "#countdown", label: "El gran día" },
  { href: "#timeline", label: "Programa" },
  { href: "#cuando-donde", label: "Lugar" },
  { href: "#rsvp", label: "Confirmar asistencia" },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer
      className="relative overflow-hidden py-16 sm:py-20"
      style={{ background: "linear-gradient(135deg, #5a1e30 0%, #8B3A52 50%, #6b2a3f 100%)" }}
    >
      {/* Decorative wave top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 sm:h-14" preserveAspectRatio="none">
          <path d="M0,30 C360,0 1080,60 1440,30 L1440,0 L0,0 Z" fill="#FBF5EF" />
        </svg>
      </div>

      {/* Glow blobs */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "rgba(196,132,154,0.15)", filter: "blur(60px)" }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgba(244,214,199,0.1)", filter: "blur(60px)" }} />

      <div ref={ref} className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Flower */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <ellipse
                key={i}
                cx={32 + 13 * Math.cos((angle * Math.PI) / 180)}
                cy={32 + 13 * Math.sin((angle * Math.PI) / 180)}
                rx={8}
                ry={13}
                transform={`rotate(${angle} ${32 + 13 * Math.cos((angle * Math.PI) / 180)} ${32 + 13 * Math.sin((angle * Math.PI) / 180)})`}
                fill="#F4D6C7"
                fillOpacity="0.75"
              />
            ))}
            <circle cx="32" cy="32" r="8" fill="#D4AF7A" fillOpacity="0.9" />
          </svg>
        </motion.div>

        {/* Names */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-script text-6xl sm:text-7xl italic font-light"
          style={{ color: "#fff" }}
        >
          Vale &amp; Edu
        </motion.h2>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-lato text-sm tracking-[0.3em] uppercase mt-3 mb-8"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          25 · 07 · 2026 · Zaragoza
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-px w-24 mx-auto mb-8"
          style={{ background: "rgba(244,214,199,0.5)" }}
        />

        {/* Nav links */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-10"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-lato text-xs tracking-widest uppercase transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.7)" }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "white")}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)")}
            >
              {link.label}
            </a>
          ))}
        </motion.nav>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="font-script italic text-xl sm:text-2xl mb-8"
          style={{ color: "rgba(244,214,199,0.9)" }}
        >
          &ldquo;El amor no mira con los ojos, sino con la mente.&rdquo;
        </motion.p>

        {/* Bottom */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="font-lato text-xs"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          Hecho con 🤍 para nuestra boda
        </motion.p>
      </div>
    </footer>
  );
}
