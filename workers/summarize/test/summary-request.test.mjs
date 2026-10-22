// Runs the real worker handler with a mocked fetch (no network, no OpenAI calls)
// and asserts the outgoing Chat Completions body. `node --test` (Node >= 22.18 strips TS types).
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import worker, { buildSummaryRequest, DEFAULT_SUMMARY_MODEL } from '../src/index.ts';

const realFetch = globalThis.fetch;
let chatBodies;
let ipSeq = 0;

beforeEach(() => {
  chatBodies = [];
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
  assert.equal(DEFAULT_SUMMARY_MODEL, 'gpt-6-luna');
  assert.equal(body.model, 'gpt-6-luna');
  assert.equal(body.reasoning_effort, 'none');
  assert.equal(body.max_completion_tokens, 400);
  assert.equal(body.temperature, 0.3);
  assert.equal('max_tokens' in body, false);
  assert.equal(body.messages[0].role, 'system');
  assert.match(body.messages[1].content, /질문: 임플란트 아파요/);
});

test('SUMMARY_MODEL=gpt-4o-mini rollback omits reasoning_effort', async () => {
  await ask({ SUMMARY_MODEL: 'gpt-4o-mini' });
  const body = chatBodies[0];
  assert.equal(body.model, 'gpt-4o-mini');
  assert.equal('reasoning_effort' in body, false);
  assert.equal(body.max_completion_tokens, 400);
  assert.equal(body.temperature, 0.3);
});

test('blank SUMMARY_MODEL falls back to default', () => {
  assert.equal(buildSummaryRequest({ SUMMARY_MODEL: '  ' }, 'q').model, 'gpt-6-luna');
});
