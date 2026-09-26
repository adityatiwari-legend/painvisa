import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { HolidaySchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await context.params;
    const body = await req.json();
    const parsed = HolidaySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...parsed.data };
    if (parsed.data.date) {
      updateData.date = new Date(parsed.data.date);
    }

    const updated = await prisma.holiday.update({
      where: { id },
      data: updateData,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "SERVICE",
      entityId: id,
    });

    return NextResponse.json({ success: true, holiday: updated });
  } catch (err) {
    console.error("Update holiday error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

    const { id } = await context.params;
    await prisma.holiday.delete({ where: { id } });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "SERVICE",
      entityId: id,
      metadata: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete holiday error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
