import { extname, resolve } from "path";
import { Types, __fs_env } from "./config";
const baseLocations = {
  bp: __fs_env.packs.behavior.origin,
  rp: __fs_env.packs.resource.origin,
  resource: __fs_env.resource,
};
const loaders = {
  ".json": (v: string) => JSON.parse(require(v)),
};
export function getResource<T extends keyof Types.ResourceLoaderResourceMap>(
  path: T
): Types.ResourceLoaderResourceMap[T] {
  const [pack, location] = path.split(":");
  const base = baseLocations[pack];
  if (!base) throw new Error(`Invalid pack ${pack}`);
  const resolved = resolve(base, location);
  let loader = loaders[extname(resolved)] || ((v: any) => v);
  return loader(resolved);
}
