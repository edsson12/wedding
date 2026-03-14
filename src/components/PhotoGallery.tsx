"use client";

import { useRef, useState, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import ScrollBouquets from "@/components/ScrollBouquets";

/* ── Photo data ────────────────────────────────────────────────────────────
   Drop any image (jpg, jpeg, png, webp, avif) into:
     /public/images/gallery/
   The carousel will pick them up automatically, sorted by filename.
   Captions come from the i18n files (photos.captions array).
   If there are more photos than captions, extra photos show no caption.
─────────────────────────────────────────────────────────────────────────── */

// Fixed slight rotations — deterministic, no Math.random()
const ROTATIONS  = [-2.5, 1.8, -1.3, 2.2, -1.7, 1.1];
const DELAYS     = [0, 0.12, 0.06, 0.18, 0.09, 0.15];

// Blush placeholder gradient shown when no image is present
const PLACEHOLDERS = [
  "linear-gradient(135deg, #F5D5DA 0%, #EAB5BC 100%)",
  "linear-gradient(135deg, #FBF0EE 0%, #F5D5DA 100%)",
  "linear-gradient(135deg, #EAB5BC 0%, #D4A0AE 100%)",
  "linear-gradient(135deg, #F5D5DA 0%, #D4A0AE 100%)",
  "linear-gradient(135deg, #FBF0EE 0%, #EAB5BC 100%)",
  "linear-gradient(135deg, #D4A0AE 0%, #F5D5DA 100%)",
];

/* ── Polaroid card ──────────────────────────────────────────────────────── */
function PolaroidCard({
  src,
  caption,
  index,
  inView,
  onClick,
}: {
  src: string;
  caption: string;
  index: number;
  inView: boolean;
  onClick: () => void;
}) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const delay    = DELAYS[index % DELAYS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotation * 1.6 }}
      animate={inView ? { opacity: 1, y: 0, rotate: rotation } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-sm select-none"
      style={{
        padding: "8px 8px 44px",
        border: "1px solid #F5D5DA",
        boxShadow: "0 4px 18px rgba(155,107,126,0.13), 0 1px 4px rgba(155,107,126,0.08)",
        transition: "box-shadow 0.3s ease",
      }}
      // Increase shadow on hover via CSS class approach
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 12px 40px rgba(155,107,126,0.25), 0 4px 12px rgba(155,107,126,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 18px rgba(155,107,126,0.13), 0 1px 4px rgba(155,107,126,0.08)";
      }}
    >
      {/* Image area */}
      <div
        className="w-full overflow-hidden relative"
        style={{
          aspectRatio: "4/5",
          background: PLACEHOLDERS[index % PLACEHOLDERS.length],
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 32vw, 320px"
          className="object-cover"
          loading="lazy"
          draggable={false}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      {/* Handwritten caption */}
      <p className="font-script italic text-center text-sm sm:text-base text-[#9B6B7E] mt-2 px-1 leading-tight line-clamp-1">
        {caption}
      </p>
    </motion.div>
  );
}

