export interface IndexEntry {
  slug: string;
  title: string;
  description: string;
  bodyText: string;
  tags: string[];
  topicHub: string | null;
  image: string | null;
  date: string | null;
}

export interface SearchResult extends IndexEntry {
  score: number;
  matchedExcerpt: string;
}

const STOP_WORDS = new Set([
  '이', '가', '은', '는', '을', '를', '의', '에', '에서', '으로', '로',
  '와', '과', '도', '만', '까지', '부터', '보다', '처럼', '같이',
  '그', '저', '이것', '그것', '저것', '하다', '되다', '있다', '없다',
  '수', '것', '때', '중', '등', '및', '또', '또는', '그리고', '하지만',
  '그런데', '그래서', '때문에', '위해', '대해', '통해', '따라',
  '좀', '잘', '더', '많이', '정말', '너무', '아주', '매우',
  '해야', '하나요', '인가요', '할까요', '될까요', '건가요', '인데',
]);

function tokenize(text: string): string[] {
  const normalized = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
  const words = normalized.split(/\s+/).filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  const bigrams: string[] = [];
  for (const word of words) {
    if (word.length >= 4) {
      for (let i = 0; i <= word.length - 2; i++) {
        bigrams.push(word.slice(i, i + 2));
      }
    }
  }

  return [...new Set([...words, ...bigrams])];
}

function countMatches(tokens: string[], text: string): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const token of tokens) {
    if (lower.includes(token)) count++;
  }
  return count;
}

function extractExcerpt(query: string, bodyText: string, maxLen = 150): string {
  const lower = bodyText.toLowerCase();
  const queryLower = query.toLowerCase();
  const tokens = queryLower.split(/\s+/).filter((t) => t.length >= 2);

  let bestIdx = 0;
  let bestScore = 0;

  for (let i = 0; i < lower.length - 50; i += 20) {
    const window = lower.slice(i, i + maxLen);
    let score = 0;
    for (const token of tokens) {
      if (window.includes(token)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  const start = Math.max(0, bestIdx);
  let excerpt = bodyText.slice(start, start + maxLen);

  if (start > 0) excerpt = '…' + excerpt;
  if (start + maxLen < bodyText.length) excerpt += '…';

  return excerpt;
}

export function searchPosts(query: string, index: IndexEntry[], maxResults = 3): SearchResult[] {
  if (!query.trim()) return [];

  const tokens = tokenize(query);
  const queryLower = query.toLowerCase();

  const scored = index.map((post) => {
    let score = 0;

    const titleLower = post.title.toLowerCase();
    if (titleLower.includes(queryLower)) {
      score += 25;
    }
    score += countMatches(tokens, post.title) * 10;

    for (const tag of post.tags) {
      const tagLower = tag.toLowerCase();
      for (const token of tokens) {
        if (tagLower.includes(token) || token.includes(tagLower)) {
          score += 8;
        }
      }
    }

    score += countMatches(tokens, post.description) * 3;
    score += countMatches(tokens, post.bodyText) * 1;

    const matchedExcerpt = score > 0 ? extractExcerpt(query, post.bodyText) : '';

    return { ...post, score, matchedExcerpt };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}
