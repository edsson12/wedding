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

// GET /api/quiz/questions
// - Admin (with session cookie): returns ALL questions WITH correctIndex
// - Public: returns only active questions WITHOUT correctIndex
export async function GET() {
  await connectDB();
  const admin = await isAdmin();

  if (admin) {
    const questions = await QuizQuestion.find({})
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return NextResponse.json(questions);
  }

  const questions = await QuizQuestion.find({ active: true })
    .sort({ order: 1, createdAt: 1 })
    .select("-correctIndex")
    .lean();
  return NextResponse.json(questions);
}

// POST /api/quiz/questions — admin only, creates a new question
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await connectDB();
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

  const question = await QuizQuestion.create({
    text,
    options,
    correctIndex,
    order: order ?? 0,
    active: active !== false,
  });

  return NextResponse.json(question, { status: 201 });
}
