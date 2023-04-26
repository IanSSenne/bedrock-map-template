import yaml from "js-yaml";

import { getRootPath } from "./util/getRootPath";

import { readFileSync, writeFileSync } from "fs";
import crypto from "crypto";
import { join } from "path";
import project from "../package.json";
const configPath = join(getRootPath(), "config.yml");

const config = (yaml.load(readFileSync(configPath, "utf8")) as any) || {};
const rpUUId = crypto.randomUUID();
const rp = {
  format_version: 2,
  header: {
    name: project.name,
    description: project.name + ": Resource Pack",
    version: [1, 0, 0],
    min_engine_version: [1, 16, 0],
    uuid: rpUUId,
  },
  modules: [
    {
      type: "resources",
      uuid: crypto.randomUUID(),
      version: [1, 0, 0],
    },
  ],
};
config.packs = {
  ...(config.packs || {}),
  resource: rp,
  behavior: {
    format_version: 2,
    header: {
      name: project.name,
      description: project.name + ": Resource Pack",
      version: [1, 0, 0],
      min_engine_version: [1, 16, 0],
      uuid: crypto.randomUUID(),
    },
    modules: [
      {
        type: "data",
        uuid: crypto.randomUUID(),
        version: [1, 0, 0],
      },
    ],
    dependencies: [rp],
  },
};
writeFileSync(configPath, yaml.dump(config, { noArrayIndent: true }));
