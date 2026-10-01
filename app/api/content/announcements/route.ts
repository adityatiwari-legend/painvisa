import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_ANNOUNCEMENTS } from "@/lib/mock-data";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    if (announcements && announcements.length > 0) {
      return NextResponse.json({ success: true, announcements });
    }
    return NextResponse.json({ success: true, announcements: DEFAULT_ANNOUNCEMENTS });
  } catch (err) {
    return NextResponse.json({ success: true, announcements: DEFAULT_ANNOUNCEMENTS });
  }
}
