import { prisma } from "./db";

export interface LogAuditOptions {
  adminId?: string | null;
  adminEmail?: string | null;
  action:
    | "LOGIN"
    | "LOGOUT"
    | "DOCUMENT_VIEW"
    | "DOCUMENT_DOWNLOAD"
    | "STATUS_CHANGE"
    | "APPLICANT_DELETE"
    | "APPLICANT_UPDATE"
    | "CONTENT_UPDATE"
    | "SETTINGS_UPDATE";
  entityType: "APPLICANT" | "APPLICANT_DOCUMENT" | "CENTRE" | "VISA_TYPE" | "ANNOUNCEMENT" | "SERVICE" | "SETTING" | "USER";
  entityId?: string | null;
  metadata?: Record<string, unknown> | string;
  ipAddress?: string;
}

export async function recordAuditLog(options: LogAuditOptions) {
  try {
    const serializedMeta =
      typeof options.metadata === "object"
        ? JSON.stringify(options.metadata)
        : options.metadata || null;

    await prisma.auditLog.create({
      data: {
        adminId: options.adminId || null,
        adminEmail: options.adminEmail || null,
        action: options.action,
        entityType: options.entityType,
        entityId: options.entityId || null,
        metadata: serializedMeta,
        ipAddress: options.ipAddress || null,
      },
    });
  } catch (err) {
    // Fail-safe: Audit log failure shouldn't crash the main process, but log to stderr
    console.error("Failed to write audit log:", err);
  }
}
