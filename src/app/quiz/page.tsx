"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuizQuestion {
  _id: string;
  text: { es: string; en: string; fr: string };
  options: Array<{ es: string; en: string; fr: string }>;
  order: number;
}

interface RankingEntry {
  position: number;
  name: string;
  email: string;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
}

type Step = "identify" | "quiz" | "result";

// ─── Medal helper ─────────────────────────────────────────────────────────────

function Medal({ pos }: { pos: number }) {
  if (pos === 1) return <span className="text-2xl">🥇</span>;
  if (pos === 2) return <span className="text-2xl">🥈</span>;
  if (pos === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span
      className="font-lato text-sm font-bold"
      style={{ color: "#9B6B7E", minWidth: "28px", display: "inline-block", textAlign: "center" }}
    >
      {pos}
    </span>
  );
}

// ─── Ranking Section ──────────────────────────────────────────────────────────

function RankingSection({
  refreshTrigger,
  lang,
}: {
  refreshTrigger: number;
  lang: string;
}) {
  const { t } = useTranslation();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quiz/ranking")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) { setRanking(Array.isArray(data) ? data : []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setRanking([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [refreshTrigger]);

  const pct = (score: number, total: number) =>
    total > 0 ? Math.round((score / total) * 100) : 0;

  // Determine locale key for display
  const localeKey = lang.startsWith("fr") ? "fr" : lang.startsWith("es") ? "es" : "en";
  void localeKey; // used indirectly via t()

  return (
    <section
      id="ranking"
      className="py-16 px-6"
      style={{ background: "linear-gradient(160deg, #FBF0EE 0%, #F5D5DA 100%)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="font-lato text-xs tracking-[0.25em] uppercase mb-2"
            style={{ color: "#C98FA0" }}
          >
            Vale &amp; Edu · 25·07·2026
          </p>
          <h2
            className="font-script text-4xl sm:text-5xl mb-2"
            style={{ color: "#6B2A3F" }}
          >
            {t("quiz.ranking.title")}
          </h2>
          <p className="font-lato text-sm" style={{ color: "#9B6B7E", fontWeight: 300 }}>
            {t("quiz.ranking.subtitle")}
          </p>
        </div>

        {loading ? (
          <p className="text-center font-lato text-sm" style={{ color: "#C98FA0" }}>
            {t("quiz.ranking.loading")}
          </p>
        ) : ranking.length === 0 ? (
          <p className="text-center font-lato text-base" style={{ color: "#9B6B7E" }}>
            {t("quiz.ranking.empty")}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {ranking.map((entry, i) => {
              const percent = pct(entry.bestScore, entry.totalQuestions);
              const isTop3 = entry.position <= 3;
              return (
                <motion.div
                  key={entry.email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4"
                  style={{
                    background: isTop3
                      ? "linear-gradient(135deg, #fff 0%, #FBF0EE 100%)"
                      : "#fff",
                    border: isTop3 ? "1px solid #EAB5BC" : "1px solid #F0E0E4",
                    boxShadow: isTop3
                      ? "0 4px 20px rgba(139,58,82,0.10)"
                      : "0 1px 6px rgba(139,58,82,0.05)",
                  }}
                >
                  {/* Medal / Position */}
                  <div className="shrink-0 w-8 flex justify-center">
                    <Medal pos={entry.position} />
                  </div>

                  {/* Name + email */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-lato font-semibold text-sm truncate"
                      style={{ color: "#4a2030" }}
                    >
                      {entry.name}
                    </p>
                    <p
                      className="font-lato text-xs truncate"
                      style={{ color: "#C98FA0", fontWeight: 300 }}
                    >
                      {entry.email}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <p
                      className="font-lato font-bold text-base"
                      style={{ color: "#6B2A3F" }}
                    >
                      {entry.bestScore}/{entry.totalQuestions}
                    </p>
                    {/* Progress bar */}
                    <div
                      className="w-20 h-1.5 rounded-full mt-1 overflow-hidden"
                      style={{ background: "#F5D5DA" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${percent}%`,
                          background:
                            percent === 100
                              ? "#8FAE9C"
                              : percent >= 75
                              ? "#C98FA0"
                              : percent >= 50
                              ? "#D4A0AE"
                              : "#EAB5BC",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language ?? "es";
  const localeKey = lang.startsWith("fr") ? "fr" : lang.startsWith("es") ? "es" : "en";

  // ── Identity state ──
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<Step>("identify");
  const [identifyError, setIdentifyError] = useState("");
  const [checking, setChecking] = useState(false);

  // Previous attempt info (from GET /api/quiz/submit?email=xxx)
  const [prevAttempts, setPrevAttempts] = useState(0);
  const [prevBest, setPrevBest] = useState<number | null>(null);
  const [prevTotal, setPrevTotal] = useState<number>(0);
  const [checkedEmail, setCheckedEmail] = useState("");

  // ── Quiz state ──
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Result state ──
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [attempt, setAttempt] = useState(1);
  const [bestScore, setBestScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(0);
  const [submitError, setSubmitError] = useState("");

  // ── Ranking refresh trigger ──
  const [rankingRefresh, setRankingRefresh] = useState(0);

  const rankingRef = useRef<HTMLDivElement>(null);

  // Check previous attempts when email field is blurred
  async function checkEmail(em: string) {
    if (!em || !em.includes("@")) return;
    if (em === checkedEmail) return;
    setCheckedEmail(em);
    setIdentifyError("");
    try {
      const res = await fetch(
        `/api/quiz/submit?email=${encodeURIComponent(em.toLowerCase().trim())}`
      );
      if (!res.ok) {
        const data = await res.json();
        if (data.error === "notInvited") {
          setIdentifyError(t("quiz.errors.notInvited"));
        } else if (data.error === "notResponded") {
          setIdentifyError(t("quiz.errors.notResponded"));
        }
        return;
      }
      const data = await res.json();
      setPrevAttempts(data.attempts ?? 0);
      setPrevBest(data.bestScore ?? null);
      setPrevTotal(data.totalQuestions ?? 0);
      if (data.name) setName(data.name);
    } catch {
      // silently ignore network errors
    }
  }

  async function handleIdentify(e: FormEvent) {
    e.preventDefault();
    setIdentifyError("");

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setIdentifyError(t("quiz.errors.generic"));
      return;
    }
    if (!cleanName) {
      setIdentifyError(t("quiz.errors.generic"));
      return;
    }

    setChecking(true);
    try {
      // Fetch questions
      const qRes = await fetch("/api/quiz/questions");
      if (!qRes.ok) {
        setIdentifyError(t("quiz.errors.noQuestions"));
        return;
      }
      const qs: QuizQuestion[] = await qRes.json();
      if (qs.length === 0) {
        setIdentifyError(t("quiz.errors.noQuestions"));
        return;
      }

      // Re-check current attempt count (also validates invitation)
      const statusRes = await fetch(
        `/api/quiz/submit?email=${encodeURIComponent(cleanEmail)}`
      );
      if (!statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.error === "notInvited") {
          setIdentifyError(t("quiz.errors.notInvited"));
        } else if (statusData.error === "notResponded") {
          setIdentifyError(t("quiz.errors.notResponded"));
        } else {
          setIdentifyError(t("quiz.errors.generic"));
        }
        return;
      }
      const statusData = await statusRes.json();
      const left = 2 - (statusData.attempts ?? 0);
      if (left <= 0) {
        setPrevAttempts(statusData.attempts ?? 2);
        setPrevBest(statusData.bestScore ?? null);
        setPrevTotal(statusData.totalQuestions ?? 0);
        setIdentifyError(t("quiz.identify.noAttempts", { max: 2 }));
        return;
      }

      setQuestions(qs);
      setAnswers([]);
      setCurrent(0);
      setSelected(null);
      setStep("quiz");
    } catch {
      setIdentifyError(t("quiz.errors.generic"));
    } finally {
      setChecking(false);
    }
  }

  function handleSelect(optionIdx: number) {
    if (selected !== null) return; // already answered
    setSelected(optionIdx);

    setTimeout(() => {
      const newAnswers = [...answers, optionIdx];
      if (current + 1 < questions.length) {
        setAnswers(newAnswers);
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        // Submit
        submitQuiz(newAnswers);
      }
    }, 700);
  }

  async function submitQuiz(finalAnswers: number[]) {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          name: name.trim(),
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? t("quiz.errors.generic"));
        setStep("identify");
        return;
      }
      setScore(data.score);
      setTotalQuestions(data.totalQuestions);
      setAttempt(data.attempt);
      setBestScore(data.bestScore);
      setAttemptsLeft(data.attemptsLeft ?? 0);
      setPrevAttempts(data.attempt);
      setPrevBest(data.bestScore);
      setPrevTotal(data.totalQuestions);
      setRankingRefresh((n) => n + 1);
      setStep("result");
    } catch {
      setSubmitError(t("quiz.errors.generic"));
      setStep("identify");
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetry() {
    setStep("identify");
    setIdentifyError("");
    setSelected(null);
    setSubmitError("");
  }

  function scrollToRanking() {
    rankingRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Result message based on percentage
  function resultMessage(sc: number, total: number) {
    const pct = total > 0 ? sc / total : 0;
    if (pct >= 0.9) return t("quiz.result.perfect");
    if (pct >= 0.7) return t("quiz.result.great");
    if (pct >= 0.5) return t("quiz.result.good");
    return t("quiz.result.low");
  }

  // ── Shared card wrapper ──────────────────────────────────────────────────────

  const wine = "#6B2A3F";
  const blush = "#C98FA0";
  const cream = "#FBF5EF";

  return (
    <div style={{ minHeight: "100vh", background: cream }}>
      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(251,245,239,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201,143,160,0.2)",
        }}
      >
        <Link
          href="/"
          className="font-lato text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-70"
          style={{ color: blush }}
        >
          ← Vale &amp; Edu
        </Link>
        <p className="font-script text-2xl italic" style={{ color: wine }}>
          Quiz
        </p>
        <div style={{ width: "80px" }} />
      </header>

      {/* ── Hero strip ───────────────────────────────────────────────────── */}
      <div
        className="py-12 px-6 text-center"
        style={{
          background: "linear-gradient(160deg, #2D1B2E 0%, #6B2A3F 50%, #9B3F5F 100%)",
        }}
      >
        <p
          className="font-lato text-xs tracking-[0.3em] uppercase mb-3"
          style={{ color: "#EAB5BC" }}
        >
          {t("quiz.pageSubtitle")}
        </p>
        <h1
          className="font-script text-5xl sm:text-6xl italic font-light"
          style={{ color: "#fff" }}
        >
          {t("quiz.pageTitle")}
        </h1>
      </div>

      {/* ── Steps ────────────────────────────────────────────────────────── */}
      <div className="max-w-lg mx-auto px-6 py-12">
        <AnimatePresence mode="wait">

          {/* ── STEP: IDENTIFY ──────────────────────────────────────────── */}
          {step === "identify" && (
            <motion.div
              key="identify"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
            >
              <div
                className="rounded-3xl p-8 shadow-lg"
                style={{ background: "#fff", border: "1px solid rgba(201,143,160,0.25)" }}
              >
                {/* Icon */}
                <div className="text-center mb-6">
                  <span className="text-5xl">💌</span>
                  <h2
                    className="font-script text-3xl mt-3"
                    style={{ color: wine }}
                  >
                    {t("quiz.identify.title")}
                  </h2>
                  <p
                    className="font-lato text-sm mt-1"
                    style={{ color: blush, fontWeight: 300 }}
                  >
                    {t("quiz.identify.subtitle")}
                  </p>
                </div>

                {/* Previous attempts info */}
                {prevAttempts > 0 && prevBest !== null && (
                  <div
                    className="rounded-xl px-4 py-3 mb-5 text-center"
                    style={{ background: "#FBF0EE", border: "1px solid #EAB5BC" }}
                  >
                    <p className="font-lato text-sm" style={{ color: wine, fontWeight: 600 }}>
                      {t("quiz.identify.bestScore", {
                        score: prevBest,
                        total: prevTotal,
                      })}
                    </p>
                    {prevAttempts < 2 ? (
                      <p className="font-lato text-xs mt-0.5" style={{ color: blush }}>
                        {t("quiz.identify.attemptsLeft_other", {
                          count: 2 - prevAttempts,
                        })}
                      </p>
                    ) : (
                      <p className="font-lato text-xs mt-0.5" style={{ color: wine }}>
                        {t("quiz.identify.noAttempts", { max: 2 })}
                      </p>
                    )}
                  </div>
                )}

                {/* Error message */}
                {(identifyError || submitError) && (
                  <div
                    className="rounded-xl px-4 py-3 mb-5 text-center"
                    style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
                  >
                    <p className="font-lato text-sm text-red-700">
                      {identifyError || submitError}
                    </p>
                  </div>
                )}

                {/* Form — show if still has attempts */}
                {prevAttempts < 2 ? (
                  <form onSubmit={handleIdentify} className="flex flex-col gap-4">
                    {/* Email */}
                    <div>
                      <label
                        className="font-lato text-xs tracking-widest uppercase block mb-1.5"
                        style={{ color: blush }}
                      >
                        {t("quiz.identify.emailLabel")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => { e.target.style.borderColor = "#EAB5BC"; checkEmail(e.target.value); }}
                        placeholder={t("quiz.identify.emailPlaceholder")}
                        required
                        className="w-full rounded-xl px-4 py-3 font-lato text-sm outline-none transition-all"
                        style={{
                          border: "1.5px solid #EAB5BC",
                          background: "#FBF5EF",
                          color: "#2D1B2E",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = wine)}
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label
                        className="font-lato text-xs tracking-widest uppercase block mb-1.5"
                        style={{ color: blush }}
                      >
                        {t("quiz.identify.nameLabel")}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("quiz.identify.namePlaceholder")}
                        required
                        className="w-full rounded-xl px-4 py-3 font-lato text-sm outline-none transition-all"
                        style={{
                          border: "1.5px solid #EAB5BC",
                          background: "#FBF5EF",
                          color: "#2D1B2E",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = wine)}
                        onBlur={(e) => (e.target.style.borderColor = "#EAB5BC")}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={checking}
                      className="w-full rounded-full py-3.5 font-lato text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
                      style={{
                        background: `linear-gradient(135deg, ${wine}, ${blush})`,
                        color: "#fff",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {checking ? t("quiz.identify.checking") : t("quiz.identify.start")}
                    </button>
                  </form>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={scrollToRanking}
                      className="font-lato text-sm underline underline-offset-4"
                      style={{ color: blush }}
                    >
                      {t("quiz.identify.rankingButton")}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── STEP: QUIZ ──────────────────────────────────────────────── */}
          {step === "quiz" && !submitting && questions.length > 0 && (
            <motion.div
              key={`quiz-${current}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
            >
              <div
                className="rounded-3xl p-8 shadow-lg"
                style={{ background: "#fff", border: "1px solid rgba(201,143,160,0.25)" }}
              >
                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-lato text-xs" style={{ color: blush }}>
                      {t("quiz.quiz.progress", {
                        current: current + 1,
                        total: questions.length,
                      })}
                    </p>
                    <p className="font-lato text-xs" style={{ color: "#C4849A" }}>
                      {Math.round(((current) / questions.length) * 100)}%
                    </p>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ background: "#F5D5DA" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${wine}, ${blush})`,
                      }}
                      initial={{ width: `${(current / questions.length) * 100}%` }}
                      animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Question text */}
                <h2
                  className="font-cormorant text-xl sm:text-2xl font-semibold mb-6 leading-snug"
                  style={{ color: wine }}
                >
                  {questions[current].text[localeKey]}
                </h2>

                {/* Options */}
                <div className="flex flex-col gap-3">
                  {questions[current].options.map((opt, i) => {
                    const isSelected = selected === i;
                    return (
                      <motion.button
                        key={i}
                        whileHover={selected === null ? { scale: 1.01 } : {}}
                        whileTap={selected === null ? { scale: 0.99 } : {}}
                        onClick={() => handleSelect(i)}
                        disabled={selected !== null}
                        className="w-full text-left rounded-xl px-5 py-4 font-lato text-sm transition-all duration-200"
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${wine}15, ${blush}25)`
                            : "#FBF5EF",
                          border: isSelected
                            ? `2px solid ${blush}`
                            : "2px solid transparent",
                          color: isSelected ? wine : "#5a3040",
                          boxShadow: isSelected
                            ? `0 0 0 3px ${blush}22`
                            : "none",
                          cursor: selected !== null ? "default" : "pointer",
                          outline: "1px solid rgba(201,143,160,0.2)",
                        }}
                      >
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 shrink-0"
                          style={{
                            background: isSelected ? blush : "rgba(201,143,160,0.2)",
                            color: isSelected ? "#fff" : wine,
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt[localeKey]}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Submitting overlay ──────────────────────────────────────── */}
          {step === "quiz" && submitting && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4 animate-pulse">💍</div>
              <p className="font-lato text-sm" style={{ color: blush }}>
                {t("quiz.quiz.submitting")}
              </p>
            </motion.div>
          )}

          {/* ── STEP: RESULT ─────────────────────────────────────────────── */}
          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 180 }}
            >
              <div
                className="rounded-3xl p-8 shadow-xl text-center"
                style={{
                  background: `linear-gradient(160deg, ${wine} 0%, #9B3F5F 100%)`,
                  border: "1px solid rgba(234,181,188,0.2)",
                }}
              >
                {/* Score ring */}
                <div className="relative inline-flex items-center justify-center mb-5">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <motion.circle
                      cx="60" cy="60" r="52" fill="none"
                      stroke="#EAB5BC" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                      animate={{
                        strokeDashoffset:
                          2 * Math.PI * 52 * (1 - score / totalQuestions),
                      }}
                      transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="font-lato font-bold text-2xl" style={{ color: "#fff" }}>
                      {score}/{totalQuestions}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-script text-4xl italic mb-1" style={{ color: "#fff" }}>
                  {t("quiz.result.title")}
                </h2>
                <p className="font-lato text-sm mb-4" style={{ color: "rgba(234,181,188,0.9)" }}>
                  {t("quiz.result.score", { score, total: totalQuestions })}
                </p>

                {/* Message */}
                <div
                  className="rounded-2xl px-5 py-4 mb-6"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <p className="font-lato text-base leading-relaxed" style={{ color: "#fff" }}>
                    {resultMessage(score, totalQuestions)}
                  </p>
                </div>

                {/* Best score */}
                {attempt > 1 && (
                  <p className="font-lato text-xs mb-5" style={{ color: "rgba(234,181,188,0.75)" }}>
                    {t("quiz.result.bestScore", { score: bestScore, total: totalQuestions })}
                  </p>
                )}

                {/* Attempts left */}
                <p className="font-lato text-xs mb-6" style={{ color: "rgba(234,181,188,0.7)" }}>
                  {attemptsLeft > 0
                    ? t("quiz.result.attemptsLeft", { count: attemptsLeft })
                    : t("quiz.result.noAttempts")}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={scrollToRanking}
                    className="w-full rounded-full py-3.5 font-lato text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:opacity-90"
                    style={{
                      background: "#EAB5BC",
                      color: wine,
                      letterSpacing: "0.1em",
                    }}
                  >
                    {t("quiz.result.rankingButton")}
                  </button>
                  {attemptsLeft > 0 && (
                    <button
                      onClick={handleRetry}
                      className="w-full rounded-full py-3 font-lato text-sm tracking-widest uppercase border transition-all duration-300 hover:bg-white/10"
                      style={{
                        borderColor: "rgba(234,181,188,0.4)",
                        color: "rgba(234,181,188,0.9)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {t("quiz.result.retryButton")}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Ranking ──────────────────────────────────────────────────────── */}
      <div ref={rankingRef}>
        <RankingSection refreshTrigger={rankingRefresh} lang={lang} />
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div
        className="py-8 text-center"
        style={{ background: "#2D1B2E" }}
      >
        <p className="font-script text-3xl italic mb-1" style={{ color: "rgba(234,181,188,0.7)" }}>
          Vale &amp; Edu
        </p>
        <p
          className="font-lato text-xs tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          25 · 07 · 2026 · Zaragoza
        </p>
      </div>
    </div>
  );
}
