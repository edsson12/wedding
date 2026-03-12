"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import ScrollBouquets from "@/components/ScrollBouquets";

const WEDDING_DATE = new Date("2026-07-25T16:00:00");

function pad(n: number) {
  return String(n).padStart(2, "0");
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CounterUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[68px] h-[68px] sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-[#F5D5DA]">
        <motion.span
          key={value}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="font-montserrat text-3xl sm:text-4xl md:text-5xl text-[#9B6B7E] font-semibold"
        >
          {pad(value)}
        </motion.span>
      </div>
      <span className="mt-2 text-[9px] sm:text-xs uppercase tracking-[0.12em] text-[#C98FA0] font-lato font-light">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const { t } = useTranslation();
  const [time, setTime] = useState<TimeLeft | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    setTime(getTimeLeft());
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      id="countdown"
      className="relative h-full flex flex-col justify-center py-20 sm:py-28 bg-[--color-cream] overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8 }}
    >
      <ScrollBouquets delay={0.3} set={0} />
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-[--color-blush]/30 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[--color-peach]/20 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-8 text-center relative z-10">
        {/* 1. Faltan solo... */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-script italic text-2xl sm:text-3xl text-[#C98FA0] mb-8"
        >
          {t("countdown.soon")}
        </motion.p>

        {/* 2. Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-start justify-center gap-2 sm:gap-5 mb-8"
        >
          <CounterUnit value={time?.days ?? 0} label={t("countdown.days")} />
          <span className="text-3xl sm:text-5xl text-[#EAB5BC] mt-3 sm:mt-4">:</span>
          <CounterUnit value={time?.hours ?? 0} label={t("countdown.hours")} />
          <span className="text-3xl sm:text-5xl text-[#EAB5BC] mt-3 sm:mt-4">:</span>
          <CounterUnit value={time?.minutes ?? 0} label={t("countdown.minutes")} />
          <span className="text-3xl sm:text-5xl text-[#EAB5BC] mt-3 sm:mt-4">:</span>
          <CounterUnit value={time?.seconds ?? 0} label={t("countdown.seconds")} />
        </motion.div>

        {/* 3. Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-script text-3xl sm:text-4xl md:text-5xl text-[#9B6B7E] mb-4 font-semibold"
        >
          {t("countdown.title")}
        </motion.h2>

        {/* 4. Date line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="font-lato text-xs sm:text-sm tracking-widest uppercase text-[#C98FA0]/80"
        >
          {t("countdown.date")}
        </motion.p>
      </div>
    </motion.section>
  );
}
