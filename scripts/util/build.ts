import { getRootPath } from "./getRootPath";
import { config } from "./config";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { extname, relative, resolve } from "path";
import { compileAndRun } from "./compileAndrun";
import { copyFiles, getFilesRecursive } from "./copyFiles";
import pkg from "../../package.json";
const base = getRootPath();
const ensure = (path: string) => {
  mkdirSync(path, { recursive: true });
  return path;
};
const $MC =
  process.env.LOCALAPPDATA +
  String.raw`\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang`;
const returns: Record<string, ((v: string) => string) | string> = {
  ".json": (v: any) => {
    try {
      return `${JSON.stringify(JSON.parse(readFileSync(v, "utf8")))}`;
    } catch (e) {
      return "new Error(" + JSON.stringify((e as Error).message) + ")";
    }
  },
};
function getReturnForPath(p: string) {
  const ext = extname(p);
  function _resolve(v: string | ((v: string) => string)): string {
    if (typeof v === "string") return v;
    return v(p);
  }
  if (ext in returns) return _resolve(returns[ext]);
  return "string";
}
export const build = async (mode = "dev") => {
  return config({
    root: base,
    async handler(config) {
      const str = JSON.stringify(config, null, 2);
      const rpBase = ensure(
        resolve(base, "node_modules", ".template-cache", "pack", "resource")
      );
      const bpBase = ensure(
        resolve(base, "node_modules", ".template-cache", "pack", "behavior")
      );
      const usrBp = ensure(resolve(base, "pack", "behavior"));
      const usrRp = ensure(resolve(base, "pack", "resource"));
      const resourceDir = resolve(base, "resources");
      let generatedTypes: string[] = [
        "export type ResourceLoaderResourceMap = {",
        `"bp:manifest":${JSON.stringify(config.packs.behavior)},`,
        ...getFilesRecursive(usrBp).map((v) => {
          let rel = relative(usrBp, v);
          rel = rel.replace(/\\/g, "/");
          return `"bp:${rel}": ${getReturnForPath(v)},`;
        }),
        `"rp:manifest":${JSON.stringify(config.packs.behavior)},`,
        ...getFilesRecursive(usrRp).map((v) => {
          let rel = relative(usrRp, v);
          rel = rel.replace(/\\/g, "/");
          return `"rp:${rel}": ${getReturnForPath(v)},`;
        }),
        ...getFilesRecursive(resourceDir).map((v) => {
          let rel = relative(resourceDir, v);
          rel = rel.replace(/\\/g, "/");
          return `"resource:${rel}": ${getReturnForPath(v)},`;
        }),
        "};",
      ];
      writeFileSync(
        resolve(base, "lib", "config.ts"),
        `export const __lib_env={mode:${JSON.stringify(
          mode
        )}};export const config = ${str} as const;\nexport const __fs_env = ${JSON.stringify(
          {
            resource: resourceDir,
            packs: {
              resource: {
                target: rpBase,
                origin: usrRp,
              },
              behavior: {
                target: bpBase,
                origin: usrBp,
              },
            },
          },
          null,
          2
        )} as const;\nexport default config;\nexport namespace Types{${generatedTypes.join(
          "\n"
        )}}`
      );
      copyFiles(usrBp, bpBase, true);
      copyFiles(usrRp, rpBase, true);
      ensure(bpBase);
      ensure(rpBase);
      writeFileSync(
        resolve(bpBase, "manifest.json"),
        JSON.stringify(config.packs.behavior, null, 2)
      );

      writeFileSync(
        resolve(rpBase, "manifest.json"),
        JSON.stringify(config.packs.resource, null, 2)
      );
      console.log("Compiling...");
      await compileAndRun(resolve(base, "src", "main.ts"), true);
      console.log("Copying...");
      ensure(resolve($MC, "development_behavior_packs", pkg.name + "_BP"));
      copyFiles(
        bpBase,
        resolve($MC, "development_behavior_packs", pkg.name + "_BP"),
        true
      );
      ensure(resolve($MC, "development_resource_packs", pkg.name + "_RP"));

      copyFiles(
        rpBase,
        resolve($MC, "development_resource_packs", pkg.name + "_RP"),
        true
      );
      console.log("Done!");
      return {
        config,
        rp: rpBase,
        bp: bpBase,
      };
    },
    watch: mode === "dev",
    extras: [
      resolve(getRootPath(), "src/**"),
      resolve(getRootPath(), "pack/**"),
      resolve(getRootPath(), "resources/**"),
    ],
  });
};
