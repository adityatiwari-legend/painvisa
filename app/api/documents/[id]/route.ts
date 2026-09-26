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
    const { id } = await context.params;

    // 1. Authorize: Admin only
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Authentication required to access applicant documents." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get("download") === "1";

    // Policy: Viewer role check for sensitive download
    if (isDownload && admin.role === "VIEWER") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Viewer accounts are not authorized to download raw identity documents." },
        { status: 403 }
      );
    }

    // 2. Fetch document metadata from DB
    const doc = await prisma.applicantDocument.findUnique({
      where: { id },
      include: {
        applicant: {
          select: { id: true, referenceNumber: true, name: true },
        },
      },
    });

    if (!doc) {
      return NextResponse.json(
        { success: false, error: "Requested document not found." },
        { status: 404 }
      );
    }

    // 3. Read buffer via storage provider
    const fileBuffer = await storageProvider.read(doc.storagePath);

    // 4. Record audit log
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    await recordAuditLog({
      adminId: admin.sub,
      adminEmail: admin.email,
      action: isDownload ? "DOCUMENT_DOWNLOAD" : "DOCUMENT_VIEW",
      entityType: "APPLICANT_DOCUMENT",
      entityId: doc.id,
      metadata: {
        applicantReference: doc.applicant.referenceNumber,
        documentType: doc.type,
        mimeType: doc.mimeType,
        sizeBytes: doc.size,
      },
      ipAddress: clientIp,
    });

    // 5. Build secure response
    const disposition = isDownload
      ? `attachment; filename="${doc.type.toLowerCase()}-${doc.applicant.referenceNumber}${doc.storagePath.slice(doc.storagePath.lastIndexOf("."))}"`
      : "inline";

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": doc.mimeType,
        "Content-Disposition": disposition,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("Document retrieval error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to retrieve document." },
      { status: 500 }
    );
  }
}
