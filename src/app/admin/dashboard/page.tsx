"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface Invitation {
  _id: string;
  email: string;
  status: "pending" | "accepted" | "declined";
  guestName?: string;
  companions: number;
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

  return (
    <div style={{ minHeight: "100vh", background: "#FBF5EF", fontFamily: "Arial, sans-serif" }}>
      {/* Top nav */}
      <header style={{ background: "linear-gradient(135deg,#5a1e30,#8B3A52)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        <div>
          <span style={{ color: "#fff", fontSize: "18px", fontFamily: "Georgia,serif" }}>Vale & Edu</span>
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
          <h2 style={{ color: "#8B3A52", fontSize: "18px", margin: "0 0 16px", fontFamily: "Georgia,serif", fontWeight: 400 }}>
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
          <h2 style={{ color: "#8B3A52", fontSize: "18px", margin: "0 0 20px", fontFamily: "Georgia,serif", fontWeight: 400 }}>
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
                  fontFamily: "Arial,sans-serif",
                }}
              >
                {s === "all" ? "Todos" : STATUS_LABEL[s]}
              </button>
            ))}
          </div>

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
                      <Detail label="Acompañantes" value={String(inv.companions)} />
                      <Detail label="Enviado" value={new Date(inv.sentAt).toLocaleDateString("es-ES")} />
                      {inv.respondedAt && <Detail label="Respondió" value={new Date(inv.respondedAt).toLocaleDateString("es-ES")} />}
                      {inv.song && <Detail label="Canción" value={`🎵 ${inv.song}`} />}
                      {inv.message && <Detail label="Mensaje" value={`"${inv.message}"`} fullWidth />}
                    </div>
                  </div>
                )}
              </div>
            ))
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
