import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return NextResponse.json({ success: true, faqs });
  } catch (err) {
    console.error("Fetch faqs error:", err);
    return NextResponse.json({ success: false, faqs: [] }, { status: 500 });
  }
}
