import { createReadStream, existsSync } from "node:fs";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

/**
 * Multi-backend file storage for uploads:
 * 1. Cloudflare R2 / S3 (production on Render or any cloud host when R2_* or S3_* env vars are present)
 * 2. Replit Object Storage (when running on Replit with REPL_ID set)
 * 3. Local filesystem uploads/ (development fallback)
 *
 * Files are exposed publicly through GET /api/files/<key>.
 */

const UPLOAD_ROOT = path.resolve(import.meta.dirname, "..", "uploads");

const r2Bucket = process.env.R2_BUCKET_NAME || process.env.S3_BUCKET_NAME;
const r2AccessKey = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY_ID;
const r2SecretKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || process.env.S3_SECRET_ACCESS_KEY;
const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2Endpoint =
  process.env.R2_ENDPOINT ||
  process.env.S3_ENDPOINT ||
  (r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : undefined);

export const onR2 = Boolean(r2Bucket && r2AccessKey && r2SecretKey);
const onReplit = process.env.REPL_ID !== undefined;

let s3Client: S3Client | null = null;
function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.R2_REGION || process.env.AWS_REGION || "auto",
      endpoint: r2Endpoint,
      credentials: {
        accessKeyId: r2AccessKey || "",
        secretAccessKey: r2SecretKey || "",
      },
    });
  }
  return s3Client;
}

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
  const contentType = contentTypeFor(key);

  if (onR2 && r2Bucket) {
    const client = getS3Client();
    await client.send(
      new PutObjectCommand({
        Bucket: r2Bucket,
        Key: key,
        Body: bytes,
        ContentType: contentType,
      }),
    );
    return key;
  }

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

export async function getObjectInfo(
  key: string,
): Promise<{ size: number; contentType: string } | null> {
  const contentType = contentTypeFor(key);

  if (onR2 && r2Bucket) {
    try {
      const client = getS3Client();
      const res = await client.send(
        new HeadObjectCommand({
          Bucket: r2Bucket,
          Key: key,
        }),
      );
      return {
        size: res.ContentLength ?? 0,
        contentType: res.ContentType || contentType,
      };
    } catch {
      return null;
    }
  }

  if (onReplit) {
    const client = await getReplitClient();
    const exists = await client.exists(key);
    if (!exists.ok || !exists.value) return null;
    return { size: 0, contentType };
  }

  const target = localPath(key);
  if (!existsSync(target)) return null;
  try {
    const s = await stat(target);
    return { size: s.size, contentType };
  } catch {
    return null;
  }
}

export async function getObjectStream(
  key: string,
  range?: { start: number; end: number },
): Promise<Readable | null> {
  if (onR2 && r2Bucket) {
    try {
      const client = getS3Client();
      const res = await client.send(
        new GetObjectCommand({
          Bucket: r2Bucket,
          Key: key,
          Range: range ? `bytes=${range.start}-${range.end}` : undefined,
        }),
      );
      if (!res.Body) return null;
      return res.Body as Readable;
    } catch {
      return null;
    }
  }

  if (onReplit) {
    const client = await getReplitClient();
    const exists = await client.exists(key);
    if (!exists.ok || !exists.value) return null;
    return client.downloadAsStream(key);
  }

  const target = localPath(key);
  if (!existsSync(target)) return null;
  if (range) {
    return createReadStream(target, { start: range.start, end: range.end });
  }
  return createReadStream(target);
}

export async function getObject(
  key: string,
): Promise<{ stream: Readable; contentType: string } | null> {
  if (onR2 && r2Bucket) {
    try {
      const client = getS3Client();
      const res = await client.send(
        new GetObjectCommand({
          Bucket: r2Bucket,
          Key: key,
        }),
      );
      if (!res.Body) return null;
      return {
        stream: res.Body as Readable,
        contentType: res.ContentType || contentTypeFor(key),
      };
    } catch {
      return null;
    }
  }

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
    if (onR2 && r2Bucket) {
      const client = getS3Client();
      await client.send(
        new DeleteObjectCommand({
          Bucket: r2Bucket,
          Key: key,
        }),
      );
      return;
    }

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

/** Reads a stored object; used by tooling/seed or file checks. */
export async function readObject(key: string): Promise<Buffer | null> {
  if (onR2 && r2Bucket) {
    try {
      const client = getS3Client();
      const res = await client.send(
        new GetObjectCommand({
          Bucket: r2Bucket,
          Key: key,
        }),
      );
      if (!res.Body) return null;
      const byteArray = await (res.Body as { transformToByteArray?: () => Promise<Uint8Array> }).transformToByteArray?.();
      return byteArray ? Buffer.from(byteArray) : null;
    } catch {
      return null;
    }
  }

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

