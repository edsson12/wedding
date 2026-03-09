import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Invitation from "@/lib/models/Invitation";
import { sendInvitationEmail } from "@/lib/resend";
import { randomBytes } from "crypto";

// GET /api/invitations?status=pending&search=name
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: Record<string, any> = {};
  if (status && status !== "all") query.status = status;
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { guestName: { $regex: search, $options: "i" } },
    ];
  }

  const invitations = await Invitation.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(invitations);
}

// POST /api/invitations  body: { emails: string[] }
export async function POST(request: Request) {
  await connectDB();
  const { emails } = await request.json();

  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "emails array required" }, { status: 400 });
  }

  const results: Array<{ email: string; status: "sent" | "skipped" | "error"; reason?: string }> = [];

  for (const rawEmail of emails) {
    const email = String(rawEmail).toLowerCase().trim();
    if (!email || !email.includes("@")) {
      results.push({ email, status: "skipped", reason: "invalid email" });
      continue;
    }

    const existing = await Invitation.findOne({ email });
    if (existing) {
      results.push({ email, status: "skipped", reason: "already invited" });
      continue;
    }

    const token = randomBytes(32).toString("hex");
    try {
      await Invitation.create({ email, token });
      await sendInvitationEmail(email, token);
      results.push({ email, status: "sent" });
    } catch (err) {
      results.push({ email, status: "error", reason: String(err) });
    }
  }

  return NextResponse.json({ results });
}
