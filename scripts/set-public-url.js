#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const INDEX_PATH = path.join(ROOT, "index.html");
const publicUrl = process.argv[2];

if (!publicUrl) {
  console.error("Usage: node scripts/set-public-url.js https://example.com/");
  process.exit(1);
}

let url;
try {
  url = new URL(publicUrl);
} catch (error) {
  console.error("Please provide a valid absolute URL.");
  process.exit(1);
}

const canonicalUrl = url.href;
const imageUrl = new URL("preview-3d-final.png", canonicalUrl).href;
let html = fs.readFileSync(INDEX_PATH, "utf8");

function upsertLink(rel, href) {
  const pattern = new RegExp(`<link\\s+rel=["']${rel}["'][^>]*>`, "g");
  const tag = `<link rel="${rel}" href="${href}" />`;
  if (pattern.test(html)) {
    let replaced = false;
    html = html.replace(pattern, () => {
      if (replaced) return "";
      replaced = true;
      return tag;
    });
    return;
  }
  html = html.replace("</head>", `    ${tag}\n  </head>`);
}

function upsertMeta(attribute, key, content) {
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapeRegExp(key)}["'][^>]*>`, "g");
  const tag = `<meta ${attribute}="${key}" content="${content}" />`;
  if (pattern.test(html)) {
    let replaced = false;
    html = html.replace(pattern, () => {
      if (replaced) return "";
      replaced = true;
      return tag;
    });
    return;
  }
  html = html.replace("</head>", `    ${tag}\n  </head>`);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

upsertLink("canonical", canonicalUrl);
upsertMeta("property", "og:url", canonicalUrl);
upsertMeta("property", "og:image", imageUrl);
upsertMeta("name", "twitter:image", imageUrl);

fs.writeFileSync(INDEX_PATH, html);
console.log(`Public URL set to ${canonicalUrl}`);
console.log(`Preview image set to ${imageUrl}`);
