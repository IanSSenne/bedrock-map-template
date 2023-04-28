import { Types } from "./config";

export type Resource = Types.ResourceLoaderResourceMap;
export type ResourceWithExt<T extends string> = {
  [K in keyof Resource]: K extends `${string}.${T}` ? K : never;
}[keyof Resource];
