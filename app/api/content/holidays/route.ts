import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_HOLIDAYS } from "@/lib/mock-data";

export async function GET() {
  try {
    const holidays = await prisma.holiday.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
    });
    if (holidays && holidays.length > 0) {
      return NextResponse.json({ success: true, holidays });
    }
    return NextResponse.json({ success: true, holidays: DEFAULT_HOLIDAYS });
  } catch (err) {
    return NextResponse.json({ success: true, holidays: DEFAULT_HOLIDAYS });
  }
}
