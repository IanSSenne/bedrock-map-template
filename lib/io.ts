import { mkdirSync, writeFileSync } from "fs";
import { __fs_env, __lib_env } from "./config";
import { dirname, join, resolve } from "path";

const baseLocations = {
  bp: __fs_env.packs.behavior.target,
  rp: __fs_env.packs.resource.target,
  debug: join(process.cwd(), "debug"),
};
const knownDirs = new Set<string>();
function ensureDirectory(dir: string) {
  if (knownDirs.has(dir)) return;
  knownDirs.add(dir);
  mkdirSync(dir, { recursive: true });
}
export function write(
  target: `${keyof typeof baseLocations}:${string}`,
  contents: string | NodeJS.ArrayBufferView
) {
  const [pack, path] = target.split(":");
  const base = baseLocations[pack];
  if (!base) throw new Error(`Invalid pack ${pack}`);
  const resolved = resolve(base, path);
  ensureDirectory(dirname(resolved));
  writeFileSync(resolved, contents);
}
write.json = (
  target: `${keyof typeof baseLocations}:${string}`,
  contents: any
) => {
  write(
    target,
    __lib_env.mode === "dev"
      ? JSON.stringify(contents, null, 2)
      : JSON.stringify(contents)
  );
};
