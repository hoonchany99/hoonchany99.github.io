/** 용어 페이지 GA4 이벤트 스크립트 시험. 실제 파일을 vm에서 가짜 window·document로 돌려요. `npm run test-ga-events` */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SRC = readFileSync(new URL('../src/scripts/ga-term-events.js', import.meta.url), 'utf8');

type Fn = (e?: unknown) => void;
type El = {
  tagName?: string; open?: boolean; attrs?: Record<string, string>;
  within?: string[]; // closest()가 찾아 줄 선택자
  list?: El[]; // querySelectorAll('details')
};

function setup(opts: { gtag?: boolean; scrollHeight?: number; clientHeight?: number } = {}) {
  const calls: [string, Record<string, unknown>][] = [];
  const handlers: Record<string, Fn[]> = {};
  const frames: Fn[] = []; // 실제 rAF처럼 다음 프레임에 실행
  const win: Record<string, unknown> = {
    pageYOffset: 0,
    addEventListener: (t: string, f: Fn) => (handlers['w:' + t] ??= []).push(f),
    requestAnimationFrame: (f: Fn) => frames.push(f),
  };
  if (opts.gtag !== false) win.gtag = (_e: string, n: string, p: Record<string, unknown>) => calls.push([n, JSON.parse(JSON.stringify(p))]);
  const doc = {
    documentElement: { scrollHeight: opts.scrollHeight ?? 4000, clientHeight: opts.clientHeight ?? 800, scrollTop: 0 },
    addEventListener: (t: string, f: Fn) => (handlers['d:' + t] ??= []).push(f),
  };
  vm.runInNewContext(SRC, { window: win, document: doc, Array });
  win.window = win;
  return {
    calls,
    scrollTo(y: number) { win.pageYOffset = y; handlers['w:scroll'].forEach((f) => f()); handlers['w:scroll'].forEach((f) => f()); frames.splice(0).forEach((f) => f()); },
    click(a: El) { handlers['d:click'].forEach((f) => f({ target: wrap(a) })); },
    toggle(d: El) { handlers['d:toggle'].forEach((f) => f({ target: wrap(d) })); },
  };
}

/** closest()가 within에 든 선택자만 찾는 가짜 요소 */
function wrap(e: El): unknown {
  const self: Record<string, unknown> = {
    tagName: e.tagName, open: e.open,
    getAttribute: (k: string) => e.attrs?.[k] ?? null,
    hasAttribute: (k: string) => !!e.attrs && k in e.attrs,
    closest(sel: string) {
      if (sel === 'a[href]') return e.attrs && 'href' in e.attrs ? self : null;
      return e.within?.includes(sel) ? (sel === '#faq' ? { querySelectorAll: () => (e.list ?? []).map(wrap) } : {}) : null;
    },
  };
  return self;
}

test('스크롤: 보이는 비율이 25·50·75를 넘을 때 한 번씩, 숫자로', () => {
  const t = setup(); // 보이는 비율 = (y+800)/4000
  t.scrollTo(100); // 22.5%
  assert.equal(t.calls.length, 0);
  t.scrollTo(300); // 27.5%
  t.scrollTo(400); // 30%
  t.scrollTo(1300); // 52.5%
  t.scrollTo(2400); // 80% — 75 통과
  t.scrollTo(0);
  t.scrollTo(3200); // 다시 지나가도 또 보내지 않음
  assert.deepEqual(t.calls.map((c) => c[1].percent_scrolled), [25, 50, 75]);
  assert.ok(t.calls.every((c) => c[0] === 'scroll_depth' && typeof c[1].percent_scrolled === 'number'));
});

test('스크롤: 한 번에 멀리 뛰면 지난 기준을 모두 한 번씩', () => {
  const t = setup();
  t.scrollTo(3200);
  assert.deepEqual(t.calls.map((c) => c[1].percent_scrolled), [25, 50, 75]);
});

test('목차 클릭은 구역 id만 보내요', () => {
  const t = setup();
  t.click({ attrs: { href: '#faq', 'data-toc-link': 'faq' }, within: ['main', 'nav'] });
  assert.deepEqual(t.calls, [['toc_click', { toc_target: 'faq' }]]);
});

test('관련 용어 카드·본문 링크는 placement로 나눠요', () => {
  const t = setup();
  t.click({ attrs: { href: '/terms/implant/' }, within: ['main', '#related-terms'] });
  t.click({ attrs: { href: '/terms/crown/' }, within: ['main'] });
  assert.deepEqual(t.calls, [
    ['related_term_click', { link_term: 'implant', placement: 'related_card' }],
    ['internal_link_click', { link_term: 'crown', placement: 'body' }],
  ]);
});

test('용어 slug 링크가 아니면 보내지 않아요 (목록·외부·머리글·바닥글·글 링크)', () => {
  const t = setup();
  t.click({ attrs: { href: '/terms/' }, within: ['main'] });
  t.click({ attrs: { href: 'https://example.com/terms/a/' }, within: ['main'] });
  t.click({ attrs: { href: '/posts/x/' }, within: ['main'] });
  t.click({ attrs: { href: '/terms/crown/' }, within: [] }); // main 밖(머리글·바닥글)
  t.click({ attrs: { href: '/terms/crown/' }, within: ['main', 'nav'] }); // 다른 nav
  assert.deepEqual(t.calls, []);
});

test('FAQ는 열릴 때만, 순번(1부터)만 보내요', () => {
  const t = setup();
  const d1: El = { tagName: 'DETAILS', open: true };
  const d2: El = { tagName: 'DETAILS', open: true };
  const list = [d1, d2];
  t.toggle({ ...d2, within: ['#faq'], list });
  t.toggle({ tagName: 'DETAILS', open: false, within: ['#faq'], list }); // 닫힘
  t.toggle({ tagName: 'DETAILS', open: true, within: [], list }); // FAQ 밖
  assert.equal(t.calls.length, 1);
  assert.equal(t.calls[0][0], 'faq_open');
  assert.equal(t.calls[0][1].placement, 'faq');
  assert.equal(typeof t.calls[0][1].faq_index, 'number');
});

test('gtag가 없으면 아무것도 하지 않고 오류도 없어요', () => {
  const t = setup({ gtag: false });
  t.scrollTo(3200);
  t.click({ attrs: { href: '#a', 'data-toc-link': 'a' } });
  assert.deepEqual(t.calls, []);
});

test('보내는 값에 글자(링크 문구·질문·검색어)가 없어요', () => {
  const t = setup();
  t.click({ attrs: { href: '/terms/crown/' }, within: ['main', '#related-terms'] });
  t.scrollTo(3200);
  const keys = new Set(t.calls.flatMap((c) => Object.keys(c[1])));
  assert.deepEqual([...keys].sort(), ['link_term', 'percent_scrolled', 'placement']);
});

test('크기: 인라인 2KB 안팎', () => {
  assert.ok(Buffer.byteLength(SRC) < 2200, `size ${Buffer.byteLength(SRC)}`);
});
