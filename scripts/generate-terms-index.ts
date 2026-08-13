import { writeTermsIndex } from './lib/writeTermsIndex.ts';

const count = writeTermsIndex();
console.log(`wrote public/terms-index.json (${count} terms)`);
