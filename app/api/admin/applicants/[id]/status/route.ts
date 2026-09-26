import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { StatusUpdateSchema } from "@/lib/validation";
import { recordAuditLog } from "@/lib/audit";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (admin.role === "VIEWER") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Viewer accounts cannot modify application status." },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();

    const parseResult = StatusUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status update payload.", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { status, note } = parseResult.data;

    const applicant = await prisma.applicant.findUnique({
      where: { id },
    });

    if (!applicant) {
      return NextResponse.json({ success: false, error: "Applicant not found." }, { status: 404 });
    }

    const oldStatus = applicant.status;

    // Update applicant
    const updated = await prisma.applicant.update({
      where: { id },
      data: { status },
    });

    // Create history
    await prisma.applicationStatusHistory.create({
      data: {
        applicantId: id,
        oldStatus,
        newStatus: status,
        changedBy: admin.email,
        note: note?.trim() || `Status updated from ${oldStatus} to ${status}.`,
      },
    });

    // Record audit log
    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "STATUS_CHANGE",
      entityType: "APPLICANT",
      entityId: id,
      metadata: {
        referenceNumber: applicant.referenceNumber,
        oldStatus,
        newStatus: status,
        note,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully.",
      status: updated.status,
    });
  } catch (err) {
    console.error("Status update error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
