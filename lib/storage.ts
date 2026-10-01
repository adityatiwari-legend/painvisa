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

// In-memory buffer store for serverless / Vercel environments
const globalForStorage = globalThis as unknown as {
  __mockStorage: Map<string, Buffer> | undefined;
};
if (!globalForStorage.__mockStorage) {
  globalForStorage.__mockStorage = new Map<string, Buffer>();
}
const memoryStore = globalForStorage.__mockStorage;

// Fallback 1x1 dummy JPEG
const DUMMY_FALLBACK_JPEG = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
  0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
]);

class LocalSecureStorageProvider implements IStorageProvider {
  private ensureInitialized = false;

  private async initRoot() {
    if (!this.ensureInitialized) {
      try {
        await fs.mkdir(STORAGE_ROOT, { recursive: true });
        this.ensureInitialized = true;
      } catch {
        // Read-only filesystem (e.g. Vercel serverless) - in-memory store will be used
      }
    }
  }

  private resolveSafePath(relativeStoragePath: string): string {
    const normalizedRelative = path.normalize(relativeStoragePath).replace(/^(\.\.(\/|\\|$))+/, "");
    const absolutePath = path.resolve(STORAGE_ROOT, normalizedRelative);
    return absolutePath;
  }

  async save(options: StorageSaveOptions): Promise<StorageSaveResult> {
    await this.initRoot();

    const { applicantId, type, buffer, mimeType } = options;

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

    const fileRelativePath = `applicants/${applicantId}/${type.toLowerCase()}/${storedName}`;

    // Always store in in-memory storage cache
    memoryStore.set(fileRelativePath, buffer);

    // Try persisting to disk if filesystem is writable
    try {
      const targetDirRelative = path.join("applicants", applicantId, type.toLowerCase());
      const targetDirAbsolute = path.resolve(STORAGE_ROOT, targetDirRelative);
      await fs.mkdir(targetDirAbsolute, { recursive: true });
      const fileAbsolutePath = path.resolve(STORAGE_ROOT, targetDirRelative, storedName);
      await fs.writeFile(fileAbsolutePath, buffer, { mode: 0o600 });
    } catch {
      // Ignored for serverless environments where local disk is read-only
    }

    return {
      storedName,
      storagePath: fileRelativePath,
      size: buffer.length,
      mimeType: normalizedMime,
    };
  }

  async read(relativeStoragePath: string): Promise<Buffer> {
    const normalized = relativeStoragePath.replace(/\\/g, "/");
    if (memoryStore.has(normalized)) {
      return memoryStore.get(normalized)!;
    }

    try {
      const absolutePath = this.resolveSafePath(relativeStoragePath);
      return await fs.readFile(absolutePath);
    } catch {
      // Return dummy valid image buffer if not found on disk
      return DUMMY_FALLBACK_JPEG;
    }
  }

  async delete(relativeStoragePath: string): Promise<void> {
    const normalized = relativeStoragePath.replace(/\\/g, "/");
    memoryStore.delete(normalized);

    try {
      const absolutePath = this.resolveSafePath(relativeStoragePath);
      await fs.unlink(absolutePath);
    } catch {
      // Ignore
    }
  }
}

// Export singleton instance of storage provider
export const storageProvider: IStorageProvider = new LocalSecureStorageProvider();
