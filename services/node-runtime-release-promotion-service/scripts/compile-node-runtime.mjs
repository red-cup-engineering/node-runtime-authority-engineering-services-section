#!/usr/bin/env node
import { resolve } from "node:path";
import { compileNodeRuntime } from "../src/compile-node-runtime.mjs";

const args = process.argv.slice(2);
const entries = [];
let workspace, pnpm, filter, runtime, preserveSymlinks = false;
for (let index = 0; index < args.length; index += 2) {
  if (args[index] === "--preserve-symlinks") { preserveSymlinks = true; index--; continue; }
  if (!["--entry", "--workspace", "--pnpm", "--filter", "--runtime"].includes(args[index]) || !args[index + 1]) throw new TypeError("usage: compile-node-runtime [--entry <module>...] [--workspace <source root> --pnpm <executable> --filter <native-selector> --runtime <packed runtime>] [--preserve-symlinks]");
  if (args[index] === "--entry") entries.push(args[index + 1]);
  else if (args[index] === "--workspace") workspace = resolve(args[index + 1]);
  else if (args[index] === "--pnpm") pnpm = args[index + 1];
  else if (args[index] === "--filter") filter = args[index + 1];
  else runtime = resolve(args[index + 1]);
}
try {
  const record = await compileNodeRuntime({ entries, workspace, pnpm, filter, runtime, preserveSymlinks });
  process.stdout.write(JSON.stringify(record) + "\n");
} catch (error) {
  if (error.receipt) process.stdout.write(JSON.stringify(error.receipt) + "\n");
  throw error;
}

