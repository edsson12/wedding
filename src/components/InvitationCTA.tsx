"use client";

import { useTranslation } from "react-i18next";

export default function InvitationCTA() {
  const { t } = useTranslation();
  const notifEmail = process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL ?? "";
  return (
    <section
      id="invitacion"
      style={{
        background: "linear-gradient(160deg,#FBF0EE 0%,#F5D5DA 100%)",
        padding: "80px 24px",
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ fontSize: "48px", marginBottom: "20px" }}>💌</div>
        <h2
          style={{
            color: "#9B6B7E",
            fontSize: "clamp(28px, 5vw, 40px)",
            fontWeight: 400,
            fontFamily: "var(--font-parisienne), cursive",
            margin: "0 0 16px",
            letterSpacing: "1px",
          }}
        >
          {t("cta.title")}
        </h2>
        <p
          style={{
            color: "#6B4F57",
            fontSize: "16px",
            lineHeight: 1.8,
            margin: "0 0 12px",
          }}
        >
          {t("cta.p1")}
        </p>
        <p
          style={{
            color: "#C98FA0",
            fontSize: "14px",
            lineHeight: 1.7,
            margin: "0 0 36px",
          }}
        >
          {t("cta.p2")}
        </p>
        <div
          style={{
            display: "inline-block",
            background: "rgba(201,143,160,0.12)",
            border: "2px solid #EAB5BC",
            borderRadius: "16px",
            padding: "20px 32px",
            color: "#9B6B7E",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          {t("cta.noEmail")}{" "}
          <a
            href={`mailto:${notifEmail}`}
            style={{
              color: "#9B6B7E",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            {notifEmail ? notifEmail : "valeco9126@gmail.com"}
          </a>
        </div>
      </div>
    </section>
  );
}
