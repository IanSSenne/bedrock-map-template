import { getResource } from "../resource";
import { ResourceWithExt } from "../types";

export function compile(resource: ResourceWithExt<"glsl">) {
  console.log(getResource(resource));
}
