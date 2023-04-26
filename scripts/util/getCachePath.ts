import { dirname, resolve } from "path";
import { getRootPath } from "./getRootPath";
import { mkdirSync } from "fs";
const base = getRootPath();

export function getCachePath(name: string, ext: string) {
  let location = resolve(
    base,
    `node_modules`,
    `.template-cache`,
    "js",
    `${name}.${ext}`
  );

  let basename = dirname(location);
  mkdirSync(basename, { recursive: true });
  return location;
}
