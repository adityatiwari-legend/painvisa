import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_FAQS } from "@/lib/mock-data";

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (faqs && faqs.length > 0) {
      return NextResponse.json({ success: true, faqs });
    }
    return NextResponse.json({ success: true, faqs: DEFAULT_FAQS });
  } catch (err) {
    return NextResponse.json({ success: true, faqs: DEFAULT_FAQS });
  }
}
