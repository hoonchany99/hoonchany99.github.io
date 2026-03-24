import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.resolve(__dirname, '../src/content/posts');
const OUTPUT_PATH = path.resolve(__dirname, '../public/ask-embeddings.json');
const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;
const EMBEDDING_MODEL = 'text-embedding-3-small';
const EMBEDDING_DIMENSIONS = 256;
const BATCH_SIZE = 50;

interface TopicHub {
  slug: string;
  tagKeywords: string[];
}

const topicHubs: TopicHub[] = [
  { slug: 'cavity', tagKeywords: ['충치', '신경치료', '치수염', '근관', '법랑질', '상아질', '레진', '2차충치', '치근단'] },
  { slug: 'implant', tagKeywords: ['임플란트', '뼈이식', '상악동', '골유착', '픽스쳐', '어버트먼트', '임플란트주위염'] },
  { slug: 'crown-inlay', tagKeywords: ['크라운', '인레이', '온레이', '세렉', '보철', '골드크라운', '지르코니아', '세라믹'] },
  { slug: 'wisdom-tooth', tagKeywords: ['사랑니', '발치', '매복', '건조와', '수평사랑니', '치관주위염'] },
  { slug: 'laminate-whitening', tagKeywords: ['라미네이트', '미백', '미니쉬', '제로네이트', '치아미백', '과산화수소', '앞니'] },
  { slug: 'gum-prevention', tagKeywords: ['스케일링', '잇몸', '치주', '치은', '불소', '양치', '치약', '치석', '바스법', '실란트'] },
];

function findTopicHub(tags: string[]): string | null {
  if (!tags?.length) return null;
  let bestSlug: string | null = null;
  let bestScore = 0;
  for (const hub of topicHubs) {
    let score = 0;
    for (const tag of tags) {
      const t = tag.toLowerCase();
      for (const kw of hub.tagKeywords) {
        if (t.includes(kw) || kw.includes(t)) score++;
      }
    }
    if (score > bestScore) { bestScore = score; bestSlug = hub.slug; }
  }
  return bestScore > 0 ? bestSlug : null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function chunkText(text: string): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length >= 50) {
      chunks.push(chunk);
    }
    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

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

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY 환경변수를 설정해주세요.');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  console.log(`📄 ${files.length}개 포스트 발견`);

  const allChunks: Omit<ChunkData, 'embedding'>[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data: fm, content } = matter(raw);

    const slug = file.replace(/\.md$/, '');
    const title = fm.title ?? slug;
    const tags: string[] = fm.tags ?? [];
    const topicHub = findTopicHub(tags);
    const image = fm.image?.path ?? null;

    const bodyText = stripHtml(content);
    const chunks = chunkText(bodyText);

    for (let i = 0; i < chunks.length; i++) {
      allChunks.push({
        slug,
        title,
        tags,
        topicHub,
        image,
        chunkIdx: i,
        text: chunks[i],
      });
    }
  }

  console.log(`🔪 총 ${allChunks.length}개 chunk 생성`);

  const results: ChunkData[] = [];

  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const inputs = batch.map((c) => `${c.title}\n${c.text}`);

    console.log(`🔄 임베딩 생성 중... (${i + 1}~${Math.min(i + BATCH_SIZE, allChunks.length)} / ${allChunks.length})`);

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      input: inputs,
    });

    for (let j = 0; j < batch.length; j++) {
      results.push({
        ...batch[j],
        embedding: response.data[j].embedding,
      });
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results));

  const sizeKB = (fs.statSync(OUTPUT_PATH).size / 1024).toFixed(1);
  console.log(`✅ ${OUTPUT_PATH} 생성 완료 (${sizeKB} KB, ${results.length}개 chunk)`);
}

main().catch((err) => {
  console.error('임베딩 생성 실패:', err);
  process.exit(1);
});
