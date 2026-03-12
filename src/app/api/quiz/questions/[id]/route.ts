import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import QuizQuestion from "@/lib/models/QuizQuestion";
import { verifyToken } from "@/lib/auth";

async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return false;
    const payload = await verifyToken(session);
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// GET /api/quiz/questions/[id] — admin only, returns question WITH correctIndex
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await connectDB();
  const { id } = await params;
  const question = await QuizQuestion.findById(id).lean();
  if (!question) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(question);
}

// PUT /api/quiz/questions/[id] — admin only
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const body = await request.json();
  const { text, options, correctIndex, order, active } = body;

  if (
    !text?.es || !text?.en || !text?.fr ||
    !Array.isArray(options) || options.length < 2 ||
    typeof correctIndex !== "number" ||
    correctIndex < 0 || correctIndex >= options.length
  ) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const updated = await QuizQuestion.findByIdAndUpdate(
    id,
    { text, options, correctIndex, order: order ?? 0, active: active !== false },
    { new: true }
  ).lean();

  if (!updated) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/quiz/questions/[id] — admin only
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;
  const deleted = await QuizQuestion.findByIdAndDelete(id).lean();
  if (!deleted) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
