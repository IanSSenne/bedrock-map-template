import { getRootPath } from "./getRootPath";
import { watch } from "chokidar";
import { readFileSync } from "fs";
const root = getRootPath();
type Config = any;
interface ConfigOptions {
  root: string;
  handler(config: Config): Promise<any>;
  watch: boolean;
  extras: string[];
}
import jsYaml, { YAMLException } from "js-yaml";
import { join } from "path";
function tryParseConfig(location: string) {
  try {
    return (jsYaml.load(readFileSync(location, "utf8")) as Config) || {};
  } catch (e) {
    if (e instanceof YAMLException) {
      console.error(e.message);
    } else {
      throw e;
    }
    return null;
  }
}
export function config({
  root = getRootPath(),
  handler,
  watch: useWatch = false,
  extras = [],
}: ConfigOptions) {
  let config: Config | null = null;
  const configPath = join(root, "config.yml");
  console.log(configPath);
  if (!useWatch) {
    config = tryParseConfig(configPath);
    if (config === null) {
      return;
    }
    return handler(config);
  } else {
    let destroyer: Promise<(() => void) | void>;
    let running = false;
    let queued = false;
    async function reload() {
      if (running) {
        queued = true;
        return;
      }
      running = true;
      const cleanup = await destroyer;
      if (typeof cleanup === "function") {
        await cleanup();
      }
      config = tryParseConfig(configPath);
      if (config === null) {
        running = false;
        queued = false;
        destroyer = Promise.resolve(undefined);
        return; // failed to parse the config so we should wait for the next change
      }
      destroyer = handler(config);
      await destroyer;
      running = false;
      if (queued) {
        queued = false;
        reload();
      }
    }
    watch([join(root, "config.yml"), ...extras])
      .on("change", reload)
      .on("add", reload)
      .on("unlink", reload);
    return reload();
  }
}
