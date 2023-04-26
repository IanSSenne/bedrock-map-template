import fs from "fs";
import path from "path";
let _root: string;
export const getRootPath = () => {
  if (_root) {
    return _root;
  }
  let start = __dirname;
  while (!fs.existsSync(path.join(start, "package.json"))) {
    let oldStart = start;
    start = path.join(start, "..");
    if (start === oldStart) {
      throw new Error(`Could not find root path from ${__dirname}`);
    }
  }
  _root = start;
  return start;
};
