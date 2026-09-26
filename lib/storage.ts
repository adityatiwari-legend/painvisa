import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const STORAGE_ROOT = path.join(process.cwd(), "storage");
const MAX_UPLOAD_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB || "5", 10);
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * Validates file signature (magic bytes) to ensure file content actually matches image formats.
 */
export function validateImageMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return true;
  }

  // WEBP: "RIFF" .... "WEBP"
  const riff = buffer.toString("ascii", 0, 4);
  const webp = buffer.toString("ascii", 8, 12);
  if (riff === "RIFF" && webp === "WEBP") {
    return true;
  }

  return false;
}

export interface StorageSaveOptions {
  applicantId: string;
  type: "THUMB" | "PASSPORT" | "AADHAAR";
  buffer: Buffer;
  mimeType: string;
  originalName: string;
}

export interface StorageSaveResult {
  storedName: string;
  storagePath: string; // relative to STORAGE_ROOT to prevent filesystem leaks
  size: number;
  mimeType: string;
}

export interface IStorageProvider {
  save(options: StorageSaveOptions): Promise<StorageSaveResult>;
  read(relativeStoragePath: string): Promise<Buffer>;
  delete(relativeStoragePath: string): Promise<void>;
}

class LocalSecureStorageProvider implements IStorageProvider {
  private ensureInitialized = false;

  private async initRoot() {
    if (!this.ensureInitialized) {
      await fs.mkdir(STORAGE_ROOT, { recursive: true });
      this.ensureInitialized = true;
    }
  }

  private resolveSafePath(relativeStoragePath: string): string {
    // Prevent directory traversal attacks
    const normalizedRelative = path.normalize(relativeStoragePath).replace(/^(\.\.(\/|\\|$))+/, "");
    const absolutePath = path.resolve(STORAGE_ROOT, normalizedRelative);

    if (!absolutePath.startsWith(STORAGE_ROOT)) {
      throw new Error("Security violation: Directory traversal detected.");
    }
    return absolutePath;
  }

  async save(options: StorageSaveOptions): Promise<StorageSaveResult> {
    await this.initRoot();

    const { applicantId, type, buffer, mimeType, originalName } = options;

    // 1. File size check
    if (buffer.length > MAX_UPLOAD_BYTES) {
      throw new Error(`File exceeds maximum permitted size of ${MAX_UPLOAD_MB}MB.`);
    }

    // 2. MIME type check
    const normalizedMime = mimeType.toLowerCase();
    if (!ALLOWED_MIME_TYPES.includes(normalizedMime as AllowedMimeType)) {
      throw new Error("Invalid file format. Only JPEG, PNG, and WebP images are permitted.");
    }

    // 3. Magic bytes / header inspection
    if (!validateImageMagicBytes(buffer)) {
      throw new Error("Security error: Uploaded file content does not match genuine image data.");
    }

    // 4. Generate randomized UUID filename
    const ext = MIME_TO_EXT[normalizedMime] || ".jpg";
    const uuid = crypto.randomUUID();
    const storedName = `${uuid}${ext}`;

    // Target directory: STORAGE_ROOT/applicants/{applicantId}/{type.toLowerCase()}
    const targetDirRelative = path.join("applicants", applicantId, type.toLowerCase());
    const targetDirAbsolute = path.resolve(STORAGE_ROOT, targetDirRelative);

    await fs.mkdir(targetDirAbsolute, { recursive: true });

    const fileRelativePath = path.join(targetDirRelative, storedName);
    const fileAbsolutePath = path.resolve(STORAGE_ROOT, fileRelativePath);

    await fs.writeFile(fileAbsolutePath, buffer, { mode: 0o600 }); // owner read/write only

    return {
      storedName,
      storagePath: fileRelativePath.replace(/\\/g, "/"), // store normalized posix path in DB
      size: buffer.length,
      mimeType: normalizedMime,
    };
  }

  async read(relativeStoragePath: string): Promise<Buffer> {
    const absolutePath = this.resolveSafePath(relativeStoragePath);
    return await fs.readFile(absolutePath);
  }

  async delete(relativeStoragePath: string): Promise<void> {
    try {
      const absolutePath = this.resolveSafePath(relativeStoragePath);
      await fs.unlink(absolutePath);
    } catch (err: unknown) {
      const nodeError = err as NodeJS.ErrnoException;
      if (nodeError.code !== "ENOENT") {
        throw err;
      }
    }
  }
}

// Export singleton instance of storage provider (migratable to S3/MinIO by swapping class)
export const storageProvider: IStorageProvider = new LocalSecureStorageProvider();
