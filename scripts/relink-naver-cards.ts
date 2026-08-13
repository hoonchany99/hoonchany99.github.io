/**
 * 본문 속 네이버 블로그 카드(oglink)를 같은 내용의 로컬 글로 다시 연결한다.
 *
 * 네이버에서 동기화된 글에는 다른 네이버 글로 나가는 카드가 섞여 들어온다.
 * 같은 글이 doctoryoon.kr에도 있으므로, 카드 제목으로 짝을 찾아 로컬 경로로 바꾼다.
 * 독자를 사이트 안에 두고, 모바일에서 네이버 앱으로 튕기는 것도 막는다.
 *
 * 카드 제목 ↔ 글 제목으로 매칭하며, 짝이 없으면 그대로 둔다.
 * 여러 번 돌려도 안전하다. 동기화(sync_naver.py) 뒤에 실행하면 된다.
 *
 * npm run relink-naver-cards [-- --dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '../src/content/posts');

/** oglink 카드 한 장 전체 (<a …>부터 </a>까지) */
const CARD_RE =
  /<a href="(https:\/\/blog\.naver\.com[^"]*)"([^>]*class="se-oglink-info[^>]*)>([\s\S]*?)<\/a>/g;
const TITLE_RE = /<strong class="se-oglink-title">([^<]*)<\/strong>/;
const URL_LABEL_RE = /(<p class="se-oglink-url">)[^<]*(<\/p>)/;

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function loadPostTitles(): Map<string, string> {
  const byTitle = new Map<string, string>();
  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.md')) continue;
    const { data } = matter(fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8'));
    if (!data.title) continue;
    byTitle.set(decodeEntities(String(data.title)), file.replace(/\.md$/, ''));
  }
  return byTitle;
}

function main(): void {
  const dryRun = process.argv.includes('--dry-run');
  const byTitle = loadPostTitles();

  let cards = 0;
  let relinked = 0;
  let touchedFiles = 0;
  const unmatched: string[] = [];

  for (const file of fs.readdirSync(POSTS_DIR)) {
    if (!file.endsWith('.md')) continue;
    const filePath = path.join(POSTS_DIR, file);
    const original = fs.readFileSync(filePath, 'utf-8');

    const updated = original.replace(CARD_RE, (whole, _href, attrs: string, inner: string) => {
      cards++;

      const titleMatch = inner.match(TITLE_RE);
      const title = titleMatch ? decodeEntities(titleMatch[1]) : '';
      const slug = byTitle.get(title);

      if (!slug) {
        if (title) unmatched.push(title);
        return whole;
      }

      relinked++;
      // 내부 링크이므로 새 탭으로 열지 않는다
      const localAttrs = attrs.replace(/\s*target="_blank"/g, '');
      // 카드에 표시되는 출처도 실제 이동 경로에 맞춘다
      const localInner = inner.replace(URL_LABEL_RE, `$1doctoryoon.kr$2`);
      return `<a href="/posts/${slug}/"${localAttrs}>${localInner}</a>`;
    });

    if (updated !== original) {
      touchedFiles++;
      if (!dryRun) fs.writeFileSync(filePath, updated, 'utf-8');
    }
  }

  console.log(
    `카드 ${cards}개 중 ${relinked}개를 로컬 글로 연결 (글 ${touchedFiles}개)${
      dryRun ? ' — dry-run, 저장 안 함' : ''
    }`
  );
  if (unmatched.length) {
    console.log(`짝을 못 찾아 그대로 둔 카드 ${unmatched.length}개:`);
    for (const t of [...new Set(unmatched)]) console.log(`  - ${t}`);
  }
}

main();
