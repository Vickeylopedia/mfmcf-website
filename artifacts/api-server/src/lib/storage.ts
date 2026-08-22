import { createReadStream, existsSync } from "node:fs";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";

/**
 * File storage for admin uploads. Two backends:
 * - Replit Object Storage when running on Replit (REPL_ID set) — persists
 *   across autoscale redeploys.
 * - A local uploads/ directory otherwise (development).
 *
 * Files are exposed publicly through GET /api/files/<key>.
 */

const UPLOAD_ROOT = path.resolve(import.meta.dirname, "..", "uploads");

const onReplit = process.env.REPL_ID !== undefined;

let replitClient: import("@replit/object-storage").Client | null = null;
async function getReplitClient() {
  if (!replitClient) {
    const { Client } = await import("@replit/object-storage");
    replitClient = new Client();
  }
  return replitClient;
}

const localPath = (key: string) => path.join(UPLOAD_ROOT, key);

export const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
};

export const contentTypeFor = (key: string) =>
  CONTENT_TYPES[path.extname(key).toLowerCase()] ?? "application/octet-stream";

export async function putObject(
  key: string,
  bytes: Buffer,
): Promise<string> {
  if (onReplit) {
    const client = await getReplitClient();
    const result = await client.uploadFromBytes(key, bytes);
    if (!result.ok) {
      throw new Error(`Object storage upload failed: ${String(result.error)}`);
    }
    return key;
  }
  const target = localPath(key);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return key;
}

export async function getObject(
  key: string,
): Promise<{ stream: Readable; contentType: string } | null> {
  if (onReplit) {
    const client = await getReplitClient();
    const exists = await client.exists(key);
    if (!exists.ok || !exists.value) return null;
    return {
      stream: client.downloadAsStream(key),
      contentType: contentTypeFor(key),
    };
  }
  const target = localPath(key);
  if (!existsSync(target)) return null;
  return {
    stream: createReadStream(target),
    contentType: contentTypeFor(key),
  };
}

export async function deleteObject(key: string): Promise<void> {
  try {
    if (onReplit) {
      const client = await getReplitClient();
      await client.delete(key, { ignoreNotFound: true });
      return;
    }
    await unlink(localPath(key));
  } catch {
    // Missing objects are fine to "delete".
  }
}

/** Reads a stored object; only used by tooling (seed), not request paths. */
export async function readObject(key: string): Promise<Buffer | null> {
  if (onReplit) {
    const client = await getReplitClient();
    const result = await client.downloadAsBytes(key);
    return result.ok ? result.value[0] : null;
  }
  const target = localPath(key);
  if (!existsSync(target)) return null;
  return readFile(target);
}

export const fileUrl = (key: string) => `/api/files/${key}`;
