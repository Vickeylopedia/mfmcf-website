import { defineConfig } from "drizzle-kit";
import path from "path";

import fs from "node:fs";

import { fileURLToPath } from "node:url";

if (!process.env.DATABASE_URL) {
  const currentDir = typeof __dirname !== "undefined" ? __dirname : (import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url)));
  for (const envPath of [
    path.resolve(process.cwd(), ".env"),
    path.resolve(currentDir, "./.env"),
    path.resolve(currentDir, "../../.env"),
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
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
