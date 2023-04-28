const cp = require("child_process");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");
const nodeExternals = require("esbuild-plugin-node-externals");
async function runScript(scriptPath, callback) {
  if (!scriptPath.endsWith(".ts")) {
    scriptPath += ".ts";
  }
  // keep track of whether callback has been invoked to prevent multiple invocations
  let invoked = false;
  const temp = path.resolve(
    __dirname,
    "..",
    "node_modules",
    ".template-cache",
    "js",
    "scripts",
    path.basename(scriptPath) + ".js"
  );
  await esbuild.build({
    entryPoints: [path.resolve(__dirname, scriptPath)],
    outfile: temp,
    bundle: true,
    minify: false,
    platform: "node",
    target: "node16",
    plugins: [nodeExternals.nodeExternals()],
  });

  console.log("Forking process...", temp);
  console.time("Running process...");
  let process = cp.fork(temp);

  // listen for errors as they may prevent the exit event from firing
  process.on("error", function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
    console.timeEnd("Running process...");
  });

  process.on("exit", function (code) {
    if (invoked) return;
    invoked = true;
    const err = code === 0 ? null : new Error("exit code " + code);
    callback(err);
    console.timeEnd("Running process...");
  });
}

const scriptPath = process.argv[2];
runScript(scriptPath, function (err) {
  if (err) throw err;
});
