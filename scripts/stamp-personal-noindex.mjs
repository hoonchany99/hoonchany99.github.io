/**
 * Legacy Jekyll /personal/ files can remain on GitHub Pages after Astro deploys.
 * Overwrite known paths with minimal noindex HTML so Naver/Google drop them from search.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITEMAP_URL = "https://doctoryoon.kr/personal/sitemap.xml";

const STUB_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, nofollow">
  <meta name="Yeti" content="noindex">
  <meta name="googlebot" content="noindex, nofollow">
  <title>이전 페이지 (검색 제외)</title>
  <link rel="canonical" href="https://doctoryoon.kr/">
</head>
<body>
  <p>이 페이지는 더 이상 공개되지 않습니다. <a href="https://doctoryoon.kr/">치과사전 홈</a></p>
</body>
</html>
`;

function urlToDistPath(loc) {
  const u = new URL(loc.replace(/&amp;/g, "&"));
  let pathname = u.pathname;
  if (!pathname.startsWith("/personal/")) return null;
  pathname = pathname.replace(/^\/personal\/?/, "");
  if (!pathname || pathname.endsWith("/")) {
    return path.join(DIST, "personal", pathname, "index.html");
  }
  if (pathname.endsWith(".pdf")) {
    return path.join(DIST, "personal", pathname);
  }
  return path.join(DIST, "personal", pathname, "index.html");
}

async function fetchPaths() {
  // 네트워크 실패로 스텁 생성을 통째로 건너뛰면 안 된다.
  // 예전에는 fetch가 던지면 main()이 죽어 FALLBACK_LOCS까지 안 쓰였다.
  try {
    const res = await fetch(SITEMAP_URL, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.warn(`[personal-noindex] sitemap fetch failed (${res.status}), using fallback paths only`);
      return [];
    }
    const xml = await res.text();
    const paths = [];
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      paths.push(m[1]);
    }
    return paths;
  } catch (err) {
    console.warn(`[personal-noindex] sitemap fetch error (${err.message}), using fallback paths only`);
    return [];
  }
}

function writeStub(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  if (filePath.endsWith(".pdf")) {
    fs.writeFileSync(
      filePath,
      `%PDF-1.4\n% Legacy file removed from search — see https://doctoryoon.kr/\n`,
    );
    return;
  }
  fs.writeFileSync(filePath, STUB_HTML, "utf8");
}

const FALLBACK_LOCS = [
  "https://doctoryoon.kr/personal/",
  "https://doctoryoon.kr/personal/about/",
  "https://doctoryoon.kr/personal/categories/",
  "https://doctoryoon.kr/personal/tags/",
  "https://doctoryoon.kr/personal/archives/",
];

async function main() {
  const fromSitemap = await fetchPaths();
  const locs = [...new Set([...fromSitemap, ...FALLBACK_LOCS])];
  let count = 0;

  for (const loc of locs) {
    const distPath = urlToDistPath(loc);
    if (!distPath) continue;
    writeStub(distPath);
    count++;
  }

  const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>
`;
  const sitemapPath = path.join(DIST, "personal", "sitemap.xml");
  fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });
  fs.writeFileSync(sitemapPath, emptySitemap, "utf8");

  const personalRobots = `User-agent: *
Disallow: /

User-agent: Yeti
Disallow: /
`;
  fs.writeFileSync(path.join(DIST, "personal", "robots.txt"), personalRobots, "utf8");

  console.log(`[personal-noindex] wrote ${count} stub(s) under dist/personal/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
