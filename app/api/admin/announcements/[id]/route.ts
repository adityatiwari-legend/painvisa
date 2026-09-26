import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { AnnouncementSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (admin.role === "VIEWER") {
      return NextResponse.json({ success: false, error: "Forbidden for viewer" }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const parsed = AnnouncementSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid payload", details: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: parsed.data,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "ANNOUNCEMENT",
      entityId: id,
    });

    return NextResponse.json({ success: true, announcement: updated });
  } catch (err) {
    console.error("Update announcement error:", err);
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
    if (admin.role === "VIEWER") {
      return NextResponse.json({ success: false, error: "Forbidden for viewer" }, { status: 403 });
    }

    const { id } = await context.params;
    await prisma.announcement.delete({ where: { id } });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "ANNOUNCEMENT",
      entityId: id,
      metadata: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete announcement error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
