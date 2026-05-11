import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function extract(file, outRel) {
  const html = readFileSync(join(root, file), "utf8");
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (!m) throw new Error(`No <style> in ${file}`);
  const out = join(root, outRel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, m[1], "utf8");
  console.log(outRel, m[1].length);
}

extract("index.html", "app/home/home.css");
extract("report.html", "app/report/report.css");
