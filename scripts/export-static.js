#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const STATIC_ENTRIES = [
  ".nojekyll",
  "index.html",
  "robots.txt",
  "preview-3d-final.png",
  "assets",
  "css",
  "js",
  "data",
];

function copyEntry(entry) {
  const source = path.join(ROOT, entry);
  const target = path.join(DIST, entry);

  if (!fs.existsSync(source)) {
    return;
  }

  fs.cpSync(source, target, {
    recursive: true,
    force: true,
    dereference: true,
  });
}

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

STATIC_ENTRIES.forEach(copyEntry);

console.log(`Exported static site to ${path.relative(ROOT, DIST)}/`);
