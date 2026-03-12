"use client";

import { useState, useRef, FormEvent } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";

// EmailJS config — add these to .env.local:
// NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
// NEXT_PUBLIC_EMAILJS_TEMPLATE_GUEST_ID=your_template_guest_id
// NEXT_PUBLIC_EMAILJS_TEMPLATE_COUPLE_ID=your_template_couple_id
// NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const TEMPLATE_GUEST_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_GUEST_ID ?? "";
const TEMPLATE_COUPLE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_COUPLE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

interface FormState {
  name: string;
  email: string;
  song: string;
  message: string;
  attending: "yes" | "no" | "";
}

const initialState: FormState = {
  name: "",
  email: "",
  song: "",
  message: "",
  attending: "",
};

type Status = "idle" | "loading" | "success" | "error";

export default function RSVPForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.attending) {
      setErrorMsg(t("rsvp.errorAttending"));
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const templateParams = {
      guest_name: form.name,
      guest_email: form.email,
      attending: form.attending === "yes" ? "Sí, asistiré 🥂" : "No podré asistir",
      song: form.song || "—",
      message: form.message || "—",
    };

    try {
      // Check if EmailJS is configured
      if (!SERVICE_ID || !TEMPLATE_GUEST_ID || !TEMPLATE_COUPLE_ID || !PUBLIC_KEY ||
          SERVICE_ID === "your_service_id_here") {
        throw new Error("EmailJS not configured");
      }
      // Send email to guest
      await emailjs.send(SERVICE_ID, TEMPLATE_GUEST_ID, templateParams, PUBLIC_KEY);
      // Send notification to couple
      await emailjs.send(SERVICE_ID, TEMPLATE_COUPLE_ID, templateParams, PUBLIC_KEY);
      setStatus("success");
      setForm(initialState);
    } catch (err: unknown) {
      const isConfig = err instanceof Error && err.message === "EmailJS not configured";
      console.error("EmailJS error:", err);
      setStatus("error");
      setErrorMsg(
        isConfig
          ? t("rsvp.errorGeneral")
          : t("rsvp.errorGeneral")
      );
    }
  }

  return (
    <section
      id="rsvp"
      className="relative py-20 sm:py-28 bg-[--color-cream] overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[--color-blush]/30 blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[--color-peach]/20 blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <div ref={sectionRef} className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-script italic text-2xl sm:text-3xl text-[--color-dusty-rose] mb-2"
          >
            {t("rsvp.subtitle")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-script text-4xl sm:text-5xl md:text-6xl text-[--color-wine] font-semibold"
          >
            {t("rsvp.title")}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-4 h-px w-24 bg-[--color-peach] mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 font-lato text-sm text-gray-500"
          >
            {t("rsvp.deadlinePre")} <strong>{t("rsvp.deadlineDate")}</strong>
          </motion.p>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 px-8 bg-white rounded-3xl shadow-lg border border-[--color-blush]/40"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[--color-peach]/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-[--color-wine]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-script text-4xl text-[--color-wine] mb-3">{t("rsvp.successTitle")}</h3>
              <p className="font-lato text-gray-600 leading-relaxed">
                {t("rsvp.successText")}
                <br />
                <span className="font-semibold text-[--color-dusty-rose]">{t("rsvp.successSub")}</span>
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-8 font-lato text-sm text-[--color-dusty-rose] underline underline-offset-4"
              >
                {t("rsvp.sendAnother")}
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              ref={formRef}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-white rounded-3xl shadow-lg border border-[--color-blush]/40 p-7 sm:p-10 flex flex-col gap-5"
            >
              {/* Attendance toggle */}
              <div>
                <p className="font-lato text-sm font-semibold text-gray-700 mb-3">
                  {t("rsvp.attending")} <span className="text-[--color-wine]">*</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "yes", label: t("rsvp.yes") },
                    { value: "no", label: t("rsvp.no") },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, attending: opt.value as "yes" | "no" }))}
                      className="py-3 px-4 rounded-xl border-2 text-sm font-lato font-semibold transition-all duration-200"
                      style={{
                        borderColor: form.attending === opt.value ? "#8B3A52" : "#F4D6C7",
                        background: form.attending === opt.value ? "#8B3A52" : "white",
                        color: form.attending === opt.value ? "white" : "#6b7280",
                        transform: form.attending === opt.value ? "scale(1.02)" : "scale(1)",
                        boxShadow: form.attending === opt.value ? "0 4px 12px rgba(139,58,82,0.3)" : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (form.attending !== opt.value) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8A898";
                          (e.currentTarget as HTMLButtonElement).style.background = "#FBF5EF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (form.attending !== opt.value) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#F4D6C7";
                          (e.currentTarget as HTMLButtonElement).style.background = "white";
                        }
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-lato text-sm font-semibold text-gray-700 mb-1.5" htmlFor="name">
                  {t("rsvp.name")} <span className="text-[--color-wine]">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("rsvp.namePlaceholder")}
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-xl border border-[--color-blush] bg-[--color-cream] font-lato text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[--color-peach] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-lato text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                  {t("rsvp.email")} <span className="text-[--color-wine]">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className="w-full px-4 py-3 rounded-xl border border-[--color-blush] bg-[--color-cream] font-lato text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[--color-peach] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Song */}
              <div>
                <label className="block font-lato text-sm font-semibold text-gray-700 mb-1.5" htmlFor="song">
                  {t("rsvp.songLabel")}
                </label>
                <input
                  id="song"
                  name="song"
                  type="text"
                  value={form.song}
                  onChange={handleChange}
                  placeholder={t("rsvp.songPlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-[--color-blush] bg-[--color-cream] font-lato text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[--color-peach] focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-lato text-sm font-semibold text-gray-700 mb-1.5" htmlFor="message">
                  {t("rsvp.messageLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t("rsvp.messagePlaceholder")}
                  className="w-full px-4 py-3 rounded-xl border border-[--color-blush] bg-[--color-cream] font-lato text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[--color-peach] focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Error */}
              {errorMsg && (
                <p className="font-lato text-sm text-red-500 text-center">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-xl font-lato font-semibold text-sm tracking-widest uppercase transition-all duration-300 shadow-md active:scale-[0.98] disabled:cursor-not-allowed"
                style={{ background: "#8B3A52", color: "white" }}
                onMouseEnter={(e) => {
                  if (status !== "loading") (e.currentTarget as HTMLButtonElement).style.background = "#C4849A";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#8B3A52";
                }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("rsvp.submitting")}
                  </span>
                ) : (
                  t("rsvp.submit")
                )}
              </button>

              <p className="text-center font-lato text-xs text-gray-400">
                {t("rsvp.successText")}
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
