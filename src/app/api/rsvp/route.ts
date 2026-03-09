import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Invitation from "@/lib/models/Invitation";
import { sendConfirmationNotification } from "@/lib/resend";

// GET /api/rsvp?token=xxx — validate token and return current status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token requerido" }, { status: 400 });
  }

  await connectDB();
  const invitation = await Invitation.findOne({ token }).lean();

  if (!invitation) {
    return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    status: invitation.status,
    email: invitation.email,
    guestName: invitation.guestName,
  });
}

// POST /api/rsvp — submit RSVP response
export async function POST(request: Request) {
  const body = await request.json();
  const { token, status, guestName, companions, song, message } = body;

  if (!token || !["accepted", "declined"].includes(status)) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  await connectDB();
  const invitation = await Invitation.findOne({ token });

  if (!invitation) {
    return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404 });
  }

  if (invitation.status !== "pending") {
    return NextResponse.json({ error: "Esta invitación ya fue respondida" }, { status: 409 });
  }

  invitation.status = status;
  invitation.respondedAt = new Date();
  invitation.guestName = guestName?.trim() ?? invitation.guestName;
  invitation.companions = typeof companions === "number" ? Math.max(0, companions) : 0;
  invitation.song = song?.trim() ?? undefined;
  invitation.message = message?.trim() ?? undefined;
  await invitation.save();

  // Send notification (non-blocking — don't fail RSVP if email fails)
  sendConfirmationNotification({
    guestName: invitation.guestName ?? invitation.email,
    email: invitation.email,
    status: invitation.status as "accepted" | "declined",
    companions: invitation.companions,
    song: invitation.song,
    message: invitation.message,
  }).catch(console.error);

  return NextResponse.json({ ok: true, status: invitation.status });
}
