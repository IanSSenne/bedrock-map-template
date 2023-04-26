import * as fs from "fs";
import { dirname, join, relative } from "path";
import { getRootPath } from "./getRootPath";

export function getFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  let results: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    const filePath = join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursive(filePath));
    } else {
      results.push(filePath);
    }
  });
  return results;
}
export function copyFiles(
  fileBase: string,
  to: string,
  clean: boolean = false
) {
  const location = fileBase;
  if (clean) fs.rmSync(to, { recursive: true });
  const files = getFilesRecursive(location);
  for (const file of files) {
    const rel = relative(location, file);
    const newFile = join(to, rel);
    fs.mkdirSync(dirname(newFile), { recursive: true });
    fs.copyFileSync(file, newFile);
  }
}
