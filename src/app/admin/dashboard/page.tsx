"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";

// ── Quiz types ──────────────────────────────────────────────────────────────

interface QuizQuestion {
  _id: string;
  text: { es: string; en: string; fr: string };
  options: Array<{ es: string; en: string; fr: string }>;
  correctIndex: number;
  order: number;
  active: boolean;
}

interface QuizRankingEntry {
  position: number;
  name: string;
  email: string;
  bestScore: number;
  totalQuestions: number;
  attempts: number;
  completedAt: string;
}

const EMPTY_OPTION = { es: "", en: "", fr: "" };
const EMPTY_FORM = {
  text: { es: "", en: "", fr: "" },
  options: [
    { es: "", en: "", fr: "" },
    { es: "", en: "", fr: "" },
    { es: "", en: "", fr: "" },
    { es: "", en: "", fr: "" },
  ],
  correctIndex: 0,
  order: 1,
  active: true,
};

interface Invitation {
  _id: string;
  email: string;
  status: "pending" | "accepted" | "declined";
  guestName?: string;
  companions: number;
  allergy?: string;
  intolerance?: string;
  specialDiet?: string;
  song?: string;
  message?: string;
  sentAt: string;
  respondedAt?: string;
}

interface Stats {
  total: number;
  accepted: number;
  declined: number;
  pending: number;
  totalGuests: number;
}

const STATUS_LABEL: Record<string, string> = {
  accepted: "Confirmó",
  declined: "No asiste",
  pending: "Pendiente",
};

