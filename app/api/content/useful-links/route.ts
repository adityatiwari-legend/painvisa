import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_USEFUL_LINKS } from "@/lib/mock-data";

export async function GET() {
  try {
    const usefulLinks = await prisma.usefulLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    if (usefulLinks && usefulLinks.length > 0) {
      return NextResponse.json({ success: true, usefulLinks });
    }
    return NextResponse.json({ success: true, usefulLinks: DEFAULT_USEFUL_LINKS });
  } catch (err) {
    return NextResponse.json({ success: true, usefulLinks: DEFAULT_USEFUL_LINKS });
  }
}
