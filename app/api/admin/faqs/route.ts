import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { FAQSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const faqs = await prisma.fAQ.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    });
    return NextResponse.json({ success: true, faqs });
  } catch (err) {
    console.error("Admin fetch faqs error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = FAQSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid FAQ data", details: parsed.error.flatten() }, { status: 400 });
    }

    const faq = await prisma.fAQ.create({
      data: parsed.data,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "SERVICE",
      entityId: faq.id,
      metadata: { question: faq.question },
    });

    return NextResponse.json({ success: true, faq });
  } catch (err) {
    console.error("Create faq error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
