/**
 * IndexNow에 주소 알리기. 표준 입력의 주소(줄마다 하나)를 POST로 보내고 응답 코드를 로그에 찍어요.
 *   npx tsx scripts/indexnow-notify.ts <키 파일 이름(.txt 뺀 키)> < urls.txt
 * 실패해도 exit 0이에요(배포 결과에 영향 없음). 한 번에 최대 10,000개라 넘으면 나눠 보내요.
 */
import { pathToFileURL } from 'node:url';

export const ENDPOINT = 'https://api.indexnow.org/indexnow';
export const HOST = 'doctoryoon.kr';
export const MAX_PER_POST = 10000;

export function buildBody(key: string, urlList: string[]) {
  return { host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList };
}

type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body: string }) => Promise<{ status: number }>;

/** 주소를 중복 없이 묶어 보내고 묶음마다 응답 코드를 돌려줘요. 던지지 않아요. */
export async function notify(
  key: string,
  urls: string[],
  fetchImpl: FetchLike,
  log: (line: string) => void = console.log,
): Promise<number[]> {
  const unique = [...new Set(urls)];
  if (unique.length === 0) {
    log('IndexNow: 보낼 주소 없음');
    return [];
  }
  const codes: number[] = [];
  for (let i = 0; i < unique.length; i += MAX_PER_POST) {
    const chunk = unique.slice(i, i + MAX_PER_POST);
    try {
      const res = await fetchImpl(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(buildBody(key, chunk)),
      });
      codes.push(res.status);
      const ok = res.status === 200 || res.status === 202;
      log(`IndexNow: ${chunk.length}개 보냄 → ${res.status} ${ok ? '(성공)' : '(성공 아님)'}`);
    } catch (e) {
      codes.push(0);
      log(`IndexNow: 보내기 실패 ${e instanceof Error ? e.message : e}`);
    }
  }
  return codes;
}

async function main() {
  const key = process.argv[2];
  if (!key || !/^[0-9a-f]{32}$/.test(key)) {
    console.log('IndexNow: 키가 올바르지 않아요');
    return;
  }
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const urls = input.split('\n').map((s) => s.trim()).filter(Boolean);
  await notify(key, urls, (url, init) => fetch(url, init));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => console.log('IndexNow: 실패', e instanceof Error ? e.message : e));
}
