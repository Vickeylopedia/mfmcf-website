import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL) {
  const currentDir = typeof __dirname !== "undefined" ? __dirname : (import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url)));
  for (const envPath of [
    path.resolve(process.cwd(), ".env"),
    path.resolve(currentDir, "./.env"),
    path.resolve(currentDir, "../.env"),
    path.resolve(currentDir, "../../.env"),
    path.resolve(currentDir, "../../../.env"),
  ]) {
    if (fs.existsSync(envPath)) {
      try {
        if (typeof process.loadEnvFile === "function") {
          process.loadEnvFile(envPath);
        }
        if (process.env.DATABASE_URL) break;
      } catch {}
    }
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connectionString = process.env.DATABASE_URL;
const isLocal =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1") ||
  connectionString.includes("sslmode=disable");

export const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});
export const db = drizzle(pool, { schema });

export * from "./schema";
