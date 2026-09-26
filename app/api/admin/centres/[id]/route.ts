import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { CentreSchema } from "@/lib/validation";
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
    const parsed = CentreSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.centre.update({
      where: { id },
      data: parsed.data,
    });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "CENTRE",
      entityId: id,
    });

    return NextResponse.json({ success: true, centre: updated });
  } catch (err) {
    console.error("Update centre error:", err);
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
    await prisma.centre.delete({ where: { id } });

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "CONTENT_UPDATE",
      entityType: "CENTRE",
      entityId: id,
      metadata: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete centre error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
