import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { storageProvider } from "@/lib/storage";
import { recordAuditLog } from "@/lib/audit";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: {
        documents: {
          select: {
            id: true,
            type: true,
            originalName: true,
            mimeType: true,
            size: true,
            createdAt: true,
          },
        },
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!applicant) {
      return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      applicant,
    });
  } catch (err) {
    console.error("Get applicant detail error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (admin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Only Super Administrators can delete applicant records." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: { documents: true },
    });

    if (!applicant) {
      return NextResponse.json({ success: false, error: "Applicant not found" }, { status: 404 });
    }

    // Clean up physical document files
    for (const doc of applicant.documents) {
      try {
        await storageProvider.delete(doc.storagePath);
      } catch (err) {
        console.warn(`Could not delete storage file ${doc.storagePath}:`, err);
      }
    }

    // Delete from DB (cascades to documents and statusHistory)
    await prisma.applicant.delete({ where: { id } });

    // Record audit log
    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: "APPLICANT_DELETE",
      entityType: "APPLICANT",
      entityId: id,
      metadata: { referenceNumber: applicant.referenceNumber, name: applicant.name },
    });

    return NextResponse.json({
      success: true,
      message: "Applicant and associated secure files successfully deleted.",
    });
  } catch (err) {
    console.error("Delete applicant error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
