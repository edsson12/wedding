"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error ?? "Error al iniciar sesión");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF5EF", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 8px 40px rgba(139,58,82,0.15)", padding: "48px 40px", width: "100%", maxWidth: "420px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💍</div>
          <h1 style={{ color: "#8B3A52", fontSize: "28px", fontWeight: 400, margin: "0 0 8px", letterSpacing: "1px" }}>Vale & Edu</h1>
          <p style={{ color: "#C4849A", fontSize: "14px", margin: 0, letterSpacing: "2px", textTransform: "uppercase" }}>Panel de gestión</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: "#6b2a3f", fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #F4D6C7", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box", background: "#FBF5EF", color: "#333" }}
              onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
              onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", color: "#6b2a3f", fontSize: "13px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #F4D6C7", borderRadius: "10px", fontSize: "15px", outline: "none", boxSizing: "border-box", background: "#FBF5EF", color: "#333" }}
              onFocus={(e) => (e.target.style.borderColor = "#8B3A52")}
              onBlur={(e) => (e.target.style.borderColor = "#F4D6C7")}
            />
          </div>

          {error && (
            <div style={{ background: "#fde8ed", border: "1px solid #C4849A", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#8B3A52", fontSize: "14px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg,#8B3A52,#C4849A)", color: "#fff", border: "none", borderRadius: "50px", fontSize: "15px", letterSpacing: "1px", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
