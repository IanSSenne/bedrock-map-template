import { readFileSync } from "fs";

export class Geo {
  constructor(public readonly geo: any) {}
  static load(path: string) {
    return new Geo(JSON.parse(readFileSync(path, "utf8")));
  }
}
