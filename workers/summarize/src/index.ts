export interface Env {
  OPENAI_API_KEY: string;
}

const EMBEDDINGS_URL = 'https://doctoryoon.kr/ask-embeddings.json';

const ALLOWED_ORIGINS = [
  'https://doctoryoon.kr',
  'https://www.doctoryoon.kr',
];

const SYSTEM_PROMPT = `당신은 치과 정보 블로그 '윤원장의 치과사전'의 검색 도우미입니다.
블로그를 쓴 치과의사 윤원장의 말투를 그대로 따라서 답변하세요.

윤원장의 말투 특징:
- 환자의 걱정이나 불안을 먼저 공감합니다. ("많이 걱정되셨죠", "불안하실 거예요")
- 부드러운 존댓말을 씁니다. ("~거예요", "~이에요", "~있습니다")
- 짧은 문장으로 끊어서 설명합니다.
- 단정하지 않고 가능성을 열어둡니다. ("~경우가 많아요", "~수 있어요")
- 정확하고 쉽게 풀어서 설명합니다.

규칙:
- 아래 블로그 글 내용만 바탕으로 답변하세요.
- 진단하거나 처방하지 마세요.
- 3~5문장으로 짧게 정리하세요.
- 마지막에 "다만, 실제 상황은 검사 결과에 따라 달라질 수 있어요." 류의 안내를 자연스럽게 포함하세요.`;

const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 256;

interface ChunkData {
  slug: string;
  title: string;
  tags: string[];
  topicHub: string | null;
  image: string | null;
  chunkIdx: number;
  text: string;
  embedding: number[];
}

interface SearchResultItem {
  slug: string;
  title: string;
  tags: string[];
  topicHub: string | null;
  image: string | null;
  excerpt: string;
  score: number;
}

// ─── Rate Limiting ───

const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string, maxPerMinute = 10): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < 60_000);
  if (recent.length >= maxPerMinute) return true;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// ─── CORS ───

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && (ALLOWED_ORIGINS.includes(origin) || origin.startsWith('http://localhost:'))
      ? origin
      : ALLOWED_ORIGINS[0];

  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// ─── Vector Math ───

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── Embeddings Cache ───

let cachedEmbeddings: ChunkData[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 3600_000; // 1 hour

async function loadEmbeddings(): Promise<ChunkData[]> {
  const now = Date.now();
  if (cachedEmbeddings && now - cacheTimestamp < CACHE_TTL) {
    return cachedEmbeddings;
  }

  const res = await fetch(EMBEDDINGS_URL);
  if (!res.ok) throw new Error(`Failed to fetch embeddings: ${res.status}`);

  cachedEmbeddings = await res.json() as ChunkData[];
  cacheTimestamp = now;
  return cachedEmbeddings;
}

// ─── Main Handler ───

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = (await request.json()) as { query?: string };

      if (!body.query?.trim()) {
        return new Response(JSON.stringify({ error: 'Missing query' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const query = body.query.trim();

      // 1. Load embeddings
      const chunks = await loadEmbeddings();

      // 2. Embed the query
      const embeddingRes = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: EMBEDDING_MODEL,
          dimensions: EMBEDDING_DIMENSIONS,
          input: query,
        }),
      });

      if (!embeddingRes.ok) {
        return new Response(JSON.stringify({ error: 'Embedding API error' }), {
          status: 502,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      const embeddingData = (await embeddingRes.json()) as {
        data: { embedding: number[] }[];
      };
      const queryEmbedding = embeddingData.data[0].embedding;

      // 3. Cosine similarity search
      const scored = chunks.map((chunk) => ({
        ...chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      }));
      scored.sort((a, b) => b.score - a.score);

      // 4. Deduplicate by slug, keep best chunk per post
      const seen = new Set<string>();
      const topChunks: (ChunkData & { score: number })[] = [];
      for (const item of scored) {
        if (topChunks.length >= 5) break;
        if (!seen.has(item.slug)) {
          seen.add(item.slug);
          topChunks.push(item);
        }
      }

      if (topChunks.length === 0 || topChunks[0].score < 0.2) {
        return new Response(JSON.stringify({ summary: null, results: [] }), {
          status: 200,
          headers: { ...headers, 'Content-Type': 'application/json' },
        });
      }

      // 5. Build context for LLM
      const context = topChunks
        .slice(0, 5)
        .map((c, i) => `[글 ${i + 1}] ${c.title}\n${c.text}`)
        .join('\n\n');

      const userPrompt = `질문: ${query}\n\n참고할 블로그 글:\n${context}`;

      // 6. Summarize with gpt-4o-mini
      const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 400,
          temperature: 0.3,
        }),
      });

      let summary: string | null = null;
      if (chatRes.ok) {
        const chatData = (await chatRes.json()) as {
          choices: { message: { content: string } }[];
        };
        summary = chatData.choices?.[0]?.message?.content?.trim() ?? null;
      }

      // 7. Build results (top 3 for client)
      const results: SearchResultItem[] = topChunks.slice(0, 3).map((c) => ({
        slug: c.slug,
        title: c.title,
        tags: c.tags,
        topicHub: c.topicHub,
        image: c.image,
        excerpt: c.text.slice(0, 150) + (c.text.length > 150 ? '…' : ''),
        score: Math.round(c.score * 1000) / 1000,
      }));

      return new Response(JSON.stringify({ summary, results }), {
        status: 200,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }
  },
};
