import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

/**
 * Single-password admin auth: a signed session token in an httpOnly cookie.
 * The token is an expiry timestamp plus an HMAC keyed by a digest of the
 * admin password, so changing the password invalidates existing sessions.
 *
 * Requires ADMIN_PASSWORD in the environment; admin endpoints return 503
 * until it is set.
 */

export const ADMIN_COOKIE = "mfmcf_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const adminPassword = () => process.env.ADMIN_PASSWORD ?? null;

const hmacKey = () =>
  crypto.createHash("sha256").update(adminPassword() ?? "").digest();

function sign(expiresAt: number): string {
  return crypto
    .createHmac("sha256", hmacKey())
    .update(String(expiresAt))
    .digest("hex");
}

export function issueToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !adminPassword()) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const expiresAt = Number(token.slice(0, dot));
  const signature = token.slice(dot + 1);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  const expected = sign(expiresAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function isAdminConfigured(): boolean {
  return adminPassword() !== null;
}

export function checkPassword(candidate: string): boolean {
  const expected = adminPassword();
  if (expected === null) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!isAdminConfigured()) {
    res.status(503).json({ message: "Admin access is not configured" });
    return;
  }
  if (!verifyToken(req.cookies?.[ADMIN_COOKIE])) {
    res.status(401).json({ message: "Admin sign-in required" });
    return;
  }
  next();
}
