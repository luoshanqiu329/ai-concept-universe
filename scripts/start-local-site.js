#!/usr/bin/env node
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8080);
const UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function refreshData() {
  const result = spawnSync(process.execPath, [path.join(ROOT, "scripts/update.js")], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.warn("Daily data refresh failed; serving the last generated version.");
  }
}

function resolveRequestPath(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, `http://localhost:${PORT}`).pathname);
  const normalized = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = path.join(ROOT, normalized);
  const target = requestedPath.endsWith(path.sep) ? path.join(requestedPath, "index.html") : requestedPath;
  if (!target.startsWith(ROOT)) return null;
  return fs.existsSync(target) && fs.statSync(target).isDirectory() ? path.join(target, "index.html") : target;
}

refreshData();
setInterval(refreshData, UPDATE_INTERVAL_MS);

const server = http.createServer((request, response) => {
  const filePath = resolveRequestPath(request.url || "/");
  if (!filePath || !fs.existsSync(filePath)) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  response.writeHead(200, {
    "content-type": MIME_TYPES[ext] || "application/octet-stream",
    "cache-control": ext === ".json" ? "no-cache" : "public, max-age=300",
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(PORT, () => {
  console.log(`AI Concept Universe is running at http://localhost:${PORT}/`);
});
