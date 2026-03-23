import { cp, mkdir, rm, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const engineRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(engineRoot, "..");
const targetRoot = path.join(engineRoot, ".generated", "content-lab");

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const candidates = [
    process.env.CONTENT_ROOT_SOURCE,
    process.env.CONTENT_ROOT,
    path.join(repoRoot, "content-lab"),
    path.join(engineRoot, "..", "content-lab"),
  ].filter(Boolean);

  const sourceRoot = (
    await Promise.all(
      candidates.map(async (candidate) => ((await exists(candidate)) ? candidate : null)),
    )
  ).find(Boolean);

  if (!sourceRoot) {
    console.log(`[content:sync] skipped: no content source found in ${candidates.join(", ")}`);
    return;
  }

  await mkdir(path.dirname(targetRoot), { recursive: true });
  await rm(targetRoot, { recursive: true, force: true });
  await cp(sourceRoot, targetRoot, { recursive: true });
  console.log(`[content:sync] synced content-lab -> ${targetRoot}`);
}

main().catch((error) => {
  console.error("[content:sync] failed");
  console.error(error);
  process.exitCode = 1;
});
