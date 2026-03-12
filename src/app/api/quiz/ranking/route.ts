import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import QuizResult from "@/lib/models/QuizResult";
import { verifyToken } from "@/lib/auth";
import type { PipelineStage } from "mongoose";

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

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

// GET /api/quiz/ranking
// Public: returns top 20 with masked email
// Admin (with cookie): returns full data
export async function GET() {
  await connectDB();
  const admin = await isAdmin();

  // Aggregate: per email, keep best score and the name from that attempt
  const pipeline: PipelineStage[] = [
    { $sort: { score: -1, completedAt: 1 } } as PipelineStage,
    {
      $group: {
        _id: "$email",
        name: { $first: "$name" },
        bestScore: { $max: "$score" },
        totalQuestions: { $first: "$totalQuestions" },
        attempts: { $sum: 1 },
        completedAt: { $min: "$completedAt" },
        email: { $first: "$email" },
      },
    },
    { $sort: { bestScore: -1, completedAt: 1 } } as PipelineStage,
    { $limit: 50 },
  ];

  const raw = await QuizResult.aggregate(pipeline);

  const ranking = raw.map((entry, i) => ({
    position: i + 1,
    name: entry.name as string,
    email: admin ? (entry.email as string) : maskEmail(entry.email as string),
    bestScore: entry.bestScore as number,
    totalQuestions: entry.totalQuestions as number,
    attempts: entry.attempts as number,
    completedAt: entry.completedAt as Date,
  }));

  return NextResponse.json(ranking);
}
