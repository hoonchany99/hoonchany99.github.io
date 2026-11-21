/** 본문 내부 링크 렌더·검사 시험. `npm run test-term-links` */
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDetail, stripLinks, sentenceBullets } from '../src/lib/termSections.ts';
import { checkSectionLinks, fieldsWithLinks } from './lib/termLinkCheck.ts';

const known = new Set(['a', 'b', 'c', 'd', 'e']);
const parse = (d: string) => parseDetail(d).sections;

test('내부 링크는 글만 남기고 href 토막이 된다, 각주는 그대로', () => {
  const [sec] = parse('## 제목\n앞 [뜻](/terms/b/)과 뒤예요. [근거](https://x.org/a "기관: 내용") 다음 문장.');
  assert.equal(sec.paragraphs[0], '앞 뜻과 뒤예요. 다음 문장.');
  const [p1, p2] = sec.pieces[0];
  assert.deepEqual(p1.segs, [{ text: '앞 ' }, { text: '뜻', href: '/terms/b/' }, { text: '과 뒤예요.' }]);
  assert.equal(p1.cite?.url, 'https://x.org/a');
  assert.equal(p1.cite?.after, '앞 뜻과 뒤예요.');
  assert.equal(p2.text, ' 다음 문장.');
  assert.equal(sec.cites.length, 1);
  assert.equal(sec.links.length, 1);
});

test('링크가 없으면 토막 하나, 글은 그대로', () => {
  const [sec] = parse('## 제목\n그냥 글이에요.');
  assert.deepEqual(sec.pieces[0][0].segs, [{ text: '그냥 글이에요.' }]);
  assert.equal(sec.links.length, 0);
});

test('안내 상자 글머리표 offset이 링크 문법을 뺀 글 기준', () => {
  const [sec] = parse('## !제목\n[뜻](/terms/b/)을 봐요. 둘째예요. [근거](https://x.org/a "기관: 내용")');
  const b = sentenceBullets(sec.pieces[0]);
  assert.equal(b[0].sentence, '뜻을 봐요.');
  assert.equal(b[1].cites.length, 1);
});

test('올바른 링크는 통과', () => {
  assert.deepEqual(checkSectionLinks('a', parse('## 제목\n[x](/terms/b/) [y](/terms/c/) [z](/terms/d/)'), known), []);
});

test('없는 slug · 자기 자신 · 4개 · 외부 주소 · 안내 상자 · 슬래시 없는 주소는 실패', () => {
  const bad = (d: string) => checkSectionLinks('a', parse(d), known);
  assert.match(bad('## 제목\n[x](/terms/zzz/)')[0], /없는 용어 페이지/);
  assert.match(bad('## 제목\n[x](/terms/a/)')[0], /자기 자신/);
  assert.match(bad('## 제목\n[1](/terms/b/) [2](/terms/c/) [3](/terms/d/) [4](/terms/e/)')[0], /4개/);
  assert.match(bad('## 제목\n[x](https://example.com/)')[0], /내부 주소만/);
  assert.match(bad('## 제목\n[x](/blog/foo/)')[0], /내부 주소만/);
  assert.match(bad('## 제목\n[x](/terms/b)')[0], /내부 주소만/);
  assert.match(bad('## !제목\n[x](/terms/b/)')[0], /안내 상자/);
  assert.match(bad('## 제목\n[근거](https://x.org/a)')[0], /내부 주소만/); // 제목 없는 각주는 일반 링크로 잡힘
});

test('링크 4개라도 구역이 나뉘면 구역별로 센다', () => {
  const d = '## 하나\n[1](/terms/b/) [2](/terms/c/)\n\n## 둘\n[3](/terms/d/) [4](/terms/e/)';
  assert.deepEqual(checkSectionLinks('a', parse(d), known), []);
});

test('설명 칸에 링크 문법이 새면 잡고, stripLinks는 글만 남긴다', () => {
  assert.deepEqual(fieldsWithLinks({ definition: '[뜻](/terms/b/)이에요', seoTitle: '제목' }), ['definition']);
  assert.equal(stripLinks('앞 [뜻](/terms/b/) 뒤'), '앞 뜻 뒤');
});
