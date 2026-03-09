"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const locationCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    label: "Ceremonia",
    title: "Lugar de la celebración",
    body: "Zaragoza, España\nDirección por confirmar",
    sub: "25 de julio de 2026 · 16:00h",
    link: "https://www.google.com/maps/search/Zaragoza+España",
    linkText: "Ver en Google Maps",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 10l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V12h6v9" />
      </svg>
    ),
    label: "Alojamiento",
    title: "Zonas recomendadas",
    body: "Centro histórico de Zaragoza\nBarrio El Gancho · Zona Universidades",
    sub: "Hoteles, apartamentos y pensiones para todos los bolsillos",
    link: "https://www.booking.com/city/es/zaragoza.es.html",
    linkText: "Buscar alojamiento",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
      </svg>
    ),
    label: "Cómo llegar",
    title: "Para llegar a Zaragoza",
    body: "AVE desde Madrid (~1h 20min)\nAVE desde Barcelona (~1h 30min)\nAeropuerto de Zaragoza (ZAZ)",
    sub: "Zaragoza es fácilmente accesible en tren, avión o coche",
    link: "https://www.renfe.com",
    linkText: "Reservar tren en Renfe",
  },
];

const curiosidades = [
  { icon: "🏛️", text: "Visita la Basílica del Pilar, icono de la ciudad" },
  { icon: "🥘", text: "Prueba el ternasco aragonés y las migas con chorizo" },
  { icon: "🌿", text: "Pasea por el Parque Grande José Antonio Labordeta" },
  { icon: "🛍️", text: "De compras en la calle Alfonso I y el Coso" },
  { icon: "🎡", text: "El casco histórico merece un paseo tranquilo" },
];

export default function WhenWhere() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const tipsRef = useRef<HTMLDivElement>(null);
  const tipsInView = useInView(tipsRef, { once: true, margin: "-60px" });

  return (
    <section id="cuando-donde" className="relative py-20 sm:py-28 bg-white overflow-hidden">
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
            className="font-script italic text-2xl sm:text-3xl text-[--color-dusty-rose] mb-2"
          >
            Os esperamos aquí
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-script text-4xl sm:text-5xl md:text-6xl text-[--color-wine] font-semibold"
          >
            Cuándo y Dónde
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
          {locationCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
              className="bg-[--color-cream] rounded-2xl p-6 sm:p-7 border border-[--color-blush]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-full bg-[--color-peach]/30 flex items-center justify-center text-[--color-wine]">
                {card.icon}
              </div>
              <p className="font-lato text-xs uppercase tracking-[0.2em] text-[--color-dusty-rose]">
                {card.label}
              </p>
              <h3 className="font-cormorant text-xl sm:text-2xl font-semibold text-[--color-foreground]">
                {card.title}
              </h3>
              <p className="font-lato text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                {card.body}
              </p>
              <p className="font-lato text-xs text-gray-400 italic">{card.sub}</p>
              <a
                href={card.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-1.5 text-[--color-wine] font-lato text-sm font-semibold hover:text-[--color-dusty-rose] transition-colors duration-200"
              >
                {card.linkText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="rounded-2xl overflow-hidden shadow-xl border border-[--color-blush]/40 mb-14 h-64 sm:h-80 md:h-96"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95040.44875337413!2d-0.9545849457031249!3d41.64882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5914dd5e548b6f%3A0x6c6b6b9c8b2f7e3a!2sZaragoza%2C%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1700000000000!5m2!1ses!2ses"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de la boda en Zaragoza"
          />
        </motion.div>

        {/* Tips Zaragoza */}
        <div ref={tipsRef} className="text-center">
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            animate={tipsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-script text-3xl sm:text-4xl text-[--color-wine] mb-6"
          >
            Qué hacer en Zaragoza
          </motion.h3>
          <div className="flex flex-wrap justify-center gap-3">
            {curiosidades.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={tipsInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[--color-cream] rounded-full px-5 py-2.5 border border-[--color-blush] flex items-center gap-2 text-sm font-lato text-gray-600 hover:bg-[--color-blush]/30 transition-colors duration-200"
              >
                <span className="text-lg">{tip.icon}</span>
                {tip.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
