import { useEffect, useMemo, useState } from 'react';
import { TERM_INDEX_BAR, compareTermNames, getChosungGroup, getTermChosung } from '../utils/korean';

export interface TermItem {
  slug: string;
  name: string;
  /** 영문명 — 한국 제도 용어 등 대응어가 없으면 없음 */
  en?: string;
  definition: string;
  /** 검색 매칭용 키워드 — 화면에는 쓰지 않는다 */
  aliases: string[];
  /** 카드에 표시하는 진짜 동의어 */
  synonyms?: string[];
}

const PAGE_SIZE = 48;

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, '');
}

export function TermsEncyclopedia() {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [chosung, setChosung] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    fetch('/terms-index.json')
      .then((res) => {
        if (!res.ok) throw new Error('용어 목록을 불러오지 못했어요');
        return res.json() as Promise<TermItem[]>;
      })
      .then((data) => {
        if (!cancelled) {
          setTerms(data);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setLoadError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, chosung]);

  const enriched = useMemo(
    () =>
      terms.map((term) => ({
        ...term,
        chosungGroup: getChosungGroup(getTermChosung(term.name)),
      })),
    [terms]
  );

  const availableIndex = useMemo(() => {
    const set = new Set(enriched.map((t) => t.chosungGroup));
    return new Set(TERM_INDEX_BAR.filter((c) => set.has(c)));
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = normalizeQuery(query);
    const list = enriched.filter((term) => {
      if (chosung && term.chosungGroup !== chosung) return false;
      if (!q) return true;
      const haystack = normalizeQuery(
        [
          term.name,
          term.en ?? '',
          term.definition,
          ...term.aliases,
          ...(term.synonyms ?? []),
        ].join(' ')
      );
      return haystack.includes(q);
    });
    return list.sort((a, b) => compareTermNames(a.name, b.name));
  }, [enriched, query, chosung]);

  const visibleTerms = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const synonyms = (term: TermItem) =>
    (term.synonyms ?? []).filter((a) => a !== term.name).slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="치과사전 불러오는 중">
        <div className="h-16 rounded-2xl bg-gray-100 animate-pulse" />
        <div className="h-14 rounded-xl bg-gray-100 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-gray-50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-16 px-4 text-gray-500">
        <p className="text-lg font-semibold text-gray-800 mb-2">목록을 불러오지 못했어요</p>
        <p className="text-sm mb-4">{loadError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="text-sm font-semibold text-brand hover:underline"
        >
          새로고침
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 검색 + 카운터 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6 p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="relative flex-1 min-w-0">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="용어 검색 (예: 임플란트, 충치, 스케일링…)"
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-brand transition-colors"
            autoComplete="off"
          />
        </div>
        <p className="text-sm text-gray-500 whitespace-nowrap sm:pl-2">
          {filtered.length === terms.length ? (
            <>
              전체 <strong className="text-brand font-bold">{terms.length}</strong>개
            </>
          ) : (
            <>
              <strong className="text-brand font-bold">{filtered.length}</strong>개 표시
              <span className="text-gray-300 mx-1">/</span>
              {terms.length}개
            </>
          )}
        </p>
      </div>

      {/* 초성 · A-Z · 0-9 */}
      <div className="flex flex-wrap gap-1.5 mb-8 p-3 bg-gray-50 rounded-xl">
        <button
          type="button"
          onClick={() => setChosung(null)}
          className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-bold transition-all ${
            chosung === null
              ? 'bg-brand text-white'
              : 'text-gray-500 hover:bg-white hover:border hover:border-gray-200'
          }`}
        >
          전체
        </button>
        {TERM_INDEX_BAR.map((c) => {
          const enabled = availableIndex.has(c);
          const isWide = c === 'A-Z' || c === '0-9';
          return (
            <button
              key={c}
              type="button"
              disabled={!enabled}
              onClick={() => setChosung(chosung === c ? null : c)}
              className={`${isWide ? 'min-w-[44px] px-2.5' : 'min-w-[36px]'} h-9 rounded-lg text-sm font-bold transition-all ${
                !enabled
                  ? 'opacity-30 cursor-default text-gray-400'
                  : chosung === c
                    ? 'bg-brand-dark text-white'
                    : 'text-gray-600 hover:bg-white hover:border hover:border-gray-200'
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* 카드 그리드 */}
      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleTerms.map((term) => {
              const syn = synonyms(term);
              return (
                <a
                  key={term.slug}
                  href={`/terms/${term.slug}/`}
                  className="group relative block bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-brand/40 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <span className="absolute top-5 right-5 text-brand opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                    →
                  </span>
                  <div className="mb-3 pr-6">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand transition-colors">
                      {term.name}
                    </h2>
                    {term.en && (
                      <p className="text-xs font-medium text-brand/70 tracking-wide mt-0.5">
                        {term.en}
                      </p>
                    )}
                    {syn.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {syn.join(' · ')}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {term.definition}
                  </p>
                </a>
              );
            })}
          </div>
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:border-brand hover:text-brand transition-colors"
              >
                더 보기 ({filtered.length - visibleCount}개 남음)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 px-4 text-gray-500">
          <div className="text-4xl mb-4 opacity-40">🔍</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">검색 결과가 없습니다</h2>
          <p className="text-sm">다른 검색어나 초성을 선택해 보세요.</p>
        </div>
      )}
    </div>
  );
}
