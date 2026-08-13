import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { termsCanonical } from '../../src/data/termsCanonical.ts';
import { termDetailsBySlug } from '../../src/data/termDetails.ts';
import { termFaqsBySlug } from '../../src/data/termFaqs.ts';
import { authoredBySlug } from '../../src/data/termsAuthored.ts';
import { compareTermNames } from '../../src/utils/korean.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, '../../public/terms-index.json');

function truncateDefinition(def: string, max = 140): string {
  if (def.length <= max) return def;
  return `${def.slice(0, max).trimEnd()}…`;
}

/** 클라이언트 치과사전 목록용 경량 JSON (public/terms-index.json) */
export function writeTermsIndex(): number {
  const items = termsCanonical
    // 페이지가 있는 용어만 목록에 넣는다 (generate-terms-from-posts와 같은 기준)
    .filter(
      (term) =>
        authoredBySlug[term.slug] ??
        (termDetailsBySlug[term.slug] && termFaqsBySlug[term.slug]?.length)
    )
    .map((term) => ({
      slug: term.slug,
      name: term.name,
      definition: truncateDefinition(
        authoredBySlug[term.slug]?.definition ?? term.definition
      ),
      aliases: term.aliases.slice(0, 5),
    }))
    .sort((a, b) => compareTermNames(a.name, b.name));

  const dir = path.dirname(OUT_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(items), 'utf-8');
  return items.length;
}
