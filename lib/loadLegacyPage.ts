export type LegacyPageData = {
  title: string;
  styles: string;
  bodyHtml: string;
  scripts: string[];
};

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const LINK_REWRITES: Array<[RegExp, string]> = [
  [/href=(['"])index\.html\1/g, 'href="/"'],
  [/href=(['"])fertilizers\.html\1/g, 'href="/fertilizers"'],
  [/href=(['"])report\.html\1/g, 'href="/report"'],
];

function rewriteLinks(input: string): string {
  let output = input;
  for (const [pattern, replacement] of LINK_REWRITES) {
    output = output.replace(pattern, replacement);
  }

  output = output.replace(
    /window\.location\.href\s*=\s*(['"])(index|fertilizers|report)\.html\1/g,
    (_, quote: string, route: string) =>
      route === "index"
        ? `window.location.href = ${quote}/${quote}`
        : `window.location.href = ${quote}/${route}${quote}`,
  );

  return output;
}

function readLegacyHtmlFromDisk(fileName: string): string | null {
  const filePath = join(process.cwd(), fileName);
  if (!existsSync(filePath)) {
    return null;
  }
  return readFileSync(filePath, { encoding: "utf8" });
}

function readLegacyHtmlFromGit(fileName: string): string {
  return execFileSync("git", ["show", `HEAD:${fileName}`], {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20,
  });
}

function sanitizeLegacyStyles(styles: string): string {
  return styles
    .replace(/\boverflow\s*:\s*hidden\s*;?/gi, "")
    .replace(/\bheight\s*:\s*100vh\s*;?/gi, "");
}

export async function loadLegacyPage(fileName: string): Promise<LegacyPageData> {
  const html = readLegacyHtmlFromDisk(fileName) ?? readLegacyHtmlFromGit(fileName);

  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!bodyMatch) {
    throw new Error(`Could not parse body content from ${fileName}`);
  }

  const bodyRaw = bodyMatch[1];
  const scriptMatches = [...bodyRaw.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
  const scripts = scriptMatches.map((match) => rewriteLinks(match[1]));
  const bodyWithoutScripts = bodyRaw.replace(/<script>[\s\S]*?<\/script>/gi, "");

  return {
    title: titleMatch?.[1]?.trim() ?? "Market Neurons",
    styles: sanitizeLegacyStyles(styleMatch?.[1] ?? ""),
    bodyHtml: rewriteLinks(bodyWithoutScripts),
    scripts,
  };
}
