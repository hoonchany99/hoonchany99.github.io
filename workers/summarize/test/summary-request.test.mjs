// Runs the real worker handler with a mocked fetch (no network, no OpenAI calls)
// and asserts the outgoing Chat Completions body. `node --test` (Node >= 22.18 strips TS types).
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker, { buildSummaryRequest } from '../src/index.ts';

const realFetch = globalThis.fetch;
let chatBodies;
let chatRaw;
let ipSeq = 0;

beforeEach(() => {
  chatBodies = [];
  chatRaw = [];
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    if (u === 'https://doctoryoon.kr/ask-embeddings.json') {
      return Response.json([
        { slug: 'a', title: '임플란트 통증', tags: [], topicHub: null, image: null, chunkIdx: 0, text: '본문', embedding: [1, 0] },
      ]);
    }
    if (u === 'https://api.openai.com/v1/embeddings') {
      return Response.json({ data: [{ embedding: [1, 0] }] });
    }
    if (u === 'https://api.openai.com/v1/chat/completions') {
      chatRaw.push(init.body);
      chatBodies.push(JSON.parse(init.body));
      return Response.json({ choices: [{ message: { content: ' 요약 ' } }] });
    }
    throw new Error(`unexpected fetch: ${u}`);
  };
});
afterEach(() => { globalThis.fetch = realFetch; });

async function ask(env) {
  const req = new Request('https://worker.test/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': `10.0.0.${++ipSeq}` },
    body: JSON.stringify({ query: '임플란트 아파요' }),
  });
  const res = await worker.fetch(req, { OPENAI_API_KEY: 'test-key', ...env });
  return { status: res.status, json: await res.json() };
}

test('default model is gpt-6-luna with reasoning_effort none', async () => {
  const { status, json } = await ask({});
  assert.equal(status, 200);
  assert.equal(json.summary, '요약');
  assert.equal(chatBodies.length, 1);
  const body = chatBodies[0];
  assert.equal(buildSummaryRequest({}, 'q').model, 'gpt-6-luna');
  assert.equal(body.model, 'gpt-6-luna');
  assert.equal(body.reasoning_effort, 'none');
  assert.equal(body.max_completion_tokens, 400);
  assert.equal(body.temperature, 0.3);
  assert.equal('max_tokens' in body, false);
  assert.equal(body.messages[0].role, 'system');
  assert.match(body.messages[1].content, /질문: 임플란트 아파요/);
});

test('SUMMARY_MODEL=gpt-4o-mini rollback sends the exact pre-migration body', async () => {
  await ask({ SUMMARY_MODEL: 'gpt-4o-mini' });
  const { messages } = chatBodies[0];
  assert.equal(messages[0].role, 'system');
  assert.match(messages[0].content, /^당신은 치과 정보 블로그 '윤원장의 치과사전'의 검색 도우미입니다\./);
  assert.equal(messages[1].role, 'user');
  // Same keys, same order, same values as master's hard-coded request -> byte-identical JSON.
  const oldShape = { model: 'gpt-4o-mini', messages, max_tokens: 400, temperature: 0.3 };
  assert.equal(chatRaw[0], JSON.stringify(oldShape));
});

test('gpt-4 family match is case-insensitive and trimmed', () => {
  const body = buildSummaryRequest({ SUMMARY_MODEL: '  GPT-4o-mini ' }, 'q');
  assert.equal(body.model, 'GPT-4o-mini');
  assert.deepEqual(Object.keys(body), ['model', 'messages', 'max_tokens', 'temperature']);
  const luna = buildSummaryRequest({ SUMMARY_MODEL: ' GPT-6-Luna ' }, 'q');
  assert.equal(luna.reasoning_effort, 'none');
});

test('unknown model: no reasoning_effort (none unconfirmed), no temperature', async () => {
  await ask({ SUMMARY_MODEL: 'gpt-6-astra' });
  const body = chatBodies[0];
  assert.equal(body.model, 'gpt-6-astra');
  assert.deepEqual(Object.keys(body), ['model', 'messages', 'max_completion_tokens']);
  assert.equal(body.max_completion_tokens, 400);
});

test('blank SUMMARY_MODEL falls back to default', () => {
  assert.equal(buildSummaryRequest({ SUMMARY_MODEL: '  ' }, 'q').model, 'gpt-6-luna');
});
