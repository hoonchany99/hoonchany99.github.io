/** IndexNow 주소 고르기·보내기 시험. 실제 호출 없음(가짜 fetch). `npm run test-indexnow` */
import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyChanges, termSlugFromMarkdown, toUrls, sitemapPaths } from './indexnow-urls.ts';
import { notify, buildBody, MAX_PER_POST } from './indexnow-notify.ts';

const none = () => null;

test('용어 md 하나가 바뀌면 그 용어 주소(+목록)', () => {
  const r = classifyChanges(['src/content/terms/term-implant.md'], () => 'implant');
  assert.equal(r.all, false);
  assert.deepEqual(r.paths, ['/terms/', '/terms/implant/']);
});

test('termSlug는 파일 이름이 아니라 frontmatter에서', () => {
  assert.equal(termSlugFromMarkdown('---\nname: "a"\ntermSlug: "other-slug"\n---\n본문'), 'other-slug');
  assert.equal(termSlugFromMarkdown('---\ntermSlug: plain\n---\n'), 'plain');
  assert.equal(termSlugFromMarkdown('본문만'), null);
});

test('지워진 용어는 slugOf가 옛 내용에서 준 주소를 그대로 써요, 못 읽으면 목록만', () => {
  assert.deepEqual(classifyChanges(['src/content/terms/term-x.md'], () => 'x-old').paths, ['/terms/', '/terms/x-old/']);
  assert.deepEqual(classifyChanges(['src/content/terms/term-x.md'], none).paths, ['/terms/']);
});

test('글 md는 /posts/<이름>/', () => {
  assert.deepEqual(classifyChanges(['src/content/posts/bad-breath.md'], none).paths, ['/posts/bad-breath/']);
});

test('레이아웃·공용 컴포넌트·용어 틀이 바뀌면 전체', () => {
  for (const f of ['src/layouts/BaseLayout.astro', 'src/components/Footer.tsx', 'src/pages/terms/[slug].astro', 'src/data/termDetails.ts', 'src/lib/termSections.ts', 'astro.config.mjs']) {
    assert.equal(classifyChanges([f], none).all, true, f);
  }
});

test('스크립트·워크플로·키 파일·README·워커만 바뀌면 아무것도 없음', () => {
  const r = classifyChanges(['scripts/x.ts', '.github/workflows/pages-deploy.yml', 'public/abc.txt', 'README.md', 'workers/summarize/src/a.ts', 'public/terms-index.json'], none);
  assert.deepEqual(r, { all: false, paths: [] });
});

test('개별 페이지 파일은 그 주소만', () => {
  assert.deepEqual(classifyChanges(['src/pages/about.astro'], none), { all: false, paths: ['/about/'] });
});

test('toUrls: personal·topics·404·글 목록·json은 빼고 중복 없이 절대 주소로', () => {
  const urls = toUrls(['/personal/a/', '/topics/x/', '/404/', '/posts/2/', '/search.json', '/terms/a/', '/terms/a/', '/posts/hi/']);
  assert.deepEqual(urls, ['https://doctoryoon.kr/terms/a/', 'https://doctoryoon.kr/posts/hi/']);
});

test('sitemapPaths: 우리 사이트 loc만 경로로', () => {
  const xml = '<urlset><url><loc>https://doctoryoon.kr/terms/a/</loc></url><url><loc>https://other.com/x/</loc></url></urlset>';
  assert.deepEqual(sitemapPaths(xml), ['/terms/a/']);
});

test('notify: 본문 모양과 응답 코드 로그, 가짜 fetch', async () => {
  const calls: any[] = [];
  const logs: string[] = [];
  const key = 'a'.repeat(32);
  const codes = await notify(key, ['https://doctoryoon.kr/terms/a/', 'https://doctoryoon.kr/terms/a/'], async (url, init) => {
    calls.push({ url, init });
    return { status: 202 };
  }, (l) => logs.push(l));
  assert.deepEqual(codes, [202]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.indexnow.org/indexnow');
  assert.equal(calls[0].init.method, 'POST');
  assert.deepEqual(JSON.parse(calls[0].init.body), buildBody(key, ['https://doctoryoon.kr/terms/a/']));
  assert.deepEqual(JSON.parse(calls[0].init.body), {
    host: 'doctoryoon.kr', key, keyLocation: `https://doctoryoon.kr/${key}.txt`, urlList: ['https://doctoryoon.kr/terms/a/'],
  });
  assert.match(logs[0], /202/);
});

test('notify: 422도 던지지 않고 로그만, 주소 없으면 호출 안 함, 네트워크 오류도 삼킴', async () => {
  const logs: string[] = [];
  assert.deepEqual(await notify('k', ['u'], async () => ({ status: 422 }), (l) => logs.push(l)), [422]);
  assert.match(logs[0], /422/);
  let called = false;
  assert.deepEqual(await notify('k', [], async () => { called = true; return { status: 200 }; }, () => {}), []);
  assert.equal(called, false);
  assert.deepEqual(await notify('k', ['u'], async () => { throw new Error('boom'); }, (l) => logs.push(l)), [0]);
});

test('notify: 10,000개 넘으면 나눠 보내요', async () => {
  const urls = Array.from({ length: MAX_PER_POST + 5 }, (_, i) => `https://doctoryoon.kr/p/${i}/`);
  const sizes: number[] = [];
  await notify('k', urls, async (_u, init) => { sizes.push(JSON.parse(init.body).urlList.length); return { status: 200 }; }, () => {});
  assert.deepEqual(sizes, [MAX_PER_POST, 5]);
});
