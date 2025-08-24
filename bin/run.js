#!/usr/bin/env node
"use strict";

const fs = require("fs");
const { compileToBF, runBF } = require("../src/interpreter");

const file = process.argv[2];
if (!file) {
  console.error(
    "Usage: node bin/run.js <source.nyufufu> [--dump-bf [out.txt]]"
  );
  process.exit(1);
}

const src = fs.readFileSync(file, "utf8");
const bf = compileToBF(src);

// --dump-bf [optional: path]
if (process.argv.includes("--dump-bf")) {
  const i = process.argv.indexOf("--dump-bf");
  const outPath =
    process.argv[i + 1] && !process.argv[i + 1].startsWith("--")
      ? process.argv[i + 1]
      : null;

  if (outPath) {
    fs.writeFileSync(outPath, bf, "utf8"); // output file
  } else {
    process.stdout.write(bf); // stdout
  }
  process.exit(0); // DO NOT RUN
}

// 入力（パイプ時のみ）
let input = Buffer.alloc(0);
try {
  if (!process.stdin.isTTY) input = fs.readFileSync(0);
} catch {}

const out = runBF(bf, input);
process.stdout.write(out);
