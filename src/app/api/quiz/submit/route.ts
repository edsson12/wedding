import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Invitation from "@/lib/models/Invitation";
import QuizQuestion from "@/lib/models/QuizQuestion";
import QuizResult from "@/lib/models/QuizResult";

const MAX_ATTEMPTS = 2;

// POST /api/quiz/submit
// body: { email: string, name: string, answers: number[] }
export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const { email: rawEmail, name: rawName, answers } = body;

  const email = String(rawEmail ?? "").toLowerCase().trim();
  const name = String(rawName ?? "").trim();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }
  if (!Array.isArray(answers)) {
    return NextResponse.json({ error: "Respuestas inválidas" }, { status: 400 });
  }

  // Validate the email is an invited guest who has responded
  const invitation = await Invitation.findOne({ email }).lean();
  if (!invitation) {
    return NextResponse.json(
      { error: "Este correo no está en la lista de invitados." },
      { status: 403 }
    );
  }
  if (invitation.status === "pending") {
    return NextResponse.json(
      { error: "Aún no has confirmado tu asistencia. Confirma primero y luego vuelve al quiz." },
      { status: 403 }
    );
  }

  // Check attempt count
  const previousAttempts = await QuizResult.find({ email }).sort({ attempt: 1 }).lean();
  if (previousAttempts.length >= MAX_ATTEMPTS) {
    const best = Math.max(...previousAttempts.map((r) => r.score));
    const total = previousAttempts[0]?.totalQuestions ?? 0;
    return NextResponse.json(
      { error: "Ya has agotado tus intentos.", alreadyDone: true, bestScore: best, totalQuestions: total },
      { status: 409 }
    );
  }

  // Load active questions WITH correctIndex (server-side only)
  const questions = await QuizQuestion.find({ active: true })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  if (questions.length === 0) {
    return NextResponse.json({ error: "El quiz no tiene preguntas activas." }, { status: 503 });
  }

  // Calculate score
  let score = 0;
  const trimmedAnswers = answers.slice(0, questions.length);
  for (let i = 0; i < questions.length; i++) {
    if (trimmedAnswers[i] === questions[i].correctIndex) score++;
  }

  const attempt = previousAttempts.length + 1;
  await QuizResult.create({
    email,
    name,
    score,
    totalQuestions: questions.length,
    attempt,
    answers: trimmedAnswers,
  });

  const allAttempts = [...previousAttempts.map((r) => r.score), score];
  const bestScore = Math.max(...allAttempts);

  return NextResponse.json({
    score,
    totalQuestions: questions.length,
    attempt,
    bestScore,
    attemptsLeft: MAX_ATTEMPTS - attempt,
  });
}

// GET /api/quiz/submit?email=xxx — check status of a given email
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.toLowerCase().trim();

  if (!email) return NextResponse.json({ attempts: 0, bestScore: null });

  const results = await QuizResult.find({ email }).sort({ attempt: 1 }).lean();
  if (results.length === 0) return NextResponse.json({ attempts: 0, bestScore: null });

  const bestScore = Math.max(...results.map((r) => r.score));
  const totalQuestions = results[0].totalQuestions;
  return NextResponse.json({
    attempts: results.length,
    bestScore,
    totalQuestions,
    attemptsLeft: MAX_ATTEMPTS - results.length,
    name: results[0].name,
  });
}
