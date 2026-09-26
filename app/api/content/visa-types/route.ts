import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const visaTypes = await prisma.visaType.findMany({
      where: { isActive: true },
      include: {
        categories: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { code: "asc" },
    });
    return NextResponse.json({ success: true, visaTypes });
  } catch (err) {
    console.error("Fetch visa types error:", err);
    return NextResponse.json({ success: false, visaTypes: [] }, { status: 500 });
  }
}
