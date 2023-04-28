// import { readFileSync, writeFileSync } from "fs";
// import { resolve } from "path";
// import { getRootPath } from "./util/getRootPath";

// const commands = readFileSync(
//   resolve(getRootPath(), "./scripts/util/bindings.txt"),
//   "utf8"
// ).split("\n");
// let results: string[] = ["export const c = {"];
// let references: Record<string, string> = {};
// let lastCommand = "";
// let x = false;
// for (let command of commands) {
//   let reresults = command.match(/^([^,]*)->\((.*)\)/)!;
//   if (reresults) {
//     const [_, a, b] = reresults;
//     references[b] = a;
//     continue;
//   } else {
//     const [commandName, ...args] = command.split(",");
//     if (commandName !== lastCommand) {
//       if (x) {
//         results.push(`function handler(...args:any[]){}`);
//         results.push(`return handler;`);
//         results.push("})(),");
//       }
//       results.push(`${commandName}:(()=>{`);
//     }
//     results.push(`function handler(${args.join(",")}):any;`);
//     lastCommand = commandName;
//     x = true;
//   }
// }

// results.push(`function handler(...args:any[]){}`);
// results.push(`return handler;`);
// results.push("})(),");
// Object.entries(references).forEach(([value, key]) => {
//   results.push(`get ${key}(){return c.${value}},`);
// });

// results.push("}");

// writeFileSync(
//   resolve(getRootPath(), "./lib/mcf/commands.ts"),
//   results.join("\n")
// );
