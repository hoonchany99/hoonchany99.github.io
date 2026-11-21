/**
 * JSON-LD가 schema.org 어휘에 맞는지 시험. `npm run test-schema-jsonld`
 * - 앞부분: 검사기 자체 시험 (고장 난 예시를 잡는지)
 * - 뒷부분: 빌드된 dist/의 모든 HTML JSON-LD 검사. 빌드 뒤에 돌려야 하고, dist가 없으면 CI(CI=true)에선 실패, 로컬에선 건너뜀.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { checkJsonLd, checkHtmlJsonLd } from './lib/schemaorgCheck.ts';

const ok = { '@context': 'https://schema.org', '@type': 'DefinedTerm', name: '충치', description: '설명', url: 'https://doctoryoon.kr/terms/cavity/' };

test('맞는 DefinedTerm은 통과', () => {
  assert.deepEqual(checkJsonLd(ok), []);
});

test('DefinedTerm에 CreativeWork 속성(inLanguage·citation·dateModified)을 쓰면 잡는다', () => {
  const errs = checkJsonLd({ ...ok, inLanguage: 'ko', citation: ['https://a.example/'], dateModified: '2026-01-01' });
  assert.equal(errs.length, 3);
  assert.ok(errs.every((e) => e.includes('DefinedTerm에 못 씀')));
});

test('없는 속성·없는 타입을 잡는다', () => {
  assert.ok(checkJsonLd({ ...ok, notAProperty: 1 }).some((e) => e.includes('notAProperty')));
  assert.ok(checkJsonLd({ '@context': 'https://schema.org', '@type': 'NoSuchType', name: 'x' }).some((e) => e.includes('없는 타입')));
});

test('값 모양: 날짜 형식·잘못된 값 타입·빈 값', () => {
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: 'h' };
  assert.ok(checkJsonLd({ ...article, datePublished: '어제' }).some((e) => e.includes('값 모양')));
  assert.deepEqual(checkJsonLd({ ...article, datePublished: '2026-01-02T03:04:05.000Z', dateModified: '2026-01-02' }), []);
  assert.ok(checkJsonLd({ ...article, author: { '@type': 'WebSite', name: 'x' } }).some((e) => e.includes('값 타입이 아님')));
  assert.ok(checkJsonLd({ ...article, keywords: '' }).some((e) => e.includes('빈 값')));
});

test('복수 @type(Article+MedicalWebPage)은 두 타입의 속성을 모두 쓸 수 있다', () => {
  const a = { '@context': 'https://schema.org', '@type': ['Article', 'MedicalWebPage'], headline: 'h', lastReviewed: '2026-01-01', reviewedBy: { '@type': 'Person', name: 'x' } };
  assert.deepEqual(checkJsonLd(a), []);
});

test('BreadcrumbList.item에 주소 문자열은 허용', () => {
  const b = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: '홈', item: 'https://doctoryoon.kr/' }] };
  assert.deepEqual(checkJsonLd(b), []);
});

test('HTML에서 JSON-LD를 꺼내 보고, 깨진 JSON도 오류로 센다', () => {
  const html = `<script type="application/ld+json">${JSON.stringify({ ...ok, inLanguage: 'ko' })}</script><script type="application/ld+json">{oops</script>`;
  const r = checkHtmlJsonLd(html);
  assert.equal(r.count, 2);
  assert.equal(r.errors.length, 2);
});

function* htmlFiles(dir: string): Generator<string> {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (f.endsWith('.html')) yield p;
  }
}

test('빌드된 모든 페이지의 JSON-LD가 schema.org 검사를 통과', { skip: !existsSync('dist') && !process.env.CI }, () => {
  assert.ok(existsSync('dist'), 'dist/가 없어요. npm run build 뒤에 돌리세요');
  let pages = 0;
  let withLd = 0;
  const failures: string[] = [];
  for (const file of htmlFiles('dist')) {
    pages += 1;
    const { count, errors } = checkHtmlJsonLd(readFileSync(file, 'utf8'));
    if (count) withLd += 1;
    for (const e of errors) failures.push(`${file}: ${e}`);
  }
  assert.ok(pages >= 400, `HTML이 너무 적어요: ${pages}`);
  assert.ok(withLd >= 400, `JSON-LD가 있는 페이지가 너무 적어요: ${withLd}`);
  assert.deepEqual(failures.slice(0, 20), [], `schema.org 오류 ${failures.length}건`);
});
