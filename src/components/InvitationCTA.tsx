"use client";

export default function InvitationCTA() {
  return (
    <section
      id="invitacion"
      style={{
        background: "linear-gradient(160deg,#FBF5EF 0%,#F4D6C7 100%)",
        padding: "80px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>💌</div>
        <h2
          style={{
            color: "#8B3A52",
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 400,
            fontFamily: "Georgia, serif",
            margin: "0 0 16px",
            letterSpacing: "1px",
          }}
        >
          ¿Ya tienes tu invitación?
        </h2>
        <p
          style={{
            color: "#6b2a3f",
            fontSize: "16px",
            lineHeight: 1.8,
            margin: "0 0 12px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Pronto recibirás un correo personalizado con tu enlace de confirmación.
        </p>
        <p
          style={{
            color: "#C4849A",
            fontSize: "14px",
            lineHeight: 1.7,
            margin: "0 0 36px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Si ya lo recibiste, usa el enlace que está en ese correo para confirmar tu asistencia.
        </p>
        <div
          style={{
            display: "inline-block",
            background: "rgba(139,58,82,0.08)",
            border: "2px solid #F4D6C7",
            borderRadius: "16px",
            padding: "20px 32px",
            color: "#8B3A52",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            lineHeight: 1.7,
          }}
        >
          ¿No recibiste el correo? Escríbenos a{" "}
          <a
            href="mailto:edsson.cortes@gmail.com"
            style={{ color: "#8B3A52", fontWeight: "bold", textDecoration: "underline" }}
          >
            edsson.cortes@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
