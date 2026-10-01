import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_VISA_TYPES } from "@/lib/mock-data";

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
    if (visaTypes && visaTypes.length > 0) {
      return NextResponse.json({ success: true, visaTypes });
    }
    return NextResponse.json({ success: true, visaTypes: DEFAULT_VISA_TYPES });
  } catch (err) {
    // Return demo visa types on Vercel without database
    return NextResponse.json({ success: true, visaTypes: DEFAULT_VISA_TYPES });
  }
}
