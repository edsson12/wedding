"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import ScrollBouquets from "@/components/ScrollBouquets";

interface EventCard {
  time: string;
  emoji: string;
  accent: string;
  bg: string;
  eventKey: string;
  title: string;
  description: string;
}

const EVENT_META = [
  { time: "16:00 h", emoji: "💍", accent: "#9B6B7E", bg: "from-[#9B6B7E] to-[#b5808e]", eventKey: "ceremony" },
  { time: "20:00 h", emoji: "🥂", accent: "#C98FA0", bg: "from-[#C98FA0] to-[#d9a8b8]", eventKey: "cocktail" },
  { time: "21:00 h", emoji: "🍽️", accent: "#D4A0AE", bg: "from-[#D4A0AE] to-[#e4b8c4]", eventKey: "dinner" },
  { time: "23:00 h", emoji: "🎉", accent: "#B07888", bg: "from-[#B07888] to-[#c4909c]", eventKey: "party" },
];

function DesktopCard({
  event,
  index,
  isLeft,
  inView,
}: {
  event: EventCard;
  index: number;
  isLeft: boolean;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-400"
      style={{ border: `1px solid ${event.accent}30` }}
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${event.bg}`} />

      <div className={`p-6 sm:p-7 ${isLeft ? "text-right" : "text-left"}`}>
        {/* Time badge */}
        <div className={`flex ${isLeft ? "justify-end" : "justify-start"} mb-4`}>
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-lato text-xs font-bold tracking-widest uppercase shadow-sm"
            style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}cc)` }}
          >
            <span>{event.emoji}</span>
            {event.time}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-script text-2xl sm:text-3xl font-semibold mb-2" style={{ color: event.accent }}>
          {event.title}
        </h3>

        {/* Description */}
        <p className="font-lato text-sm text-gray-500 leading-relaxed">
          {event.description}
        </p>
      </div>

      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{ background: `radial-gradient(circle at ${isLeft ? "80%" : "20%"} 50%, ${event.accent}08, transparent 70%)` }} />
    </motion.div>
  );
}

function TimelineItem({
  event,
  index,
  isLast,
}: {
  event: EventCard;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative flex items-start w-full">
      {/* Left card */}
      <div className="flex-1 pr-8">
        {isLeft ? (
          <DesktopCard event={event} index={index} isLeft={true} inView={inView} />
        ) : (
          <div aria-hidden />
        )}
      </div>

      {/* Center: dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: "spring", stiffness: 200 }}
          className="w-14 h-14 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10 text-2xl"
          style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}bb)` }}
        >
          {event.emoji}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
            style={{ transformOrigin: "top", background: `linear-gradient(to bottom, ${event.accent}, ${EVENT_META[index + 1]?.accent ?? event.accent}44)` }}
            className="w-0.5 h-24"
          />
        )}
      </div>

      {/* Right card */}
      <div className="flex-1 pl-8">
        {!isLeft ? (
          <DesktopCard event={event} index={index} isLeft={false} inView={inView} />
        ) : (
          <div aria-hidden />
        )}
      </div>
    </div>
  );
}

function MobileTimelineItem({
  event,
  index,
  isLast,
}: {
  event: EventCard;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="flex gap-4">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 200 }}
          className="w-12 h-12 rounded-full border-[3px] border-white shadow-md flex items-center justify-center z-10 text-xl"
          style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}bb)` }}
        >
          {event.emoji}
        </motion.div>
        {!isLast && (
          <div
            className="w-0.5 flex-1 min-h-8 mt-1"
            style={{ background: `linear-gradient(to bottom, ${event.accent}88, ${EVENT_META[index + 1]?.accent ?? event.accent}33)` }}
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.1 }}
        className={`bg-white rounded-2xl overflow-hidden shadow-md flex-1 ${!isLast ? "mb-5" : ""}`}
        style={{ border: `1px solid ${event.accent}30` }}
      >
        {/* Top bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${event.bg}`} />
        <div className="p-4">
          {/* Time badge */}
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-lato text-[10px] font-bold tracking-wider uppercase mb-2 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${event.accent}, ${event.accent}cc)` }}
          >
            {event.time}
          </span>
          <h3 className="font-script text-xl font-semibold mb-1" style={{ color: event.accent }}>
            {event.title}
          </h3>
          <p className="font-lato text-xs text-gray-500 leading-relaxed">{event.description}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Timeline() {
  const { t } = useTranslation();
  const events: EventCard[] = EVENT_META.map((m) => ({
    ...m,
    title: t(`timeline.events.${m.eventKey}.title`),
    description: t(`timeline.events.${m.eventKey}.description`),
  }));
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-80px" });

  return (
    <motion.section id="timeline" className="relative min-h-full py-20 sm:py-28 bg-[#FBF0EE]" style={{ minHeight: '100vh' }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: 0.8 }}>
      <ScrollBouquets delay={0.2} set={1} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #F5D5DA, transparent)" }} />

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-xl sm:text-2xl text-[#C98FA0] mb-2 italic"
          >
            {t("timeline.subtitle")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-script text-4xl sm:text-5xl md:text-6xl text-[#9B6B7E] font-semibold"
          >
            {t("timeline.title")}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 h-px w-24 bg-[#EAB5BC] mx-auto"
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:flex flex-col items-center gap-0">
          {events.map((event, i) => (
            <TimelineItem key={i} event={event} index={i} isLast={i === events.length - 1} />
          ))}
        </div>

        {/* Mobile */}
        <div className="flex md:hidden flex-col">
          {events.map((event, i) => (
            <MobileTimelineItem key={i} event={event} index={i} isLast={i === events.length - 1} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