/* ── Lightbox ───────────────────────────────────────────────────────────── */
function Lightbox({
  index,
  photos,
  caption,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  photos: string[];
  caption: (i: number) => string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const src = photos[index] ?? "";

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      key="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-200 flex items-center justify-center"
      style={{ background: "rgba(24, 10, 16, 0.90)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors duration-200"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Foto anterior"
          className="absolute left-3 sm:left-6 z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Polaroid frame */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          padding: "clamp(8px, 1.5vw, 14px)",
          paddingBottom: "clamp(52px, 8vw, 76px)",
          width: "min(94vw, 860px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          flexShrink: 0,
        }}
      >
        <div
          className="relative w-full"
          style={{
            height: "min(72vh, 760px)",
            background: PLACEHOLDERS[index % PLACEHOLDERS.length],
            overflow: "hidden",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 94vw, 860px"
            className="object-contain"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <p className="font-script italic text-center text-xl sm:text-2xl text-[#9B6B7E] mt-3 px-2">
          {caption(index)}
        </p>
      </motion.div>

      {/* Next */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Foto siguiente"
          className="absolute right-3 sm:right-6 z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Page counter */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 font-lato text-xs tracking-[0.2em] uppercase text-white/40">
        {index + 1} / {photos.length}
      </p>
    </motion.div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */
export default function PhotoGallery() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex]     = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Dynamically loaded photos from /api/photos
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((list: string[]) => setPhotos(list))
      .catch(() => setPhotos([]));
  }, []);

  // Caption for index i — falls back to "" if i18n key is missing
  const caption = (i: number) => {
    const key = `photos.captions.${i}`;
    const val = t(key);
    return val === key ? "" : val;
  };

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev  = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const next  = useCallback(() => setLightboxIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)), [photos.length]);

  const goTo = useCallback((i: number) => {
    const idx   = Math.max(0, Math.min(photos.length - 1, i));
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx] as HTMLElement;
    if (!card) { setActiveIndex(idx); return; }
    const offset = card.offsetLeft - (track.offsetWidth / 2 - card.offsetWidth / 2);
    track.scrollTo({ left: offset, behavior: "smooth" });
    setActiveIndex(idx);
  }, [photos.length]);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;
    Array.from(track.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const cardCenter = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < minDist) { minDist = dist; closest = idx; }
    });
    setActiveIndex(closest);
  }, []);

  // Center first card before first paint and whenever photos list changes
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement;
    if (!card) return;
    const offset = card.offsetLeft - (track.offsetWidth / 2 - card.offsetWidth / 2);
    track.scrollLeft = Math.max(0, offset);
  }, [photos]);

  return (
    <motion.section
      id="fotos"
      className="relative h-full flex flex-col justify-center py-14 sm:py-20 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #FBF0EE 0%, #F5D5DA 55%, #FBF0EE 100%)" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
    >
      <ScrollBouquets delay={0.25} set={1} />

      {/* Top-left botanical SVG — same style as GiftSection */}
      <svg className="absolute top-6 left-6 w-28 sm:w-36 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden>
        <path d="M90 90 C70 60 40 40 10 10" stroke="#C98FA0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 85 C62 72 54 62 44 56" stroke="#C98FA0" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M85 68 C74 62 64 56 55 48" stroke="#8FAE9C" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="44" cy="56" rx="10" ry="16" fill="#8FAE9C" fillOpacity="0.6" transform="rotate(-30 44 56)" />
        <ellipse cx="55" cy="48" rx="9" ry="14" fill="#C98FA0" fillOpacity="0.55" transform="rotate(20 55 48)" />
      </svg>

      {/* Bottom-right botanical SVG */}
      <svg className="absolute bottom-6 right-6 w-28 sm:w-36 opacity-20 pointer-events-none" viewBox="0 0 100 100" fill="none" aria-hidden style={{ transform: "scaleX(-1) scaleY(-1)" }}>
        <path d="M90 90 C70 60 40 40 10 10" stroke="#C98FA0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M70 85 C62 72 54 62 44 56" stroke="#C98FA0" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M85 68 C74 62 64 56 55 48" stroke="#8FAE9C" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="44" cy="56" rx="10" ry="16" fill="#8FAE9C" fillOpacity="0.6" transform="rotate(-30 44 56)" />
      </svg>

      <div ref={ref} className="w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 px-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-lato text-xs uppercase tracking-[0.35em] text-[#C98FA0] mb-4"
          >
            {t("photos.subtitle")}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-script text-5xl sm:text-6xl md:text-7xl text-[#9B6B7E]"
          >
            {t("photos.title")}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ transformOrigin: "center" }}
            className="mx-auto mt-5 h-px w-24 bg-[#C98FA0]/40"
          />
        </div>

        {/* ── Carousel track ── */}
        <div
          ref={trackRef}
          className="flex flex-row overflow-x-auto"
          style={{
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            gap: "clamp(16px, 2.5vw, 32px)",
            paddingTop: "20px",
            paddingBottom: "32px",
            paddingLeft: "max(16px, calc(50% - clamp(120px, 16vw, 160px)))",
            paddingRight: "max(16px, calc(50% - clamp(120px, 16vw, 160px)))",
          }}
          onScroll={handleScroll}
        >
          {photos.map((src, i) => (
            <div
              key={src}
              style={{ flex: "0 0 clamp(240px, 32vw, 320px)", scrollSnapAlign: "center" }}
            >
              <PolaroidCard
                src={src}
                caption={caption(i)}
                index={i}
                inView={inView}
                onClick={() => setLightboxIndex(i)}
              />
            </div>
          ))}
        </div>

        {/* ── Prev · dots · next ── */}
        <div className="flex items-center justify-center gap-5 mt-1 pb-2">
          <button
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Foto anterior"
            className="w-9 h-9 rounded-full border border-[#C98FA0]/50 flex items-center justify-center text-[#C98FA0] hover:bg-[#C98FA0]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Foto ${i + 1}`}
                style={{
                  width: i === activeIndex ? "20px" : "7px",
                  height: "7px",
                  borderRadius: "9999px",
                  background: "#C98FA0",
                  opacity: i === activeIndex ? 1 : 0.3,
                  transition: "all 0.3s ease",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === photos.length - 1}
            aria-label="Foto siguiente"
            className="w-9 h-9 rounded-full border border-[#C98FA0]/50 flex items-center justify-center text-[#C98FA0] hover:bg-[#C98FA0]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lightbox portal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            photos={photos}
            caption={caption}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
