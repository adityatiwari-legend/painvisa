import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: "asc" },
    });
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("Admin fetch settings error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role !== "SUPER_ADMIN" && admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { key, value, description } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: "Key and value are required" }, { status: 400 });
    }

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value, ...(description ? { description } : {}) },
      create: { key, value, description },
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "SETTINGS_UPDATE",
      entityType: "SETTING",
      entityId: key,
      metadata: { key, value },
    });

    return NextResponse.json({ success: true, setting });
  } catch (err) {
    console.error("Save setting error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
