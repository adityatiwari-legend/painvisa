import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { HolidaySchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const holidays = await prisma.holiday.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ success: true, holidays });
  } catch (err) {
    console.error("Admin fetch holidays error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const parsed = HolidaySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid holiday data", details: parsed.error.flatten() }, { status: 400 });
    }

    const holiday = await prisma.holiday.create({
      data: {
        country: parsed.data.country,
        year: parsed.data.year,
        date: new Date(parsed.data.date),
        name: parsed.data.name,
        description: parsed.data.description,
        isActive: parsed.data.isActive,
      },
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "SERVICE", // generic content
      entityId: holiday.id,
      metadata: { name: holiday.name, country: holiday.country },
    });

    return NextResponse.json({ success: true, holiday });
  } catch (err) {
    console.error("Create holiday error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
