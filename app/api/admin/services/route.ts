import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { AdditionalServiceSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const services = await prisma.additionalService.findMany({
      orderBy: { price: "asc" },
    });
    return NextResponse.json({ success: true, services });
  } catch (err) {
    console.error("Admin services fetch error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = AdditionalServiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const service = await prisma.additionalService.create({
      data: parsed.data,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "SERVICE",
      entityId: service.id,
      metadata: { title: service.title, price: service.price },
    });

    return NextResponse.json({ success: true, service });
  } catch (err) {
    console.error("Create service error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
