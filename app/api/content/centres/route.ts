import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_CENTRES } from "@/lib/mock-data";

export async function GET() {
  try {
    const centres = await prisma.centre.findMany({
      where: { isActive: true },
      orderBy: [{ country: "asc" }, { name: "asc" }],
    });
    if (centres && centres.length > 0) {
      return NextResponse.json({ success: true, centres });
    }
    return NextResponse.json({ success: true, centres: DEFAULT_CENTRES });
  } catch (err) {
    // Return demo centres on Vercel without database
    return NextResponse.json({ success: true, centres: DEFAULT_CENTRES });
  }
}
