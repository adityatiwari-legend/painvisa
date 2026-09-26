import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const usefulLinks = await prisma.usefulLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, usefulLinks });
  } catch (err) {
    console.error("Fetch useful links error:", err);
    return NextResponse.json({ success: false, usefulLinks: [] }, { status: 500 });
  }
}
