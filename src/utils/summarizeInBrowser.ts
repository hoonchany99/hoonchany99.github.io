const WORKER_URL = 'https://doctoryoon-summarize.hoonchany99.workers.dev';

export interface AskResult {
  slug: string;
  title: string;
  tags: string[];
  topicHub: string | null;
  image: string | null;
  excerpt: string;
  score: number;
}

export interface AskResponse {
  summary: string | null;
  results: AskResult[];
}

export async function askWorker(query: string): Promise<AskResponse> {
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) return { summary: null, results: [] };

    return (await res.json()) as AskResponse;
  } catch {
    return { summary: null, results: [] };
  }
}
