// Lone UTF-16 surrogates (half an emoji cut at a chunk boundary) used to reach OpenAI as `\udXXX`
// escapes and fail with HTTP 400 invalid_json. Runs the real handler with a mocked fetch (no network,
// no OpenAI calls). Fixture: the 4 real broken chunks from public/ask-embeddings.json, trimmed to the
// 41 characters around the broken code unit.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const fixture = JSON.parse(readFileSync(new URL('./fixtures/lone-surrogate-chunks.json', import.meta.url), 'utf8'));
const QUESTION = '인레이랑 레진 차이가 뭐예요?';
const LONE = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;

// The broken chunks get the query's exact direction so they rank first (the paid query embedding
// is not available offline); a normal chunk sits below them.
const brokenChunks = fixture.map((c) => ({
  slug: c.slug, title: c.title, tags: [], topicHub: null, image: null,
  chunkIdx: c.chunkIdx, text: c.text, embedding: [1, 0],
}));
const normalChunks = [
  { slug: 'inlay', title: '인레이, 가격은 어느 정도일까? 재료별 & 병원별 비교', tags: [], topicHub: null, image: null, chunkIdx: 0, text: '인레이는 충치 부위를 본떠 만든 조각이에요 😊 레진보다 단단해요.', embedding: [0.9, 0.1] },
  { slug: 'resin', title: '레진 치료, 얼마나 갈까?', tags: [], topicHub: null, image: null, chunkIdx: 0, text: '레진은 당일에 끝나요 👇🏻 다만 마모가 빨라요.', embedding: [0.8, 0.2] },
];

const realFetch = globalThis.fetch;
let calls;
let chunksServed;
let ipSeq = 0;

beforeEach(() => {
  calls = { embeddings: [], chat: [] };
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u === 'https://doctoryoon.kr/ask-embeddings.json') return Response.json(chunksServed);
    if (u === 'https://api.openai.com/v1/embeddings') {
      calls.embeddings.push(init.body);
      return Response.json({ data: [{ embedding: [1, 0] }] });
    }
    if (u === 'https://api.openai.com/v1/chat/completions') {
      calls.chat.push(init.body);
      return Response.json({ choices: [{ message: { content: '요약' } }] });
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
});
afterEach(() => { globalThis.fetch = realFetch; });

// Each import gets its own module instance, so the in-module embeddings cache never leaks between cases.
let importSeq = 0;
const freshWorker = (href = new URL('../src/index.ts', import.meta.url).href) =>
  import(`${href}?instance=${++importSeq}`).then((m) => m.default);

async function ask(worker, query, env = {}) {
  const req = new Request('https://worker.test/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': `10.1.0.${++ipSeq}` },
    body: JSON.stringify({ query }),
  });
  const res = await worker.fetch(req, { OPENAI_API_KEY: 'test-key', ...env });
  return { status: res.status, json: await res.json() };
}

function allStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => { out.push(k); allStrings(v, out); });
  return out;
}

function assertWellFormedBody(raw) {
  assert.equal(/\\ud[89a-f][0-9a-f]{2}/i.test(raw), false, 'body has no \\udXXX surrogate escape');
  assert.equal(raw.isWellFormed(), true, 'raw body is well-formed');
  const parsed = JSON.parse(raw);
  for (const s of allStrings(parsed)) assert.equal(s.isWellFormed(), true, `string is well-formed: ${JSON.stringify(s.slice(0, 40))}`);
  return parsed;
}

test('fixture really contains the 4 broken chunks', () => {
  assert.equal(fixture.length, 4);
  for (const c of fixture) {
    assert.equal(c.text.isWellFormed(), false, c.slug);
    assert.equal(c.text.charCodeAt(c.loneAt).toString(16), c.loneCodeUnit);
  }
});

for (const model of ['gpt-6-luna', 'gpt-4o-mini', 'gpt-6-astra']) {
  test(`${model}: chat body with the broken chunks is valid JSON with U+FFFD in place of each lone surrogate`, async () => {
    chunksServed = [...brokenChunks, ...normalChunks];
    const { status, json } = await ask(await freshWorker(), QUESTION, { SUMMARY_MODEL: model });
    assert.equal(status, 200);
    assert.equal(json.summary, '요약');
    assert.equal(calls.chat.length, 1);

    const body = assertWellFormedBody(calls.chat[0]);
    assert.equal(body.model, model);
    const prompt = body.messages[1].content;
    assert.match(prompt, new RegExp(`^질문: ${QUESTION.replace('?', '\\?')}`));
    for (const c of fixture) {
      // Same text with the broken code unit (and only it) replaced by U+FFFD.
      const expected = c.text.slice(0, c.loneAt) + '�' + c.text.slice(c.loneAt + 1);
      assert.ok(prompt.includes(`${c.title}\n${expected}`), `${c.slug}: U+FFFD at the broken char`);
    }
    // Intact emoji in the same prompt are kept as-is.
    assert.ok(prompt.includes('😊'));
    assert.ok(prompt.includes('👇🏻'));
  });
}

test('a question with a lone surrogate gives well-formed embeddings and chat bodies', async () => {
  chunksServed = normalChunks;
  const { status } = await ask(await freshWorker(), '인레이 \uD83D 레진 \uDE00?');
  assert.equal(status, 200);
  assert.equal(calls.embeddings.length, 1);
  const emb = assertWellFormedBody(calls.embeddings[0]);
  assert.equal(emb.input, '인레이 � 레진 �?');
  const chat = assertWellFormedBody(calls.chat[0]);
  assert.match(chat.messages[1].content, /^질문: 인레이 � 레진 �\?/);
});

// Byte-identity against the worker before this change (PR #7 merge, fddce3c), imported side by side.
const BASELINE_COMMIT = 'fddce3c';
function baselineHref() {
  const src = execFileSync('git', ['show', `${BASELINE_COMMIT}:workers/summarize/src/index.ts`], {
    cwd: new URL('.', import.meta.url), encoding: 'utf8',
  });
  const file = join(mkdtempSync(join(tmpdir(), 'summarize-baseline-')), 'index.ts');
  writeFileSync(file, src);
  return pathToFileURL(file).href;
}

test('pre-change worker reproduces the bug: broken chunks reach OpenAI as \\udXXX escapes', async () => {
  chunksServed = [...brokenChunks, ...normalChunks];
  await ask(await freshWorker(baselineHref()), QUESTION);
  assert.match(calls.chat[0], /\\ud83d/);
  assert.match(calls.chat[0], /\\udffb/);
});

test('normal text: embeddings and chat bodies are byte-identical to the pre-change worker', async () => {
  const before = baselineHref();
  chunksServed = normalChunks;
  const questions = [QUESTION, '임플란트 아파요 😢', '  앞뒤 공백  '];
  for (const model of ['gpt-6-luna', 'gpt-4o-mini', 'gpt-6-astra']) {
    for (const q of questions) {
      await ask(await freshWorker(before), q, { SUMMARY_MODEL: model });
      await ask(await freshWorker(), q, { SUMMARY_MODEL: model });
      const [embOld, embNew] = calls.embeddings.splice(0);
      const [chatOld, chatNew] = calls.chat.splice(0);
      assert.ok(embOld && chatOld, `${model} / ${q}: both workers made both calls`);
      assert.equal(embNew, embOld, `${model} / ${q}: embeddings body`);
      assert.equal(chatNew, chatOld, `${model} / ${q}: chat body`);
    }
  }
});