const STATUS_COLOR: Record<string, string> = {
  accepted: "#8B9D77",
  declined: "#C4849A",
  pending: "#D4AF7A",
};

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState<{ email: string; status: string; reason?: string }[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  // ── Quiz state ───────────────────────────────────────────────────────────
  const [quizSection, setQuizSection] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizRanking, setQuizRanking] = useState<QuizRankingEntry[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState(EMPTY_FORM);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [questionError, setQuestionError] = useState("");

  const fetchQuizData = useCallback(async () => {
    setLoadingQuiz(true);
    try {
      const [qRes, rRes] = await Promise.all([
        fetch("/api/quiz/questions"),
        fetch("/api/quiz/ranking"),
      ]);
      if (qRes.ok) setQuizQuestions(await qRes.json());
      if (rRes.ok) setQuizRanking(await rRes.json());
    } finally {
      setLoadingQuiz(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/invitations/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchInvitations = useCallback(async () => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/invitations?${params}`);
    if (res.ok) setInvitations(await res.json());
  }, [filter, search]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchInvitations(); }, [fetchInvitations]);
  useEffect(() => { if (quizSection) fetchQuizData(); }, [quizSection, fetchQuizData]);

  // --- Quiz CRUD ---
  function openEditForm(q: QuizQuestion) {
    setQuestionForm({
      text: { ...q.text },
      options: q.options.map((o) => ({ ...o })),
      correctIndex: q.correctIndex,
      order: q.order,
      active: q.active,
    });
    setEditingQuestion(q._id ?? null);
    setShowQuestionForm(true);
    setQuestionError("");
  }

  async function handleSaveQuestion(e: FormEvent) {
    e.preventDefault();
    setQuestionError("");
    if (!questionForm.text.es || !questionForm.text.en || !questionForm.text.fr) {
      setQuestionError("La pregunta debe tener texto en ES, EN y FR.");
      return;
    }
    if (questionForm.options.length < 2) {
      setQuestionError("Mínimo 2 opciones.");
      return;
    }
    for (const opt of questionForm.options) {
      if (!opt.es || !opt.en || !opt.fr) {
        setQuestionError("Todas las opciones deben tener texto en ES, EN y FR.");
        return;
      }
    }
    setSavingQuestion(true);
    try {
      const url = editingQuestion ? `/api/quiz/questions/${editingQuestion}` : "/api/quiz/questions";
      const method = editingQuestion ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionForm),
      });
      if (!res.ok) {
        const d = await res.json();
        setQuestionError(d.error ?? "Error al guardar.");
        return;
      }
      setShowQuestionForm(false);
      setEditingQuestion(null);
      setQuestionForm(EMPTY_FORM);
      fetchQuizData();
    } catch {
      setQuestionError("Error de conexión.");
    } finally {
      setSavingQuestion(false);
    }
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm("¿Eliminar esta pregunta del quiz? Esta acción no se puede deshacer.")) return;
    await fetch(`/api/quiz/questions/${id}`, { method: "DELETE" });
    fetchQuizData();
  }

  async function handleToggleActive(q: QuizQuestion) {
    await fetch(`/api/quiz/questions/${q._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...q, active: !q.active }),
    });
    fetchQuizData();
  }

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleSendInvitations(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendResults([]);
    const emails = emailInput.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });
      const data = await res.json();
      setSendResults(data.results ?? []);
      setEmailInput("");
      fetchStats();
      fetchInvitations();
    } catch {
      setSendResults([{ email: "—", status: "error", reason: "Error de conexión" }]);
    } finally {
      setSending(false);
    }
  }

  const allSelected = invitations.length > 0 && invitations.every((inv) => selectedIds.has(inv._id));

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds(allSelected ? new Set() : new Set(invitations.map((inv) => inv._id)));
  }

  async function handleDelete(ids: string[]) {
    if (!ids.length) return;
    if (!confirm(`¿Eliminar ${ids.length} invitación${ids.length !== 1 ? "es" : ""}? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      await fetch("/api/invitations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      setSelectedIds(new Set());
      fetchStats();
      fetchInvitations();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FBF5EF" }}>
      {/* Top nav */}
      <header style={{ background: "linear-gradient(135deg,#5a1e30,#8B3A52)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        <div>
          <span style={{ color: "#fff", fontSize: "22px", fontFamily: "var(--font-parisienne), cursive" }}>Vale & Edu</span>
          <span style={{ color: "#F4D6C7", fontSize: "13px", marginLeft: "12px", letterSpacing: "1px" }}>· Panel de gestión</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 18px", borderRadius: "20px", cursor: "pointer", fontSize: "13px" }}
        >
          {loggingOut ? "Saliendo..." : "Cerrar sesión"}
        </button>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 20px" }}>

        {/* Stats */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "16px", marginBottom: "36px" }}>
            {[
              { label: "Invitaciones", value: stats.total, color: "#8B3A52" },
              { label: "Confirmados", value: stats.accepted, color: "#8B9D77" },
              { label: "No asisten", value: stats.declined, color: "#C4849A" },
              { label: "Pendientes", value: stats.pending, color: "#D4AF7A" },
              { label: "Total invitados", value: stats.totalGuests, color: "#6b2a3f" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 2px 12px rgba(139,58,82,0.08)", borderTop: `4px solid ${s.color}`, textAlign: "center" }}>
                <div style={{ fontSize: "32px", fontWeight: "bold", color: s.color }}>{s.value}</div>
                <div style={{ color: "#999", fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Send invitations */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(139,58,82,0.08)", marginBottom: "32px" }}>
          <h2 style={{ color: "#8B3A52", fontSize: "18px", margin: "0 0 16px", fontFamily: "var(--font-parisienne), cursive", fontWeight: 400 }}>
            📨 Enviar invitaciones
          </h2>
          <form onSubmit={handleSendInvitations}>
            <textarea
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={"correo1@gmail.com\ncorreo2@gmail.com\ncorreo3@gmail.com"}
              rows={5}
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #F4D6C7", borderRadius: "10px", fontSize: "14px", resize: "vertical", outline: "none", boxSizing: "border-box", fontFamily: "monospace", background: "#FBF5EF", color: "#333" }}
              onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
              onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
            />
            <p style={{ color: "#999", fontSize: "12px", margin: "6px 0 16px" }}>Un email por línea, o separados por coma o punto y coma</p>
            <button
              type="submit"
              disabled={sending || !emailInput.trim()}
              style={{ background: "linear-gradient(135deg,#8B3A52,#C4849A)", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "50px", fontSize: "14px", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1 }}
            >
              {sending ? "Enviando..." : "Enviar invitaciones"}
            </button>
          </form>

          {sendResults.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ color: "#6b2a3f", fontSize: "14px", margin: "0 0 10px" }}>Resultado del envío:</h3>
              {sendResults.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #F4D6C7" }}>
                  <span style={{ fontSize: "16px" }}>{r.status === "sent" ? "✅" : r.status === "skipped" ? "⏭️" : "❌"}</span>
                  <span style={{ fontSize: "13px", color: "#333", flex: 1 }}>{r.email}</span>
                  <span style={{ fontSize: "12px", color: "#999" }}>{r.status === "sent" ? "Enviado" : r.reason ?? r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guest list */}
        <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 12px rgba(139,58,82,0.08)" }}>
          <h2 style={{ color: "#8B3A52", fontSize: "18px", margin: "0 0 20px", fontFamily: "var(--font-parisienne), cursive", fontWeight: 400 }}>
            👥 Lista de invitados
          </h2>

          {/* Filters */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: "200px", padding: "10px 16px", border: "2px solid #F4D6C7", borderRadius: "50px", fontSize: "14px", outline: "none", background: "#FBF5EF", color: "#333" }}
              onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
              onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
            />
            {["all", "accepted", "declined", "pending"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "50px",
                  border: "2px solid",
                  borderColor: filter === s ? "#8B3A52" : "#F4D6C7",
                  background: filter === s ? "#8B3A52" : "#fff",
                  color: filter === s ? "#fff" : "#8B3A52",
                  fontSize: "13px",
                  cursor: "pointer",

                }}
              >
                {s === "all" ? "Todos" : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

          {/* Select all / bulk action bar */}
          {invitations.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 4px", marginBottom: "4px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#999", userSelect: "none" }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  style={{ width: "16px", height: "16px", accentColor: "#8B3A52", cursor: "pointer" }}
                />
                {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
              </label>
              {selectedIds.size > 0 && (
                <>
                  <span style={{ color: "#8B3A52", fontSize: "13px" }}>
                    · {selectedIds.size} seleccionada{selectedIds.size !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => handleDelete([...selectedIds])}
                    disabled={deleting}
                    style={{ marginLeft: "auto", background: "#C4849A", color: "#fff", border: "none", padding: "7px 18px", borderRadius: "20px", fontSize: "13px", cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1 }}
                  >
                    {deleting ? "Eliminando..." : "🗑️ Eliminar seleccionadas"}
                  </button>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    style={{ background: "transparent", border: "none", color: "#999", fontSize: "13px", cursor: "pointer", padding: "0" }}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          )}

          {/* List */}
          {invitations.length === 0 ? (
            <p style={{ color: "#999", textAlign: "center", padding: "40px 0" }}>No hay invitaciones que mostrar</p>
          ) : (
            invitations.map((inv) => (
              <div
                key={inv._id}
                style={{ border: "1px solid #F4D6C7", borderRadius: "12px", marginBottom: "10px", overflow: "hidden" }}
              >
                <div
                  onClick={() => setExpanded(expanded === inv._id ? null : inv._id)}
                  style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", cursor: "pointer", background: expanded === inv._id ? "#FBF5EF" : "#fff" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(inv._id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(inv._id)}
                    style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#8B3A52", flexShrink: 0 }}
                  />
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: STATUS_COLOR[inv.status], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: "bold", color: "#333", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {inv.guestName ?? inv.email}
                    </div>
                    {inv.guestName && <div style={{ color: "#999", fontSize: "12px" }}>{inv.email}</div>}
                  </div>
                  <div style={{ background: STATUS_COLOR[inv.status], color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", flexShrink: 0 }}>
                    {STATUS_LABEL[inv.status]}
                  </div>
                  <span style={{ color: "#C4849A", fontSize: "18px" }}>{expanded === inv._id ? "▲" : "▼"}</span>
                </div>

                {expanded === inv._id && (
                  <div style={{ padding: "16px 20px", borderTop: "1px solid #F4D6C7", background: "#FBF5EF" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "12px" }}>
                      <Detail label="Email" value={inv.email} />
                      <Detail label="Estado" value={STATUS_LABEL[inv.status]} />
                      <Detail label="Enviado" value={new Date(inv.sentAt).toLocaleDateString("es-ES")} />
                      {inv.respondedAt && <Detail label="Respondió" value={new Date(inv.respondedAt).toLocaleDateString("es-ES")} />}
                      {inv.allergy && <Detail label="Alergias" value={`🚫 ${inv.allergy}`} />}
                      {inv.intolerance && <Detail label="Intolerancias" value={`⚠️ ${inv.intolerance}`} />}
                      {inv.specialDiet && <Detail label="Dieta especial" value={`🌿 ${inv.specialDiet}`} />}
                      {inv.song && <Detail label="Canción" value={`🎵 ${inv.song}`} />}
                      {inv.message && <Detail label="Mensaje" value={`"${inv.message}"`} fullWidth />}
                    </div>
                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => handleDelete([inv._id])}
                        disabled={deleting}
                        style={{ background: "transparent", border: "1px solid #C4849A", color: "#C4849A", padding: "7px 18px", borderRadius: "20px", fontSize: "13px", cursor: deleting ? "not-allowed" : "pointer" }}
                      >
                        🗑️ Eliminar invitación
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ===== QUIZ SECTION ===== */}
        <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 12px rgba(107,42,63,0.08)", overflow: "hidden", marginTop: "32px" }}>
          {/* Header */}
          <button
            onClick={() => setQuizSection((v) => !v)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}
          >
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#5a1e30" }}>🧠 Quiz — ¿Cuánto nos conoces?</span>
            <span style={{ fontSize: "20px", color: "#9B6B7E", transform: quizSection ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>

          {quizSection && (
            <div style={{ padding: "0 24px 28px" }}>
              {loadingQuiz ? (
                <p style={{ color: "#999", textAlign: "center", padding: "24px" }}>Cargando datos del quiz…</p>
              ) : (
                <>
                  {/* Add question button */}
                  {!showQuestionForm && (
                    <div style={{ marginBottom: "24px", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                      <button
                        onClick={() => { setEditingQuestion(null); setQuestionForm(EMPTY_FORM); setQuestionError(""); setShowQuestionForm(true); }}
                        style={{ background: "linear-gradient(135deg,#5a1e30,#8B3A52)", color: "#fff", border: "none", borderRadius: "24px", padding: "10px 22px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                      >
                        + Nueva pregunta
                      </button>
                      <span style={{ color: "#999", fontSize: "13px" }}>{quizQuestions.length} pregunta{quizQuestions.length !== 1 ? "s" : ""} en total</span>
                    </div>
                  )}

                  {/* Question form */}
                  {showQuestionForm && (
                    <form onSubmit={handleSaveQuestion} style={{ background: "#FBF5EF", borderRadius: "12px", padding: "20px", marginBottom: "28px", border: "1px solid #EAB5BC" }}>
                      <h3 style={{ margin: "0 0 16px", color: "#5a1e30", fontSize: "16px", fontWeight: 700 }}>
                        {editingQuestion ? "✏️ Editar pregunta" : "➕ Nueva pregunta"}
                      </h3>

                      {/* Question text */}
                      <fieldset style={{ border: "1px solid #EAB5BC", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
                        <legend style={{ color: "#8B3A52", fontWeight: 600, fontSize: "13px", padding: "0 6px" }}>Texto de la pregunta</legend>
                        {(["es", "en", "fr"] as const).map((lang) => (
                          <div key={lang} style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", fontSize: "12px", color: "#9B6B7E", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>{lang.toUpperCase()}</label>
                            <input
                              value={questionForm.text[lang]}
                              onChange={(e) => setQuestionForm((f) => ({ ...f, text: { ...f.text, [lang]: e.target.value } }))}
                              placeholder={`Pregunta en ${lang.toUpperCase()}`}
                              style={{ width: "100%", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 12px", fontSize: "14px", boxSizing: "border-box" }}
                            />
                          </div>
                        ))}
                      </fieldset>

                      {/* Options */}
                      <fieldset style={{ border: "1px solid #EAB5BC", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
                        <legend style={{ color: "#8B3A52", fontWeight: 600, fontSize: "13px", padding: "0 6px" }}>Opciones</legend>
                        {questionForm.options.map((opt, idx) => (
                          <div key={idx} style={{ marginBottom: "14px", background: "#fff", borderRadius: "8px", padding: "12px", border: `2px solid ${questionForm.correctIndex === idx ? "#6B2A3F" : "#eee"}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                              <span style={{ fontWeight: 700, color: "#8B3A52", minWidth: "22px" }}>{String.fromCharCode(65 + idx)}.</span>
                              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555", cursor: "pointer" }}>
                                <input
                                  type="radio"
                                  name="correctIndex"
                                  checked={questionForm.correctIndex === idx}
                                  onChange={() => setQuestionForm((f) => ({ ...f, correctIndex: idx }))}
                                  style={{ accentColor: "#6B2A3F" }}
                                />
                                Respuesta correcta
                              </label>
                              {questionForm.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const opts = questionForm.options.filter((_, i) => i !== idx);
                                    const ci = questionForm.correctIndex >= opts.length ? opts.length - 1 : questionForm.correctIndex;
                                    setQuestionForm((f) => ({ ...f, options: opts, correctIndex: ci }));
                                  }}
                                  style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#C4849A", cursor: "pointer", fontSize: "18px" }}
                                >×</button>
                              )}
                            </div>
                            {(["es", "en", "fr"] as const).map((lang) => (
                              <div key={lang} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ fontSize: "11px", color: "#9B6B7E", fontWeight: 600, width: "24px" }}>{lang.toUpperCase()}</span>
                                <input
                                  value={opt[lang]}
                                  onChange={(e) => {
                                    const opts = questionForm.options.map((o, i) => i === idx ? { ...o, [lang]: e.target.value } : o);
                                    setQuestionForm((f) => ({ ...f, options: opts }));
                                  }}
                                  placeholder={`Opción ${String.fromCharCode(65 + idx)} en ${lang.toUpperCase()}`}
                                  style={{ flex: 1, border: "1px solid #ddd", borderRadius: "6px", padding: "6px 10px", fontSize: "13px" }}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                        {questionForm.options.length < 6 && (
                          <button
                            type="button"
                            onClick={() => setQuestionForm((f) => ({ ...f, options: [...f.options, { ...EMPTY_OPTION }] }))}
                            style={{ marginTop: "8px", background: "transparent", border: "1px dashed #C4849A", color: "#8B3A52", borderRadius: "8px", padding: "7px 16px", fontSize: "13px", cursor: "pointer", width: "100%" }}
                          >
                            + Añadir opción
                          </button>
                        )}
                      </fieldset>

                      {/* Order + Active */}
                      <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
                        <div>
                          <label style={{ fontSize: "12px", color: "#9B6B7E", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Orden</label>
                          <input
                            type="number"
                            min={1}
                            value={questionForm.order}
                            onChange={(e) => setQuestionForm((f) => ({ ...f, order: Number(e.target.value) }))}
                            style={{ width: "80px", border: "1px solid #ddd", borderRadius: "8px", padding: "7px 10px", fontSize: "14px" }}
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input
                            id="active-toggle"
                            type="checkbox"
                            checked={questionForm.active}
                            onChange={(e) => setQuestionForm((f) => ({ ...f, active: e.target.checked }))}
                            style={{ accentColor: "#6B2A3F", width: "16px", height: "16px" }}
                          />
                          <label htmlFor="active-toggle" style={{ fontSize: "14px", color: "#555", cursor: "pointer" }}>Activa (visible para invitados)</label>
                        </div>
                      </div>

                      {questionError && <p style={{ color: "#c0392b", fontSize: "13px", marginBottom: "12px" }}>⚠️ {questionError}</p>}

                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          type="submit"
                          disabled={savingQuestion}
                          style={{ background: "linear-gradient(135deg,#5a1e30,#8B3A52)", color: "#fff", border: "none", borderRadius: "24px", padding: "10px 24px", fontSize: "14px", fontWeight: 600, cursor: savingQuestion ? "not-allowed" : "pointer", opacity: savingQuestion ? 0.7 : 1 }}
                        >
                          {savingQuestion ? "Guardando…" : editingQuestion ? "Guardar cambios" : "Crear pregunta"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowQuestionForm(false); setEditingQuestion(null); setQuestionForm(EMPTY_FORM); setQuestionError(""); }}
                          style={{ background: "transparent", border: "1px solid #ddd", color: "#777", borderRadius: "24px", padding: "10px 20px", fontSize: "14px", cursor: "pointer" }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Questions list */}
                  <div style={{ marginBottom: "32px" }}>
                    <h4 style={{ color: "#5a1e30", fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>Preguntas del quiz</h4>
                    {quizQuestions.length === 0 ? (
                      <p style={{ color: "#aaa", fontSize: "14px", fontStyle: "italic" }}>Aún no hay preguntas. ¡Añade la primera!</p>
                    ) : (
                      quizQuestions
                        .slice()
                        .sort((a, b) => a.order - b.order)
                        .map((q) => (
                          <div key={q._id} style={{ background: q.active ? "#fff" : "#f9f3f5", border: `1px solid ${q.active ? "#EAB5BC" : "#e0e0e0"}`, borderRadius: "10px", padding: "14px 16px", marginBottom: "10px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                            <span style={{ background: "#EAB5BC", color: "#5a1e30", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>{q.order}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#333", fontSize: "14px" }}>{q.text.es}</p>
                              <p style={{ margin: "0 0 6px", color: "#888", fontSize: "12px" }}>EN: {q.text.en} · FR: {q.text.fr}</p>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                {q.options.map((opt, i) => (
                                  <span key={i} style={{ fontSize: "12px", padding: "2px 8px", borderRadius: "12px", background: i === q.correctIndex ? "#6B2A3F" : "#f0e6ea", color: i === q.correctIndex ? "#fff" : "#555" }}>
                                    {String.fromCharCode(65 + i)}. {opt.es}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap" }}>
                              <button
                                onClick={() => handleToggleActive(q)}
                                title={q.active ? "Desactivar" : "Activar"}
                                style={{ background: q.active ? "#e8f5e9" : "#fce4ec", border: "none", borderRadius: "8px", padding: "6px 10px", fontSize: "13px", cursor: "pointer", color: q.active ? "#388e3c" : "#c62828" }}
                              >
                                {q.active ? "✓ Activa" : "✗ Inactiva"}
                              </button>
                              <button
                                onClick={() => openEditForm(q)}
                                style={{ background: "#EAB5BC", border: "none", borderRadius: "8px", padding: "6px 10px", fontSize: "13px", cursor: "pointer", color: "#5a1e30" }}
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q._id!)}
                                style={{ background: "transparent", border: "1px solid #C4849A", borderRadius: "8px", padding: "6px 10px", fontSize: "13px", cursor: "pointer", color: "#C4849A" }}
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Ranking */}
                  <div>
                    <h4 style={{ color: "#5a1e30", fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>
                      🏆 Ranking de participantes
                      <button onClick={fetchQuizData} style={{ marginLeft: "12px", background: "transparent", border: "1px solid #EAB5BC", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", color: "#8B3A52", cursor: "pointer" }}>↻ Actualizar</button>
                    </h4>
                    {quizRanking.length === 0 ? (
                      <p style={{ color: "#aaa", fontSize: "14px", fontStyle: "italic" }}>Nadie ha jugado todavía.</p>
                    ) : (
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                          <thead>
                            <tr style={{ background: "#FBF5EF" }}>
                              {["#", "Nombre", "Email", "Puntuación", "Intentos", "Fecha"].map((h) => (
                                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "#8B3A52", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "2px solid #EAB5BC" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {quizRanking.map((entry) => (
                              <tr key={entry.email} style={{ borderBottom: "1px solid #f0e6ea" }}>
                                <td style={{ padding: "10px 12px", fontWeight: 700, color: ["🥇","🥈","🥉"][entry.position - 1] ? "#5a1e30" : "#888" }}>
                                  {["🥇","🥈","🥉"][entry.position - 1] ?? entry.position}
                                </td>
                                <td style={{ padding: "10px 12px", color: "#333" }}>{entry.name}</td>
                                <td style={{ padding: "10px 12px", color: "#666", fontSize: "13px" }}>{entry.email}</td>
                                <td style={{ padding: "10px 12px" }}>
                                  <span style={{ fontWeight: 700, color: "#5a1e30" }}>{entry.bestScore}</span>
                                  <span style={{ color: "#aaa", fontSize: "12px" }}>/{entry.totalQuestions}</span>
                                </td>
                                <td style={{ padding: "10px 12px", color: "#888", fontSize: "13px" }}>{entry.attempts}</td>
                                <td style={{ padding: "10px 12px", color: "#999", fontSize: "12px" }}>{new Date(entry.completedAt).toLocaleDateString("es-ES")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Detail({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div style={{ gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <div style={{ color: "#999", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{label}</div>
      <div style={{ color: "#333", fontSize: "14px" }}>{value}</div>
    </div>
  );
}
