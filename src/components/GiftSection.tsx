"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function GiftSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [copied, setCopied] = useState(false);

  const iban = "FR76 4061 8803 6800 0408 6218 304";

  function handleCopy() {
    navigator.clipboard.writeText(iban.replace(/\s/g, "")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <motion.section
      id="regalo"
      className="relative h-full flex flex-col justify-center py-20 sm:py-28 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FBF0EE 0%, #F5D5DA 100%)" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background botanical blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #C98FA0, transparent)" }} />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #D4A0AE, transparent)" }} />

      {/* Small SVG corner florals */}
      <svg className="absolute top-6 left-6 w-24 opacity-25 pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden>
        <path d="M90 90 C70 60 40 40 10 10" stroke="#C98FA0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 85 C62 72 54 62 44 56" stroke="#C98FA0" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M85 68 C74 62 64 56 55 48" stroke="#8FAE9C" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="44" cy="56" rx="10" ry="16" fill="#8FAE9C" fillOpacity="0.6" transform="rotate(-30 44 56)" />
        <ellipse cx="55" cy="48" rx="9" ry="14" fill="#C98FA0" fillOpacity="0.55" transform="rotate(20 55 48)" />
      </svg>
      <svg className="absolute bottom-6 right-6 w-24 opacity-25 pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden style={{ transform: "scaleX(-1) scaleY(-1)" }}>
        <path d="M90 90 C70 60 40 40 10 10" stroke="#C98FA0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 85 C62 72 54 62 44 56" stroke="#C98FA0" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="44" cy="56" rx="10" ry="16" fill="#8FAE9C" fillOpacity="0.6" transform="rotate(-30 44 56)" />
      </svg>

      <div ref={ref} className="max-w-2xl mx-auto px-6 text-center">
        {/* Emoji header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="text-5xl mb-6"
        >
          🎁
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-script text-4xl sm:text-5xl md:text-6xl text-[#9B6B7E] mb-5"
        >
          {t("gift.title")}
        </motion.h2>

        {/* Witty subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[#6B4F57] text-base sm:text-lg leading-relaxed mb-3"
          style={{ fontWeight: 300 }}
        >
          {t("gift.p1")}{" "}
          <span className="italic text-[#C98FA0]">{t("gift.p1italic")}</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="text-[#9B6B7E] text-sm leading-relaxed mb-10"
          style={{ fontWeight: 300 }}
        >
          {t("gift.p2")}
        </motion.p>

        {/* Bank card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.35 }}
          className="relative mx-auto rounded-3xl overflow-hidden shadow-xl"
          style={{
            background: "linear-gradient(135deg, #9B6B7E 0%, #C98FA0 55%, #D4A0AE 100%)",
            maxWidth: "420px",
            minHeight: "220px",
          }}
        >
          {/* Card sheen */}
          <div className="absolute inset-0 opacity-20"
            style={{ background: "radial-gradient(ellipse at 30% 30%, #fff, transparent 60%)" }} />
          {/* Card dot grid decoration */}
          <svg className="absolute top-4 right-4 w-24 opacity-15" viewBox="0 0 80 80" aria-hidden>
            {Array.from({ length: 6 }, (_, r) =>
              Array.from({ length: 6 }, (_, c) => (
                <circle key={`${r}-${c}`} cx={c * 14 + 7} cy={r * 14 + 7} r="1.8" fill="#fff" />
              ))
            )}
          </svg>

          <div className="relative z-10 p-7 text-left text-white">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-7 rounded bg-[#F5D5DA]/40 border border-white/20" />
              <span className="text-white/70 text-xs tracking-widest uppercase font-light">Boursorama</span>
            </div>

            <div className="mb-4">
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1" style={{ fontWeight: 300 }}>{t("gift.ibanLabel")}</p>
              <p className="text-white text-base tracking-wider break-all" style={{ fontFamily: "var(--font-montserrat), monospace", fontWeight: 400, letterSpacing: "0.08em" }}>
                {iban}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-widest mb-0.5" style={{ fontWeight: 300 }}>{t("gift.holderLabel")}</p>
                <p className="text-white text-sm" style={{ fontFamily: "var(--font-parisienne), cursive", fontSize: "20px" }}>
                  Valeria &amp; Eduardo
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="cursor-pointer flex items-center gap-1.5 bg-white/20 hover:bg-white/35 transition-colors duration-200 text-white text-xs px-3 py-2 rounded-full border border-white/30"
                style={{ fontWeight: 300, letterSpacing: "0.05em" }}
              >
                {copied ? t("gift.copied") : t("gift.copy")}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Funny footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="text-[#C98FA0] text-xs sm:text-sm mt-8 italic leading-relaxed"
          style={{ fontWeight: 300 }}
        >
          {t("gift.footnote")}
        </motion.p>
      </div>
    </motion.section>
  );
}
