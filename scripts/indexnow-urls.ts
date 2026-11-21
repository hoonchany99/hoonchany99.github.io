/**
 * IndexNow에 보낼 주소 고르기. 배포 뒤 "바뀐 소스 파일" → "바뀐 공개 주소".
 *
 * 순수 함수(classifyChanges, sitemapUrls)와, 워크플로가 부르는 작은 CLI가 한 파일에 있어요.
 *   npx tsx scripts/indexnow-urls.ts <이전 sha> <현재 sha>   → 줄마다 주소 하나(표준 출력)
 * 이전 sha가 0이거나 못 찾으면 아무것도 출력하지 않아요(첫 push 등).
 * 「전체」면 배포된 사이트의 sitemap에서 주소를 읽어요(noindex 페이지는 sitemap에 이미 없음).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const SITE = 'https://doctoryoon.kr';

export type Changes = { all: boolean; paths: string[] };

/** frontmatter에서 termSlug를 읽어요. 파일 이름과 다를 수 있어요. 없으면 null. */
export function termSlugFromMarkdown(md: string): string | null {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const m = fm[1].match(/^termSlug:\s*["']?([^"'\s#]+)["']?\s*$/m);
  return m ? m[1] : null;
}

/** 이 파일이 바뀌면 화면 전체가 바뀔 수 있는 소스인가 */
function affectsEverything(file: string): boolean {
  if (/^src\/(layouts|components|lib|styles|data|utils)\//.test(file)) return true;
  if (file === 'src/content/config.ts') return true;
  if (/^src\/pages\/(404|index|about|ask|qna)\.astro$/.test(file)) return false; // 아래에서 개별 주소로
  if (/^src\/pages\/.+\.astro$/.test(file)) return true; // [slug].astro 같은 틀
  if (/^(astro\.config\.mjs|tailwind\.config\.mjs|package\.json|package-lock\.json)$/.test(file)) return true;
  return false;
}

const PAGE_URLS: Record<string, string> = {
  'src/pages/index.astro': '/',
  'src/pages/about.astro': '/about/',
  'src/pages/ask.astro': '/ask/',
  'src/pages/qna.astro': '/qna/',
};

/**
 * 바뀐 파일 목록(git diff --name-only)을 공개 주소 경로로 바꿔요.
 * slugOf(file): 용어 md의 termSlug. 파일이 지워졌으면 이전 내용에서 읽어 오거나 null.
 */
export function classifyChanges(files: string[], slugOf: (file: string) => string | null): Changes {
  const paths = new Set<string>();
  let all = false;
  for (const file of files) {
    let m: RegExpMatchArray | null;
    if ((m = file.match(/^src\/content\/terms\/[^/]+\.md$/))) {
      const slug = slugOf(file);
      if (slug) paths.add(`/terms/${slug}/`);
      paths.add('/terms/'); // 용어 목록에도 이름·설명이 나와요
    } else if ((m = file.match(/^src\/content\/posts\/(.+)\.mdx?$/))) {
      paths.add(`/posts/${m[1]}/`);
    } else if (PAGE_URLS[file]) {
      paths.add(PAGE_URLS[file]);
    } else if ((m = file.match(/^public\/(doctorjiwoo\/.*)index\.html$/))) {
      paths.add(`/${m[1]}`);
    } else if (affectsEverything(file)) {
      all = true;
    }
  }
  return { all, paths: [...paths].sort() };
}

/** 색인하지 않을 주소 */
export function isExcluded(pathname: string): boolean {
  return (
    pathname.startsWith('/personal/') ||
    pathname.startsWith('/topics/') ||
    pathname === '/404/' ||
    /^\/posts\/\d+\/$/.test(pathname) ||
    /\.(json|xml|txt)$/.test(pathname)
  );
}

/** 주소 경로 목록을 절대 주소로. 중복·제외 대상은 빼요. */
export function toUrls(paths: string[]): string[] {
  const out = new Set<string>();
  for (const p of paths) if (!isExcluded(p)) out.add(SITE + p);
  return [...out];
}

/** sitemap XML에서 <loc> 주소(우리 사이트 것만)를 경로로 */
export function sitemapPaths(xml: string): string[] {
  const out: string[] = [];
  for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
    const raw = m[1].replace(/&amp;/g, '&');
    if (!raw.startsWith(SITE + '/')) continue;
    out.push(raw.slice(SITE.length));
  }
  return out;
}

function git(args: string[]): string {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

async function main() {
  const [before, after] = process.argv.slice(2);
  if (!before || !after || /^0+$/.test(before)) {
    console.error('이전 sha가 없어요(첫 push 등): 보낼 주소 없음');
    return;
  }
  let files: string[];
  try {
    files = git(['diff', '--name-only', before, after]).split('\n').filter(Boolean);
  } catch {
    console.error('이전 sha를 못 찾았어요: 보낼 주소 없음');
    return;
  }
  const slugOf = (file: string) => {
    try {
      return termSlugFromMarkdown(readFileSync(file, 'utf8'));
    } catch {
      // 지워진 용어: 이전 내용에서 읽어요(옛 주소도 다시 수집하게 알려요)
      try {
        return termSlugFromMarkdown(git(['show', `${before}:${file}`]));
      } catch {
        return null;
      }
    }
  };
  const { all, paths } = classifyChanges(files, slugOf);
  let list = paths;
  if (all) {
    const index = await (await fetch(`${SITE}/sitemap-index.xml`)).text();
    const sitemaps = sitemapPaths(index);
    list = [];
    for (const p of sitemaps) list.push(...sitemapPaths(await (await fetch(SITE + p)).text()));
    console.error(`전체: sitemap 주소 ${list.length}개`);
  }
  const urls = toUrls(list);
  console.error(`바뀐 파일 ${files.length}개 → 보낼 주소 ${urls.length}개 (전체=${all})`);
  for (const u of urls) console.log(u);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error('주소 고르기 실패:', e instanceof Error ? e.message : e);
  });
}
