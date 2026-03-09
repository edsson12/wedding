"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, FormEvent, Suspense } from "react";

interface InvitationData {
  status: "pending" | "accepted" | "declined";
  email: string;
  guestName?: string;
}

function ConfirmarContent() {
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
  const [companions, setCompanions] = useState(0);
  const [song, setSong] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Enlace inválido. Por favor usa el enlace que recibiste en tu correo.");
      setLoading(false);
      return;
    }
    fetch(`/api/rsvp?token=${token}`)
      .then(async (res) => {
        if (!res.ok) {
          const d = await res.json();
          setError(d.error ?? "Invitación no encontrada");
        } else {
          const data: InvitationData = await res.json();
          setInvitation(data);
          if (data.guestName) setGuestName(data.guestName);
        }
      })
      .catch(() => setError("Error de conexión"))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!attending) { setFormError("Por favor indica si asistirás o no"); return; }
    if (!guestName.trim()) { setFormError("Por favor escribe tu nombre"); return; }
    setFormError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, status: attending, guestName: guestName.trim(), companions, song, message }),
      });
      if (res.ok) {
        setFinalStatus(attending);
        setDone(true);
      } else {
        const d = await res.json();
        setFormError(d.error ?? "Error al enviar tu respuesta");
      }
    } catch {
      setFormError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  // ── States ──────────────────────────────────────────────────

  if (loading) return (
    <PageShell>
      <p style={{ color: "#C4849A", textAlign: "center", fontSize: "16px" }}>Cargando tu invitación...</p>
    </PageShell>
  );

  if (error) return (
    <PageShell>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💌</div>
        <h2 style={{ color: "#8B3A52", fontWeight: 400, fontSize: "22px", margin: "0 0 12px" }}>Enlace no válido</h2>
        <p style={{ color: "#C4849A", lineHeight: 1.7 }}>{error}</p>
      </div>
    </PageShell>
  );

  if (invitation && invitation.status !== "pending") return (
    <PageShell>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>
          {invitation.status === "accepted" ? "🎉" : "💌"}
        </div>
        <h2 style={{ color: "#8B3A52", fontWeight: 400, fontSize: "22px", margin: "0 0 12px" }}>
          {invitation.status === "accepted" ? "¡Ya confirmaste tu asistencia!" : "Ya nos enviaste tu respuesta"}
        </h2>
        <p style={{ color: "#C4849A", lineHeight: 1.7 }}>
          {invitation.status === "accepted"
            ? "¡Te esperamos con mucha ilusión el 25 de julio de 2026! 💕"
            : "Gracias por avisarnos. ¡Te tendremos presentes ese día!"}
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
        <h2 style={{ color: "#8B3A52", fontWeight: 400, fontSize: "26px", margin: "0 0 16px" }}>
          {finalStatus === "accepted" ? "¡Gracias por confirmar!" : "¡Gracias por avisarnos!"}
        </h2>
        <p style={{ color: "#6b2a3f", fontSize: "16px", lineHeight: 1.8, margin: 0 }}>
          {finalStatus === "accepted"
            ? <>¡Nos hace muchísima ilusión tenerte el <strong>25 de julio de 2026</strong> en Zaragoza! Ya solo queda esperar con ganas. Con todo nuestro amor, <em>Vale & Edu</em> 💍</>
            : <>Sentimos que no puedas estar con nosotros, pero te tendremos muy presentes ese día. Con todo nuestro cariño, <em>Vale & Edu</em> 💕</>}
        </p>
      </div>
    </PageShell>
  );

  // ── RSVP Form ───────────────────────────────────────────────
  return (
    <PageShell>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>💌</div>
        <h1 style={{ color: "#8B3A52", fontSize: "28px", fontWeight: 400, margin: "0 0 8px", fontFamily: "Georgia,serif" }}>
          Vale & Edu
        </h1>
        <p style={{ color: "#C4849A", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px" }}>
          25 · Julio · 2026 · Zaragoza
        </p>
        <p style={{ color: "#6b2a3f", fontSize: "16px", margin: 0 }}>
          Hola{invitation?.email ? ` (${invitation.email})` : ""}, nos hace mucha ilusión contar contigo.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Nombre */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Tu nombre completo</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Nombre y apellidos"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
            onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
          />
        </div>

        {/* Asistencia */}
        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>¿Asistirás a la boda?</label>
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
                  borderColor: attending === opt ? (opt === "accepted" ? "#8B9D77" : "#C4849A") : "#F4D6C7",
                  background: attending === opt ? (opt === "accepted" ? "#8B9D77" : "#C4849A") : "#fff",
                  color: attending === opt ? "#fff" : "#8B3A52",
                  fontSize: "15px",
                  cursor: "pointer",
                  fontFamily: "Georgia,serif",
                }}
              >
                {opt === "accepted" ? "✅ Sí, asistiré" : "❌ No podré ir"}
              </button>
            ))}
          </div>
        </div>

        {/* Show extra fields only if accepted */}
        {attending === "accepted" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>¿Cuántos acompañantes traerás? (sin contarte a ti)</label>
              <input
                type="number"
                min={0}
                max={10}
                value={companions}
                onChange={(e) => setCompanions(Number(e.target.value))}
                style={{ ...inputStyle, width: "100px" }}
                onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
                onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>¿Qué canción no puede faltar? 🎵 <span style={{ color: "#C4849A", fontWeight: 400 }}>(opcional)</span></label>
              <input
                type="text"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                placeholder="Artista — Canción"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
                onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
              />
            </div>
          </>
        )}

        {/* Message */}
        <div style={{ marginBottom: "28px" }}>
          <label style={labelStyle}>Mensaje para los novios 💕 <span style={{ color: "#C4849A", fontWeight: 400 }}>(opcional)</span></label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Escribe algo bonito para Vale y Edu..."
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
            onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
          />
        </div>

        {formError && (
          <div style={{ background: "#fde8ed", border: "1px solid #C4849A", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#8B3A52", fontSize: "14px" }}>
            {formError}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg,#8B3A52,#C4849A)", color: "#fff", border: "none", borderRadius: "50px", fontSize: "16px", fontFamily: "Georgia,serif", letterSpacing: "1px", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Enviando..." : "Enviar respuesta →"}
        </button>
      </form>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg,#FBF5EF 0%,#F4D6C7 100%)", padding: "40px 20px" }}>
      <div style={{ background: "#fff", borderRadius: "24px", boxShadow: "0 8px 48px rgba(139,58,82,0.14)", padding: "48px 40px", width: "100%", maxWidth: "560px" }}>
        {children}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#6b2a3f",
  fontSize: "13px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginBottom: "8px",
  fontFamily: "Arial,sans-serif",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "2px solid #F4D6C7",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  background: "#FBF5EF",
  color: "#333",
  fontFamily: "Arial,sans-serif",
};

export default function ConfirmarPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF5EF" }}>
        <p style={{ color: "#C4849A" }}>Cargando...</p>
      </div>
    }>
      <ConfirmarContent />
    </Suspense>
  );
}
