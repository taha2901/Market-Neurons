import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const pageName = process.argv[2];
if (!pageName) {
  throw new Error("Usage: node scripts/convert-html-to-jsx.mjs <page-name-without-extension>");
}

const root = process.cwd();
const htmlPath = path.join(root, `${pageName}.html`);
const pageDir = path.join(root, "app", pageName === "index" ? "" : pageName);
const cssFile = pageName === "index" ? "home.css" : `${pageName}.css`;
const componentFile = pageName === "index" ? "HomeRebuilt.tsx" : `${capitalize(pageName)}Rebuilt.tsx`;

function capitalize(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function normalizeText(v) {
  return v.replace(/^\uFEFF/, "");
}

function fixLinks(v) {
  return v
    .replace(/href=(['"])index\.html\1/g, 'href="/"')
    .replace(/href=(['"])fertilizers\.html\1/g, 'href="/fertilizers"')
    .replace(/href=(['"])report\.html\1/g, 'href="/report"');
}

function toJsxStyle(value) {
  const rules = value
    .split(";")
    .map((r) => r.trim())
    .filter(Boolean)
    .map((rule) => {
      const idx = rule.indexOf(":");
      if (idx === -1) return null;
      let key = rule.slice(0, idx).trim();
      const val = rule.slice(idx + 1).trim().replace(/'/g, "\\'");
      key = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${key}: '${val}'`;
    })
    .filter(Boolean)
    .join(", ");

  return `{{${rules}}}`;
}

function convertHtmlToJsx(body) {
  let out = body;
  out = out.replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = fixLinks(out);
  out = out.replace(/\bclass=/g, "className=");
  out = out.replace(/\bfor=/g, "htmlFor=");
  out = out.replace(/\son\w+=(['"])[\s\S]*?\1/gi, "");
  out = out.replace(/style=(['"])([\s\S]*?)\1/gi, (_, __, styles) => `style=${toJsxStyle(styles)}`);

  const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  for (const tag of voidTags) {
    out = out.replace(new RegExp(`<${tag}([^>]*?)(?<!/)>(?!\\s*</${tag}>)`, "gi"), `<${tag}$1 />`);
  }

  return out.trim();
}

const html = normalizeText(await readFile(htmlPath, "utf8"));
const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "Market Neurons";
const styles = html.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? "";
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
const jsxBody = convertHtmlToJsx(body);

await mkdir(pageDir || path.join(root, "app"), { recursive: true });
await writeFile(path.join(pageDir || path.join(root, "app"), cssFile), styles, "utf8");

const componentName = componentFile.replace(".tsx", "");
const tsx = `"use client";
import { useEffect } from "react";
import "./${cssFile}";

export const pageTitle = ${JSON.stringify(title)};

export default function ${componentName}() {
  useEffect(() => {
    // TODO: migrate page-specific JS behavior to React hooks/state.
  }, []);

  return (
    <>
${jsxBody
  .split("\n")
  .map((line) => `      ${line}`)
  .join("\n")}
    </>
  );
}
`;

await writeFile(path.join(pageDir || path.join(root, "app"), componentFile), tsx, "utf8");
