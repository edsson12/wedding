"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import ScrollBouquets from "@/components/ScrollBouquets";

const VenueIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 10l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V10z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 21V12h6v9"
    />
  </svg>
);

const MapIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-7 h-7"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7"
    />
  </svg>
);

const CARD_CONFIG = [
  {
    Icon: VenueIcon,
    link: "https://www.google.com/maps/search/Cam.+la+Raya,+s/n,+50002+Zaragoza,+España",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2981.517318634454!2d-0.8561649!3d41.6445636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5915a6fc693503%3A0x7d1d24fc1201adc8!2sCasalizio%20-%20Restaurante%20-%20Arrocer%C3%ADa%20-%20Eventos!5e0!3m2!1ses!2sco!4v1773293470961!5m2!1ses!2sco",
  },
  {
    Icon: HomeIcon,
    link: "https://www.booking.com/city/es/zaragoza.es.html",
    mapSrc:
      "https://maps.google.com/maps?q=Centro+Histórico+Zaragoza+España&t=&z=14&ie=UTF8&iwloc=B&output=embed",
  },
  {
    Icon: MapIcon,
    link: "https://www.renfe.com",
    mapSrc:
      "https://maps.google.com/maps?q=Estación+de+Zaragoza-Delicias&t=&z=15&ie=UTF8&iwloc=B&output=embed",
  },
];

const DressCodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
    {/* Bow-tie shape */}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8.5l7.2 3.5L4 15.5V8.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 8.5l-7.2 3.5L20 15.5V8.5z" />
    <circle cx="12" cy="12" r="1.3" strokeWidth={1.5} />
  </svg>
);

const TIP_ICONS = ["🏛️", "🥘", "🌿", "🛍️", "🎡"];

export default function WhenWhere() {
  const { t } = useTranslation();

  const [modalCard, setModalCard] = useState<number | null>(null);

  const locationCards = CARD_CONFIG.map((cfg, i) => ({
    icon: <cfg.Icon />,
    label: t(`whenWhere.cards.${i}.label`),
    title: t(`whenWhere.cards.${i}.title`),
    body: t(`whenWhere.cards.${i}.body`),
    sub: t(`whenWhere.cards.${i}.sub`),
    link: cfg.link,
    linkText: t(`whenWhere.cards.${i}.linkText`),
    mapSrc: cfg.mapSrc,
  }));

  const curiosidades = TIP_ICONS.map((icon, i) => ({
    icon,
    text: t(`whenWhere.tips.${i}`),
  }));

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const tipsRef = useRef<HTMLDivElement>(null);
  const tipsInView = useInView(tipsRef, { once: true, margin: "-60px" });

  return (
    <motion.section
      id="cuando-donde"
      className="relative py-20 sm:py-28 bg-white"
      style={{ minHeight: "100vh" }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8 }}
    >
      <ScrollBouquets delay={0.25} set={2} />
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[--color-blush]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[--color-sage]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl text-[--color-dusty-rose] mb-2 italic"
          >
            {t("whenWhere.subtitle")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-script text-4xl sm:text-5xl md:text-6xl text-[--color-wine] font-semibold"
          >
            {t("whenWhere.title")}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 h-px w-24 bg-[--color-peach] mx-auto"
          />
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {locationCards.map((card, i) => {
            const CARD_COLORS = ["#9B6B7E", "#8FAE9C", "#C98FA0"];
            const color = CARD_COLORS[i];
            return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
              onClick={() => setModalCard(i)}
              className="bg-white rounded-2xl p-6 sm:p-7 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              style={{ border: `1.5px solid ${color}55`, boxShadow: `0 2px 12px ${color}15` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1.5px solid ${color}40`, color }}
              >
                {card.icon}
              </div>
              <p className="font-lato text-xs uppercase tracking-[0.2em]" style={{ color }}>
                {card.label}
              </p>
              <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[--color-foreground]">
                {card.title}
              </h3>
              <p className="font-lato text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                {card.body}
              </p>
              <p className="font-lato text-xs text-gray-400 italic">
                {card.sub}
              </p>
              <div className="mt-auto inline-flex items-center gap-1.5 font-lato text-sm font-semibold transition-colors duration-200" style={{ color }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {card.linkText}
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* Dress Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="flex justify-center mb-14"
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col gap-3 w-full max-w-sm"
            style={{ border: "1.5px solid #9B6B7E55", boxShadow: "0 2px 16px #9B6B7E18" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "#9B6B7E18", border: "1.5px solid #9B6B7E40", color: "#9B6B7E" }}
            >
              <DressCodeIcon />
            </div>
            <p className="font-lato text-xs uppercase tracking-[0.2em]" style={{ color: "#9B6B7E" }}>
              {t("whenWhere.dressCode.label")}
            </p>
            <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[--color-foreground]">
              {t("whenWhere.dressCode.title")}
            </h3>
            <p className="font-lato text-sm text-gray-500 leading-relaxed">
              {t("whenWhere.dressCode.body")}
            </p>
          </div>
        </motion.div>

        {/* Tips Zaragoza */}
        <div ref={tipsRef}>
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            animate={tipsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-script text-3xl sm:text-4xl text-[--color-wine] mb-8 text-center"
          >
            {t("whenWhere.tipsTitle")}
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-4">
            {curiosidades.map((tip, i) => {
              const TIP_COLORS = ["#8FAE9C", "#9B6B7E", "#8FAE9C", "#C98FA0", "#9B6B7E"];
              const color = TIP_COLORS[i];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={tipsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.1 }}
                  className="bg-white rounded-2xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  style={{
                    border: `1.5px solid ${color}55`,
                    boxShadow: `0 2px 12px ${color}18`,
                    width: "clamp(220px, 30%, 340px)",
                  }}
                >
                  <div
                    className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${color}22`, border: `1.5px solid ${color}44` }}
                  >
                    {tip.icon}
                  </div>
                  <p className="font-lato text-sm leading-relaxed" style={{ color: "#6B4F57" }}>{tip.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Map Modal */}
      <AnimatePresence>
        {modalCard !== null && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setModalCard(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(39,13,22,0.55)", backdropFilter: "blur(5px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl flex flex-col"
              style={{ maxHeight: "88vh" }}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #EAB5BC55" }}>
                <div>
                  <p className="font-lato text-xs uppercase tracking-[0.2em] text-[--color-dusty-rose]">
                    {locationCards[modalCard].label}
                  </p>
                  <h3 className="font-cormorant text-xl font-semibold text-[--color-foreground]">
                    {locationCards[modalCard].title}
                  </h3>
                </div>
                <button
                  onClick={() => setModalCard(null)}
                  aria-label="Cerrar"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors text-[--color-dusty-rose] hover:bg-[--color-cream]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Map */}
              <div className="flex-1" style={{ minHeight: "340px" }}>
                <iframe
                  src={locationCards[modalCard].mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: "block", minHeight: "340px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={locationCards[modalCard].title}
                />
              </div>

              {/* Modal footer */}
              <div
                className="px-6 py-4 flex items-center justify-between gap-4"
                style={{ borderTop: "1px solid #EAB5BC55" }}
              >
                <p className="font-lato text-xs text-gray-400 italic truncate">
                  {locationCards[modalCard].sub}
                </p>
                <a
                  href={locationCards[modalCard].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 text-[--color-wine] font-lato text-sm font-semibold hover:text-[--color-dusty-rose] transition-colors"
                >
                  {locationCards[modalCard].linkText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
