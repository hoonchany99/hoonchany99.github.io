// Guards worker startup in the real runtime. workerd treats every named export of the main module as
// an entrypoint and refuses to start when one is not a function or handler ("Incorrect type for map
// entry ..."); `wrangler deploy --dry-run` and the Node tests do not catch that. This builds the real
// bundle with wrangler (dry run, no deploy), starts it in local workerd via Miniflare and sends one
// request. All outbound fetches are mocked: no network, no OpenAI calls.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Miniflare } from 'miniflare';
import * as mainModule from '../src/index.ts';

const workerDir = fileURLToPath(new URL('..', import.meta.url));
const compatibilityDate = /^compatibility_date\s*=\s*"([^"]+)"/m.exec(
  readFileSync(join(workerDir, 'wrangler.toml'), 'utf8'),
)[1];

test('every named export of the main module is a function (workerd entrypoint rule)', () => {
  for (const [name, value] of Object.entries(mainModule)) {
    if (name === 'default') continue;
    assert.equal(typeof value, 'function', `export "${name}" must be a function or not exported`);
  }
});

test('the wrangler bundle starts in workerd and answers a request', { timeout: 120_000 }, async () => {
  const outdir = mkdtempSync(join(tmpdir(), 'summarize-bundle-'));
  execFileSync(join(workerDir, 'node_modules', '.bin', 'wrangler'), ['deploy', '--dry-run', '--outdir', outdir], {
    cwd: workerDir,
    stdio: 'pipe',
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
  });

  const outbound = [];
  const mf = new Miniflare({
    modules: [{ type: 'ESModule', path: 'index.js', contents: readFileSync(join(outdir, 'index.js'), 'utf8') }],
    compatibilityDate,
    bindings: { OPENAI_API_KEY: 'test-key' },
    outboundService: async (req) => {
      outbound.push(req.url);
      if (req.url === 'https://doctoryoon.kr/ask-embeddings.json') {
        return Response.json([
          { slug: 'a', title: '인레이', tags: [], topicHub: null, image: null, chunkIdx: 0, text: '본문 \uD83D', embedding: [1, 0] },
        ]);
      }
      if (req.url === 'https://api.openai.com/v1/embeddings') return Response.json({ data: [{ embedding: [1, 0] }] });
      if (req.url === 'https://api.openai.com/v1/chat/completions') {
        const raw = await req.text();
        if (/\\ud[89a-f][0-9a-f]{2}/i.test(raw)) return new Response('{"error":{"code":"invalid_json"}}', { status: 400 });
        return Response.json({ choices: [{ message: { content: '요약' } }] });
      }
      return new Response('unexpected', { status: 599 });
    },
  });
  try {
    const res = await mf.dispatchFetch('http://worker.test/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '10.2.0.1' },
      body: JSON.stringify({ query: '인레이랑 레진 차이가 뭐예요?' }),
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.summary, '요약');
    assert.equal(json.results.length, 1);
    assert.deepEqual(outbound, [
      'https://doctoryoon.kr/ask-embeddings.json',
      'https://api.openai.com/v1/embeddings',
      'https://api.openai.com/v1/chat/completions',
    ]);
  } finally {
    await mf.dispose();
  }
});
