import { useMemo, useRef, useState } from 'react';

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(text: string) {
  return escapeHtml(text).replace(/`/g, '&#96;');
}

function plainTextToHtml(text: string) {
  const normalized = text.replace(/\r\n/g, '\n').trim();
  if (!normalized) return '';

  const blocks = normalized
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block.split('\n');
      const bulletLike = lines.every((line) => /^\s*(?:[-*•]|\d+[.)])\s+/.test(line));

      if (bulletLike) {
        const items = lines.map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, '').trim());
        return `<ul>${items.map((item) => `<li>${escapeHtml(item).replace(/\n/g, '<br />')}</li>`).join('')}</ul>`;
      }

      return `<p>${escapeHtml(block).replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
}

function sanitizeHtml(html: string) {
  const allowed = new Set([
    'a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'hr', 'i', 'li', 'ol', 'p', 'pre', 'span', 'strong', 'u', 'ul', 's'
  ]);

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  function walk(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeHtml(node.textContent ?? '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    if (tag === 'br') return '<br />';
    if (tag === 'hr') return '<hr />';

    const children = Array.from(el.childNodes).map(walk).join('');

    if (!allowed.has(tag)) {
      return children;
    }

    if (tag === 'a') {
      const href = el.getAttribute('href') || '#';
      return `<a href="${escapeAttr(href)}">${children}</a>`;
    }

    if (tag === 'img') {
      return '';
    }

    return `<${tag}>${children}</${tag}>`;
  }

  const bodyChildren = Array.from(doc.body.childNodes);
  const output = bodyChildren.map(walk).join('');
  return output
    .replace(/(<br \/>\s*){3,}/g, '<br /><br />')
    .replace(/(<\/p>\s*){2,}/g, '</p><p>')
    .trim();
}

function insertHtmlAtCursor(html: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    document.execCommand('insertHTML', false, html);
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const temp = document.createElement('div');
  temp.innerHTML = html;
  const fragment = document.createDocumentFragment();
  let child: ChildNode | null;
  while ((child = temp.firstChild)) {
    fragment.appendChild(child);
  }

  range.insertNode(fragment);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

export default function ParagraphSpacingEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState('<p>Paste text here.</p><p>Paragraphs, headings, and horizontal rules will keep visible spacing.</p>');
  const [copied, setCopied] = useState(false);

  const blockCount = useMemo(() => {
    if (typeof window === 'undefined') return 2;
    const editor = editorRef.current;
    return editor ? editor.querySelectorAll('p, h1, h2, h3, h4, h5, h6, hr, ul, ol, blockquote').length : 2;
  }, [html]);

  const syncHtml = () => {
    const editor = editorRef.current;
    if (editor) setHtml(editor.innerHTML);
  };

  const format = (tag: 'p' | 'h2' | 'blockquote') => {
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    syncHtml();
  };

  const insertHr = () => {
    editorRef.current?.focus();
    document.execCommand('insertHTML', false, '<hr /><p><br /></p>');
    syncHtml();
  };

  const selectAll = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection?.removeAllRanges();
    selection?.addRange(range);
    editor.focus();
  };

  const copyHtml = async () => {
    const editor = editorRef.current;
    if (!editor) return;

    const plain = editor.innerText;
    const html = editor.innerHTML;

    try {
      if ((window as typeof window & { ClipboardItem?: typeof ClipboardItem }).ClipboardItem && navigator.clipboard?.write) {
        const item = new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      selectAll();
      document.execCommand('copy');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => format('p')} className="editor-btn">P</button>
        <button type="button" onClick={() => format('h2')} className="editor-btn">H2</button>
        <button type="button" onClick={() => format('blockquote')} className="editor-btn">Quote</button>
        <button type="button" onClick={insertHr} className="editor-btn">HR</button>
        <button type="button" onClick={selectAll} className="editor-btn">Select all</button>
        <button type="button" onClick={copyHtml} className="editor-btn editor-btn-primary">Copy HTML</button>
        <span className="text-sm text-gray-500">Blocks: {blockCount} {copied ? '· copied!' : ''}</span>
      </div>

      <div
        ref={editorRef}
        id="paragraph-editor"
        contentEditable
        suppressContentEditableWarning
        className="editor-surface"
        onInput={syncHtml}
        onPaste={(e) => {
          const clipboard = e.clipboardData;
          if (!clipboard) return;
          const htmlData = clipboard.getData('text/html');
          const textData = clipboard.getData('text/plain');
          if (!htmlData && !textData) return;
          e.preventDefault();

          const cleaned = htmlData ? sanitizeHtml(htmlData) : plainTextToHtml(textData);
          insertHtmlAtCursor(cleaned);
          syncHtml();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            document.execCommand('insertParagraph');
            syncHtml();
          }
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="text-sm text-gray-500 leading-relaxed">
        Paste from ChatGPT here, then copy this cleaned result into Naver.
        Paragraphs, headings, and horizontal rules get their own visible spacing.
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">Current HTML</div>
        <pre className="editor-preview">{html}</pre>
      </div>
    </div>
  );
}
