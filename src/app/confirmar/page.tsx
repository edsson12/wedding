"use client";

import "@/i18n";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent, Suspense } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface InvitationData {
  status: "pending" | "accepted" | "declined";
  email: string;
  guestName?: string;
}

function ConfirmarContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [finalStatus, setFinalStatus] = useState<"accepted" | "declined" | null>(null);

  // Form state
  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState<"accepted" | "declined" | null>(null);
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [allergy, setAllergy] = useState("");
  const [intolerance, setIntolerance] = useState("");
  const [specialDiet, setSpecialDiet] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!token) {
      setError(t("confirmar.invalidLink"));
      setLoading(false);
      return;
    }
    fetch(`/api/rsvp?token=${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const d = await res.json();
          setError(d.error ?? t("confirmar.invalidLink"));
        } else {
          const data: InvitationData = await res.json();
          setInvitation(data);
          if (data.guestName) setGuestName(data.guestName);
        }
      })
      .catch(() => setError(t("confirmar.errorConnection")))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!attending) { setFormError(t("confirmar.errorAttending")); return; }
    if (!guestName.trim()) { setFormError(t("confirmar.errorName")); return; }
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status: attending, guestName: guestName.trim(), song, message, allergy, intolerance, specialDiet }),
      });
      if (res.ok) {
        setFinalStatus(attending);
        setDone(true);
      } else {
        const d = await res.json();
        setFormError(d.error ?? t("confirmar.errorConnection"));
      }
    } catch {
      setFormError(t("confirmar.errorConnection"));
    } finally {
      setSubmitting(false);
    }
  }

  // ── States ──────────────────────────────────────────────────

  if (loading) return (
    <PageShell>
      <p style={{ color: "#9FB3AA", textAlign: "center", fontSize: "16px" }}>{t("confirmar.loading")}</p>
    </PageShell>
  );

  if (error) return (
    <PageShell>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💌</div>
        <h2 style={{ color: "#6F7F87", fontWeight: 400, fontSize: "22px", margin: "0 0 12px" }}>{t("confirmar.invalidLink")}</h2>
        <p style={{ color: "#9FB3AA", lineHeight: 1.7 }}>{error}</p>
      </div>
    </PageShell>
  );

  if (invitation && invitation.status !== "pending") return (
    <PageShell>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          {invitation.status === "accepted" ? "🎉" : "💌"}
        </div>
        <h2 style={{ color: "#6F7F87", fontWeight: 400, fontSize: "22px", margin: "0 0 12px" }}>
          {invitation.status === "accepted" ? t("confirmar.alreadyAccepted") : t("confirmar.alreadyDeclined")}
        </h2>
        <p style={{ color: "#9FB3AA", lineHeight: 1.7 }}>
          {invitation.status === "accepted"
            ? t("confirmar.waitingAccepted")
            : t("confirmar.waitingDeclined")}
        </p>
      </div>
    </PageShell>
  );

  if (done && finalStatus) return (
    <PageShell>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "20px" }}>
          {finalStatus === "accepted" ? "🎊" : "💕"}
        </div>
        <h2 style={{ color: "#6F7F87", fontWeight: 400, fontSize: "26px", margin: "0 0 16px", fontFamily: "var(--font-parisienne), cursive" }}>
          {finalStatus === "accepted" ? t("confirmar.thanksAccepted") : t("confirmar.thanksDeclined")}
        </h2>
        <p style={{ color: "#4a6068", fontSize: "16px", lineHeight: 1.8, margin: "0 0 32px" }}>
          {finalStatus === "accepted"
            ? <><strong>{t("confirmar.acceptedMessageBold")}</strong> {t("confirmar.acceptedMessageRest")}</>
            : <>{t("confirmar.declinedMessage")}</>}
        </p>

        {/* CTA to explore the wedding website */}
        <div style={{
          background: "linear-gradient(135deg, #EFEDEF 0%, #E6D6C8 100%)",
          borderRadius: "16px",
          padding: "28px 24px",
          border: "1px solid #C8D2DA",
        }}>
          <p style={{
            color: "#6F7F87",
            fontSize: "18px",
            margin: "0 0 8px",
            fontFamily: "var(--font-parisienne), cursive",
            fontWeight: 400,
          }}>
            {t("confirmar.discoverTitle")}
          </p>
          <p style={{ color: "#9FB3AA", fontSize: "13px", margin: "0 0 20px", lineHeight: 1.7 }}>
            {t("confirmar.discoverSub")}
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #9FB3AA, #AEBCC7)",
              color: "#fff",
              textDecoration: "none",
              padding: "14px 34px",
              borderRadius: "50px",
              fontSize: "15px",
              letterSpacing: "0.5px",
            }}
          >
            {t("confirmar.discoverCta")}
          </Link>
        </div>
      </div>
    </PageShell>
  );

  // ── RSVP Form ───────────────────────────────────────────────
  return (
    <PageShell>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>💌</div>
        <h1 style={{ color: "#6F7F87", fontSize: "28px", fontWeight: 400, margin: "0 0 8px", fontFamily: "var(--font-parisienne), cursive" }}>
          Vale & Edu
        </h1>
        <p style={{ color: "#9FB3AA", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px" }}>
          25 · Julio · 2026 · Zaragoza
        </p>
        <p style={{ color: "#4a6068", fontSize: "16px", margin: 0 }}>
          {t("confirmar.greeting", { email: invitation?.email ? ` (${invitation.email})` : "" })}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>{t("confirmar.name")}</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder={t("confirmar.namePlaceholder")}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#6F7F87")}
            onBlur={(e) => (e.target.style.borderColor = "#E6D6C8")}
          />
        </div>

        {/* Asistencia */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>{t("confirmar.attending")}</label>
          <div style={{ display: "flex", gap: "12px" }}>
            {(["accepted", "declined"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAttending(opt)}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: attending === opt ? (opt === "accepted" ? "#9FB3AA" : "#AEBCC7") : "#E6D6C8",
                  background: attending === opt ? (opt === "accepted" ? "#9FB3AA" : "#AEBCC7") : "#fff",
                  color: attending === opt ? "#fff" : "#6F7F87",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                {opt === "accepted" ? t("confirmar.attendYes") : t("confirmar.attendNo")}
              </button>
            ))}
          </div>
        </div>

        {/* Show extra fields only if accepted */}
        {attending === "accepted" && (
          <>
            {/* Dietary restrictions */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{ ...labelStyle, marginBottom: "14px" }}>
                {t("confirmar.dietary")}{" "}
                <span style={{ color: "#9FB3AA", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>{t("confirmar.dietaryOptional")}</span>
              </p>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ ...labelStyle, fontSize: "11px", marginBottom: "6px", opacity: 0.75 }}>{t("confirmar.allergies")}</label>
                <input
                  type="text"
                  value={allergy}
                  onChange={(e) => setAllergy(e.target.value)}
                  placeholder={t("confirmar.allergiesPlaceholder")}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#6F7F87")}
                  onBlur={(e) => (e.target.style.borderColor = "#E6D6C8")}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ ...labelStyle, fontSize: "11px", marginBottom: "6px", opacity: 0.75 }}>{t("confirmar.intolerances")}</label>
                <input
                  type="text"
                  value={intolerance}
                  onChange={(e) => setIntolerance(e.target.value)}
                  placeholder={t("confirmar.intolerancesPlaceholder")}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#6F7F87")}
                  onBlur={(e) => (e.target.style.borderColor = "#E6D6C8")}
                />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: "11px", marginBottom: "6px", opacity: 0.75 }}>{t("confirmar.specialDiet")}</label>
                <input
                  type="text"
                  value={specialDiet}
                  onChange={(e) => setSpecialDiet(e.target.value)}
                  placeholder={t("confirmar.specialDietPlaceholder")}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#6F7F87")}
                  onBlur={(e) => (e.target.style.borderColor = "#E6D6C8")}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>{t("confirmar.song")} <span style={{ color: "#9FB3AA", fontWeight: 400 }}>{t("confirmar.songOptional")}</span></label>
              <input
                type="text"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder={t("confirmar.songPlaceholder")}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6F7F87")}
                onBlur={(e) => (e.target.style.borderColor = "#E6D6C8")}
              />
            </div>
          </>
        )}

        {/* Message */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>{t("confirmar.message")} <span style={{ color: "#9FB3AA", fontWeight: 400 }}>{t("confirmar.messageOptional")}</span></label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder={t("confirmar.messagePlaceholder")}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = "#6F7F87")}
            onBlur={(e) => (e.target.style.borderColor = "#E6D6C8")}
          />
        </div>

        {formError && (
          <div style={{ background: "#e8eff4", border: "1px solid #AEBCC7", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#6F7F87", fontSize: "14px" }}>
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#9FB3AA,#AEBCC7)", color: "#fff", border: "none", borderRadius: "50px", fontSize: "16px", letterSpacing: "1px", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? t("confirmar.sending") : t("confirmar.send")}
        </button>
      </form>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#EFEDEF 0%,#E6D6C8 100%)", padding: "40px 20px" }}>
      <div style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 8px 48px rgba(111,127,135,0.14)", padding: "48px 40px", width: "100%", maxWidth: "560px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "24px" }}>
          <LanguageSwitcher dark />
        </div>
        {children}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#4a6068",
  fontSize: "13px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "2px solid #E6D6C8",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#EFEDEF",
  color: "#4a6068",
};

export default function ConfirmarPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#EFEDEF" }}>
        <p style={{ color: "#9FB3AA" }}>Cargando...</p>
      </div>
    }>
      <ConfirmarContent />
    </Suspense>
  );
}
