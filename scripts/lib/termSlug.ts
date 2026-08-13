const CHO = [
  'g', 'gg', 'n', 'd', 'dd', 'r', 'm', 'b', 'bb', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
];
const JUNG = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi',
  'yu', 'eu', 'ui', 'i',
];
const JONG = [
  '', 'g', 'gg', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b',
  'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h',
];

export function normalizeTermName(name: string): string {
  return name
    .replace(/\([^)]*\)/g, '')
    .replace(/[·/]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

export function parseDisplayName(raw: string): { name: string; aliases: string[] } {
  const trimmed = raw.trim();
  const match = trimmed.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    const primary = match[1].trim();
    const alt = match[2].trim();
    return { name: primary, aliases: [...new Set([primary, alt, trimmed])] };
  }
  return { name: trimmed, aliases: [trimmed] };
}

export function romanizeHangul(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 0xac00 && code <= 0xd7a3) {
      const i = code - 0xac00;
      const jong = i % 28;
      const jung = Math.floor((i - jong) / 28) % 21;
      const cho = Math.floor((i - jong) / 28 / 21);
      out += CHO[cho] + JUNG[jung] + JONG[jong];
    } else if (/[a-zA-Z0-9]/.test(ch)) {
      out += ch;
    } else if (/\s/.test(ch)) {
      out += ' ';
    }
  }
  return out.trim();
}

export function toTermSlug(name: string, bdbddcPath: string, used: Set<string>): string {
  const path = bdbddcPath.trim();
  let base = '';

  if (/^[A-Za-z0-9][A-Za-z0-9.\-+/\s]*$/.test(path)) {
    base = path
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/\./g, '-')
      .replace(/[^a-z0-9-+/]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  if (!base) {
    const cleaned = name.replace(/\([^)]*\)/g, ' ').trim();
    base = romanizeHangul(cleaned)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  if (!base) base = 'term';

  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i++}`;
  }
  used.add(slug);
  return slug;
}

export function stubDefinition(name: string): string {
  return `${name}은(는) 치과 진료·상담에서 자주 나오는 용어예요. 아래 FAQ에서 궁금한 점을 확인하거나, AI 검색으로 관련 글을 더 찾아보실 수 있어요.`;
}
