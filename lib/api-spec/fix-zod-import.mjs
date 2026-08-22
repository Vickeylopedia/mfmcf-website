// Orval's zod generator emits v4 APIs (zod.email(), zod.int()) but imports
// from 'zod', which in this workspace resolves to zod 3. Rewrite the import
// to the 'zod/v4' subpath after codegen so generated code typechecks.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const generatedDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "api-zod",
  "src",
  "generated",
);

for (const file of await readdir(generatedDir)) {
  if (!file.endsWith(".ts")) continue;
  const filePath = path.join(generatedDir, file);
  const source = await readFile(filePath, "utf8");
  const fixed = source
    .replaceAll("from 'zod'", "from 'zod/v4'")
    .replaceAll('from "zod"', 'from "zod/v4"');
  if (fixed !== source) {
    await writeFile(filePath, fixed);
  }
}
