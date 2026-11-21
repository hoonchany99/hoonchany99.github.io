/**
 * JSON-LD를 schema.org 어휘 기준으로 검사해요 (없는 타입·없는 속성·그 타입에 못 쓰는 속성·값 모양).
 * 어휘는 schema.org v29.2(https://schema.org/version/29.2/)에서 타입 상속과 속성의 domainIncludes/rangeIncludes만 뽑은
 * scripts/lib/schemaorg-vocab.json이에요. 새 어휘가 필요하면 그 파일을 새 버전으로 다시 뽑아요(의존성 추가 없음).
 * Ahrefs 「Structured data has schema.org validation error」를 다시 안 만들려고 둔 검사예요.
 */
import { readFileSync } from 'node:fs';

type Vocab = { version: string; types: Record<string, string[]>; props: Record<string, { d: string[]; r: string[] }> };
const vocab: Vocab = JSON.parse(readFileSync(new URL('./schemaorg-vocab.json', import.meta.url), 'utf8'));

const PRIMITIVES = new Set(['Text', 'URL', 'Number', 'Integer', 'Float', 'Boolean', 'Date', 'DateTime', 'Time']);
// schema.org 안에서 Text의 하위로 보는 값 모양(CssSelectorType·XPathType 등)은 문자열을 그대로 받아요
const TEXT_LIKE = new Set(['Text', 'URL', 'CssSelectorType', 'XPathType', 'PronounceableText']);

const closureCache = new Map<string, Set<string>>();
/** 타입과 그 모든 상위 타입 */
function closure(type: string): Set<string> {
  const hit = closureCache.get(type);
  if (hit) return hit;
  const out = new Set<string>([type]);
  for (const parent of vocab.types[type] ?? []) for (const t of closure(parent)) out.add(t);
  closureCache.set(type, out);
  return out;
}

const asArray = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x]);

function scalarMatches(range: string[], value: string | number | boolean): boolean {
  // 값 타입이 개체(Thing 등)뿐인 속성에 주소 문자열을 쓰는 건 BreadcrumbList.item처럼 Google 문서가 권하는 쓰는 법이라 받아요
  if (typeof value === 'string' && /^https?:\/\/\S+$/.test(value) && range.some((r) => !PRIMITIVES.has(r) && r in vocab.types)) return true;
  return range.some((r) => {
    if (r === 'Text') return typeof value === 'string';
    if (r === 'URL') return typeof value === 'string' && /^https?:\/\/\S+$/.test(value);
    if (r === 'Number' || r === 'Float') return typeof value === 'number' || (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value));
    if (r === 'Integer') return Number.isInteger(value) || (typeof value === 'string' && /^-?\d+$/.test(value));
    if (r === 'Boolean') return typeof value === 'boolean';
    if (r === 'Date') return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (r === 'DateTime') return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/.test(value);
    if (r === 'Time') return typeof value === 'string' && /^\d{2}:\d{2}/.test(value);
    return TEXT_LIKE.has(r) && typeof value === 'string';
  });
}

function checkNode(node: unknown, path: string, errors: string[]): void {
  if (Array.isArray(node)) {
    node.forEach((n, i) => checkNode(n, `${path}[${i}]`, errors));
    return;
  }
  if (node === null || typeof node !== 'object') return;
  const obj = node as Record<string, unknown>;
  const rawType = obj['@type'];
  if (rawType === undefined) {
    // @graph·@context만 있는 겉껍질은 안쪽만 본다
    if (obj['@graph']) checkNode(obj['@graph'], `${path}.@graph`, errors);
    return;
  }
  const types = asArray(rawType as string | string[]);
  for (const t of types) if (!(t in vocab.types)) errors.push(`${path}: 없는 타입 ${String(t)}`);
  const known = types.filter((t) => t in vocab.types);
  if (known.length === 0) return;
  const allowed = new Set<string>();
  for (const t of known) for (const c of closure(t)) allowed.add(c);

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('@')) {
      if (key === '@context' && value !== 'https://schema.org' && value !== 'https://schema.org/') {
        errors.push(`${path}: @context가 https://schema.org가 아님 (${JSON.stringify(value)})`);
      }
      continue;
    }
    const prop = vocab.props[key];
    if (!prop) {
      errors.push(`${path}: ${known.join('+')}에 없는 속성 ${key} (schema.org에 그런 속성이 없음)`);
      continue;
    }
    if (!prop.d.some((d) => allowed.has(d))) {
      errors.push(`${path}: ${key}는 ${known.join('+')}에 못 씀 (쓸 수 있는 타입: ${prop.d.join(', ')})`);
    }
    for (const v of asArray(value)) {
      const here = `${path}.${key}`;
      if (v === null || v === undefined || v === '') {
        errors.push(`${here}: 빈 값`);
      } else if (typeof v === 'object') {
        const vt = (v as Record<string, unknown>)['@type'];
        if (vt === undefined) {
          if (!('@id' in (v as object))) errors.push(`${here}: 객체인데 @type이 없음`);
          continue;
        }
        const vtypes = asArray(vt as string | string[]).filter((t) => t in vocab.types);
        const fits = vtypes.some((t) => [...closure(t)].some((c) => prop.r.includes(c)));
        if (vtypes.length && !fits) errors.push(`${here}: ${vtypes.join('+')}은 이 속성의 값 타입이 아님 (받는 타입: ${prop.r.join(', ')})`);
        checkNode(v, here, errors);
      } else if (!scalarMatches(prop.r, v as string | number | boolean)) {
        errors.push(`${here}: 값 모양이 안 맞음 ${JSON.stringify(v).slice(0, 60)} (받는 타입: ${prop.r.join(', ')})`);
      }
    }
  }
}

/** JSON-LD 한 덩어리를 검사해서 오류 문장 목록을 돌려줘요 (비면 통과) */
export function checkJsonLd(data: unknown, label = '$'): string[] {
  const errors: string[] = [];
  checkNode(data, label, errors);
  return errors;
}

/** HTML 안의 <script type="application/ld+json"> 들을 꺼내 검사해요. JSON이 깨졌으면 그것도 오류예요 */
export function checkHtmlJsonLd(html: string): { count: number; errors: string[] } {
  const errors: string[] = [];
  let count = 0;
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    count += 1;
    let data: unknown;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      errors.push(`JSON-LD #${count}: JSON 문법 오류`);
      continue;
    }
    errors.push(...checkJsonLd(data, `JSON-LD #${count}(${String((data as Record<string, unknown>)['@type'])})`));
  }
  return { count, errors };
}

export const SCHEMA_ORG_VERSION = vocab.version;
