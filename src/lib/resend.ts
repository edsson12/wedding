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
    subject: "¡Estás invitado/a! · You're invited! · Vous êtes invité·e! 💒",
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#FBF0EE;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF0EE;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(155,107,126,0.15);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(150deg,#7A3B52 0%,#9B6B7E 55%,#C98FA0 100%);padding:48px 40px 40px;text-align:center;">
            <h1 style="color:#fff;font-size:52px;margin:0 0 6px;font-weight:400;letter-spacing:3px;font-style:italic;">Vale &amp; Edu</h1>
            <div style="width:60px;height:1px;background:rgba(245,213,218,0.5);margin:16px auto;"></div>
            <p style="color:#F5D5DA;font-size:14px;margin:0;letter-spacing:3px;font-family:Helvetica,Arial,sans-serif;">25 · JULIO · 2026</p>
            <p style="color:rgba(245,213,218,0.75);font-size:12px;margin:6px 0 0;letter-spacing:2px;font-family:Helvetica,Arial,sans-serif;">ZARAGOZA, ESPAÑA</p>
          </td>
        </tr>

        <!-- ES Section -->
        <tr>
          <td style="padding:36px 48px 28px;background:#fff;">
            <p style="display:inline-block;background:#EAB5BC;color:#fff;font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;">🇪🇸 Español</p>
            <p style="color:#9B6B7E;font-size:22px;font-weight:400;font-style:italic;margin:0 0 14px;">Querido/a invitado/a,</p>
            <p style="color:#6B4F57;font-size:15px;line-height:1.9;margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;">Sería un honor tenerte con nosotros en el día más especial de nuestras vidas. Tu presencia llenará de alegría nuestra celebración.</p>
            <p style="color:#C98FA0;font-size:14px;line-height:1.8;margin:0;font-family:Helvetica,Arial,sans-serif;">Completa el siguiente formulario para descubrir todos los detalles de la boda. Allí también podrás dejarnos la canción que te gustaría escuchar y un mensaje para nosotros🌿</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(to right,transparent,#EAB5BC,transparent);"></div></td></tr>

        <!-- EN Section -->
        <tr>
          <td style="padding:28px 48px;background:#fff;">
            <p style="display:inline-block;background:#EAB5BC;color:#fff;font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;">🇬🇧 English</p>
            <p style="color:#9B6B7E;font-size:22px;font-weight:400;font-style:italic;margin:0 0 14px;">Dear guest,</p>
            <p style="color:#6B4F57;font-size:15px;line-height:1.9;margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;">It would be an honour to have you with us on the most special day of our lives. Your presence will make our celebration truly complete.</p>
            <p style="color:#C98FA0;font-size:14px;line-height:1.8;margin:0;font-family:Helvetica,Arial,sans-serif;">Fill in the form below to discover all the details of the wedding. You can also let us know the song you’d like to hear and leave us a message🌿</p>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 48px;"><div style="height:1px;background:linear-gradient(to right,transparent,#EAB5BC,transparent);"></div></td></tr>

        <!-- FR Section -->
        <tr>
          <td style="padding:28px 48px 36px;background:#fff;">
            <p style="display:inline-block;background:#EAB5BC;color:#fff;font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:4px 10px;border-radius:4px;margin:0 0 18px;font-family:Helvetica,Arial,sans-serif;">🇫🇷 Français</p>
            <p style="color:#9B6B7E;font-size:22px;font-weight:400;font-style:italic;margin:0 0 14px;">Cher/chère invité·e,</p>
            <p style="color:#6B4F57;font-size:15px;line-height:1.9;margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;">Ce serait un honneur de vous avoir avec nous pour le jour le plus spécial de notre vie. Votre présence rendra notre célébration inoubliable.</p>
            <p style="color:#C98FA0;font-size:14px;line-height:1.8;margin:0;font-family:Helvetica,Arial,sans-serif;">Remplissez le formulaire ci-dessous pour découvrir tous les détails du mariage. Vous pourrez aussi nous indiquer la chanson que vous aimeriez entendre et nous laisser un message🌿</p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:8px 48px 36px;text-align:center;background:#fff;">
            <a href="${confirmUrl}" style="display:inline-block;background:linear-gradient(135deg,#9B6B7E,#C98FA0);color:#fff;text-decoration:none;padding:18px 48px;border-radius:50px;font-size:14px;letter-spacing:2px;font-family:Helvetica,Arial,sans-serif;font-weight:600;box-shadow:0 6px 20px rgba(155,107,126,0.4);">
              Ver detalles · See details · Voir les détails →
            </a>
            <p style="color:#bbb;font-size:11px;margin:24px 0 0;line-height:1.7;font-family:Helvetica,Arial,sans-serif;">
              <a href="${confirmUrl}" style="color:#C98FA0;word-break:break-all;text-decoration:none;">${confirmUrl}</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#FBF0EE;padding:24px 40px;text-align:center;border-top:1px solid #EAB5BC;">
            <p style="color:#C98FA0;font-size:20px;font-style:italic;margin:0 0 4px;">Vale &amp; Edu</p>
            <p style="color:#D4A0AE;font-size:11px;margin:0;letter-spacing:2px;font-family:Helvetica,Arial,sans-serif;">Con todo nuestro amor · With all our love · Avec tout notre amour 🤍</p>
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
  allergy?: string;
  intolerance?: string;
  specialDiet?: string;
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
<body style="margin:0;padding:28px 20px;background:#FBF0EE;font-family:Helvetica,Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(155,107,126,0.12);">

    <!-- Header -->
    <div style="background:${isAccepted ? "linear-gradient(135deg,#7A3B52,#9B6B7E)" : "linear-gradient(135deg,#9B6B7E,#C98FA0)"};padding:28px 32px;text-align:center;">
      <p style="color:rgba(245,213,218,0.8);font-size:10px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px;">Boda Vale &amp; Edu · 25.07.2026</p>
      <h2 style="color:#fff;margin:0;font-size:20px;font-weight:600;letter-spacing:1px;">${statusEmoji} Nueva respuesta</h2>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;width:130px;border-bottom:1px solid #FBF0EE;">Nombre</td><td style="padding:10px 0;color:#6B4F57;font-weight:700;border-bottom:1px solid #FBF0EE;">${guest.guestName ?? "—"}</td></tr>
        <tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #FBF0EE;">Email</td><td style="padding:10px 0;color:#6B4F57;border-bottom:1px solid #FBF0EE;">${guest.email}</td></tr>
        <tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #FBF0EE;">Respuesta</td><td style="padding:10px 0;color:${isAccepted ? "#9B6B7E" : "#C98FA0"};font-weight:700;border-bottom:1px solid #FBF0EE;">${statusText}</td></tr>
        ${guest.song ? `<tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #FBF0EE;">Canción</td><td style="padding:10px 0;color:#6B4F57;border-bottom:1px solid #FBF0EE;">🎵 ${guest.song}</td></tr>` : ""}
        ${guest.message ? `<tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #FBF0EE;">Mensaje</td><td style="padding:10px 0;color:#6B4F57;font-style:italic;border-bottom:1px solid #FBF0EE;">&ldquo;${guest.message}&rdquo;</td></tr>` : ""}
        ${guest.allergy ? `<tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #FBF0EE;">Alergia</td><td style="padding:10px 0;color:#b45309;border-bottom:1px solid #FBF0EE;">🚫 ${guest.allergy}</td></tr>` : ""}
        ${guest.intolerance ? `<tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;border-bottom:1px solid #FBF0EE;">Intolerancia</td><td style="padding:10px 0;color:#b45309;border-bottom:1px solid #FBF0EE;">⚠️ ${guest.intolerance}</td></tr>` : ""}
        ${guest.specialDiet ? `<tr><td style="padding:10px 0;color:#C98FA0;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Dieta</td><td style="padding:10px 0;color:#8FAE9C;">🌿 ${guest.specialDiet}</td></tr>` : ""}
      </table>
    </div>

    <!-- Footer -->
    <div style="background:#FBF0EE;padding:16px 32px;text-align:center;border-top:1px solid #EAB5BC;">
      <p style="color:#D4A0AE;font-size:11px;margin:0;letter-spacing:1px;">Panel de gestión · Boda Vale &amp; Edu · 25.07.2026</p>
    </div>
  </div>
</body>
</html>`,
  });
}
