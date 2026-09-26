import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, announcements });
  } catch (err) {
    console.error("Fetch announcements error:", err);
    return NextResponse.json({ success: false, announcements: [] }, { status: 500 });
  }
}
