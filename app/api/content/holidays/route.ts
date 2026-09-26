import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const holidays = await prisma.holiday.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ success: true, holidays });
  } catch (err) {
    console.error("Fetch holidays error:", err);
    return NextResponse.json({ success: false, holidays: [] }, { status: 500 });
  }
}
