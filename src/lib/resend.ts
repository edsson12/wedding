import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "edsson.cortes@gmail.com";

export async function sendInvitationEmail(email: string, token: string): Promise<void> {
  const confirmUrl = `${BASE_URL}/confirmar?token=${token}`;

  await resend.emails.send({
    from: `Vale & Edu 💍 <${FROM}>`,
    to: email,
    subject: "¡Estás invitado/a a nuestra boda! 💒",
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FBF5EF;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF5EF;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(139,58,82,0.12);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#5a1e30 0%,#8B3A52 50%,#6b2a3f 100%);padding:48px 40px;text-align:center;">
            <p style="color:#F4D6C7;font-size:14px;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px;">Te invitamos a nuestra boda</p>
            <h1 style="color:#fff;font-size:42px;margin:0;font-weight:400;letter-spacing:2px;">Vale &amp; Edu</h1>
            <p style="color:#F4D6C7;font-size:16px;margin:16px 0 0;letter-spacing:2px;">25 · Julio · 2026 · Zaragoza</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:48px 40px;text-align:center;">
            <p style="color:#5a1e30;font-size:18px;line-height:1.7;margin:0 0 24px;">Sería un honor tenerte con nosotros en el día más especial de nuestras vidas.</p>
            <p style="color:#6b2a3f;font-size:15px;line-height:1.7;margin:0 0 36px;">Por favor, confirma tu asistencia usando el enlace personalizado que hemos preparado para ti.</p>
            <a href="${confirmUrl}" style="display:inline-block;background:linear-gradient(135deg,#8B3A52,#C4849A);color:#fff;text-decoration:none;padding:16px 40px;border-radius:50px;font-size:16px;letter-spacing:1px;font-family:Georgia,serif;">
              Confirmar asistencia →
            </a>
            <p style="color:#999;font-size:12px;margin:32px 0 0;line-height:1.6;">Si el botón no funciona, copia este enlace en tu navegador:<br>
              <span style="color:#8B3A52;word-break:break-all;">${confirmUrl}</span>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#FBF5EF;padding:24px 40px;text-align:center;border-top:1px solid #F4D6C7;">
            <p style="color:#C4849A;font-size:13px;margin:0;">Con todo nuestro amor, Vale &amp; Edu 💕</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}

interface GuestData {
  guestName: string;
  email: string;
  status: "accepted" | "declined";
  companions: number;
  song?: string;
  message?: string;
}

export async function sendConfirmationNotification(guest: GuestData): Promise<void> {
  const isAccepted = guest.status === "accepted";
  const statusEmoji = isAccepted ? "✅" : "❌";
  const statusText = isAccepted ? "CONFIRMÓ ASISTENCIA" : "DECLINÓ LA INVITACIÓN";

  await resend.emails.send({
    from: `Boda Vale & Edu <${FROM}>`,
    to: NOTIFICATION_EMAIL,
    subject: `${statusEmoji} ${guest.guestName ?? guest.email} ${statusText}`,
    html: `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:20px;background:#FBF5EF;font-family:Arial,sans-serif;">
  <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:${isAccepted ? "#8B9D77" : "#C4849A"};padding:24px;text-align:center;">
      <h2 style="color:#fff;margin:0;font-size:22px;">${statusEmoji} Nueva respuesta</h2>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#999;font-size:13px;width:120px;">Nombre</td><td style="padding:8px 0;color:#333;font-weight:bold;">${guest.guestName ?? "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#999;font-size:13px;">Email</td><td style="padding:8px 0;color:#333;">${guest.email}</td></tr>
        <tr><td style="padding:8px 0;color:#999;font-size:13px;">Respuesta</td><td style="padding:8px 0;color:${isAccepted ? "#8B9D77" : "#C4849A"};font-weight:bold;">${statusText}</td></tr>
        ${isAccepted ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Acompañantes</td><td style="padding:8px 0;color:#333;">${guest.companions}</td></tr>` : ""}
        ${guest.song ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Canción</td><td style="padding:8px 0;color:#333;">🎵 ${guest.song}</td></tr>` : ""}
        ${guest.message ? `<tr><td style="padding:8px 0;color:#999;font-size:13px;">Mensaje</td><td style="padding:8px 0;color:#333;font-style:italic;">"${guest.message}"</td></tr>` : ""}
      </table>
    </div>
    <div style="background:#FBF5EF;padding:16px;text-align:center;border-top:1px solid #F4D6C7;">
      <p style="color:#C4849A;font-size:12px;margin:0;">Panel de gestión · Boda Vale &amp; Edu · 25.07.2026</p>
    </div>
  </div>
</body>
</html>`,
  });
}
