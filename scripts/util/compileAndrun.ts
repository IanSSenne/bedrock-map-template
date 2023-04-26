import esbuild from "esbuild";

import { getRootPath } from "./getRootPath";
import { getCachePath } from "./getCachePath";
import { resolveLibPlugin } from "./resolveLibPlugin";
import { nodeExternals } from "esbuild-plugin-node-externals";
import { fork } from "child_process";
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}
export async function compileAndRun(file: string, watch: boolean = false) {
  const outfile = getCachePath(hashString(file), "js");
  await esbuild
    .build({
      entryPoints: [file],
      outfile,
      bundle: true,
      platform: "node",
      target: "node14",
      plugins: [resolveLibPlugin, nodeExternals()],
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        console.log("START USER CODE");
        let cp = fork(outfile);
        cp.on("error", reject);
        cp.on("exit", resolve);
      }).then(() => {
        console.log("END USER CODE");
      });
    });
}
