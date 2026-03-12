"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function QuizCTA() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="quiz"
      className="relative h-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2D1B2E 0%, #6B2A3F 50%, #9B3F5F 100%)" }}
    >
      {/* Decorative background rings */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/8" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/10" />
      </div>

      {/* Floating petals / blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #EAB5BC, transparent)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #C98FA0, transparent)" }} />

      {/* Corner floral SVG top-left */}
      <svg className="absolute top-6 left-6 w-28 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden>
        <path d="M90 90 C70 60 40 40 10 10" stroke="#EAB5BC" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 85 C62 72 54 62 44 56" stroke="#EAB5BC" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M85 68 C74 62 64 56 55 48" stroke="#8FAE9C" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="44" cy="56" rx="10" ry="16" fill="#8FAE9C" fillOpacity="0.5" transform="rotate(-30 44 56)" />
        <ellipse cx="55" cy="48" rx="9" ry="14" fill="#EAB5BC" fillOpacity="0.5" transform="rotate(20 55 48)" />
      </svg>
      {/* Corner floral SVG bottom-right */}
      <svg className="absolute bottom-6 right-6 w-28 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden style={{ transform: "scaleX(-1) scaleY(-1)" }}>
        <path d="M90 90 C70 60 40 40 10 10" stroke="#EAB5BC" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 85 C62 72 54 62 44 56" stroke="#EAB5BC" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="44" cy="56" rx="10" ry="16" fill="#8FAE9C" fillOpacity="0.5" transform="rotate(-30 44 56)" />
      </svg>

      {/* Content */}
      <div ref={ref} className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
        {/* Trophy emoji */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.6, type: "spring", stiffness: 200, delay: 0.05 }}
          className="text-6xl mb-5 select-none"
        >
          🏆
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-lato text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "#EAB5BC" }}
        >
          {t("quizCta.subtitle")}
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-script text-5xl sm:text-6xl md:text-7xl italic font-light mb-5"
          style={{ color: "#fff" }}
        >
          {t("quizCta.title")}
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-px w-20 mb-5"
          style={{ background: "rgba(234,181,188,0.5)" }}
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="font-lato text-base sm:text-lg leading-relaxed mb-10"
          style={{ color: "rgba(255,255,255,0.75)", fontWeight: 300 }}
        >
          {t("quizCta.description")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 font-lato text-sm font-semibold tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #EAB5BC, #C98FA0)",
              color: "#2D1B2E",
              letterSpacing: "0.12em",
            }}
          >
            {t("quizCta.button")}
          </Link>
          <Link
            href="/quiz#ranking"
            className="inline-flex items-center gap-2 font-lato text-sm tracking-widest uppercase px-6 py-4 rounded-full border transition-all duration-300 hover:bg-white/10"
            style={{
              borderColor: "rgba(234,181,188,0.4)",
              color: "rgba(234,181,188,0.85)",
              letterSpacing: "0.1em",
            }}
          >
            {t("quizCta.ranking")}
          </Link>
        </motion.div>

        {/* Vale & Edu signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-script text-2xl mt-10 italic"
          style={{ color: "rgba(234,181,188,0.6)" }}
        >
          Vale &amp; Edu
        </motion.p>
      </div>
    </section>
  );
}
