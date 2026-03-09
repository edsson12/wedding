import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Invitation from "@/lib/models/Invitation";

export async function GET() {
  await connectDB();

  const [total, accepted, declined, pending] = await Promise.all([
    Invitation.countDocuments(),
    Invitation.countDocuments({ status: "accepted" }),
    Invitation.countDocuments({ status: "declined" }),
    Invitation.countDocuments({ status: "pending" }),
  ]);

  // Total guests = accepted guests + their companions
  const companionsAgg = await Invitation.aggregate([
    { $match: { status: "accepted" } },
    { $group: { _id: null, total: { $sum: "$companions" } } },
  ]);
  const totalCompanions = companionsAgg[0]?.total ?? 0;
  const totalGuests = accepted + totalCompanions;

  return NextResponse.json({ total, accepted, declined, pending, totalGuests });
}
