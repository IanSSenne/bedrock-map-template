import type { Plugin } from "esbuild";
import { getRootPath } from "./getRootPath";
import { join } from "path";
const base = getRootPath();
export const resolveLibPlugin: Plugin = {
  name: "resolveLibPlugin",
  setup(build) {
    build.onResolve({ filter: /^@bedrock\/.+$/ }, (args) => {
      return {
        path: join(base, "lib", args.path.replace(/^@bedrock\//, "") + ".ts"),
      };
    });
  },
};
