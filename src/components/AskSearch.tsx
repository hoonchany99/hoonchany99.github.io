import { useState, useCallback, useEffect, useRef } from 'react';
import { topicHubs } from '../data/topicHubs';
import type { AskResult } from '../utils/summarizeInBrowser';

type Phase = 'idle' | 'searching' | 'results' | 'no-results';

interface Props {
  compact?: boolean;
}

const EXAMPLE_CHIPS = [
  '신경치료 꼭 해야 하나요?',
  '사랑니는 꼭 빼야 하나요?',
  '크라운이랑 인레이 차이가 뭔가요?',
  '스케일링만 해도 잇몸이 좋아질 수 있나요?',
];

const DISCLAIMER =
  '일반적인 정보를 안내하며, 실제 진단과 치료 계획은 검사에 따라 달라질 수 있습니다.';

const LOADING_STEPS = [
  '질문을 분석하고 있습니다',
  '관련 글을 찾고 있습니다',
  '내용을 정리하고 있습니다',
];

function useTypingEffect(text: string | null, speed = 22) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      setIsDone(false);
      return;
    }

    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, isDone };
}

function useLoadingStep() {
  const [step, setStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setStep(0);
    timerRef.current = setInterval(() => {
      setStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, 1500);
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => () => stop(), []);

  return { step, start, stop };
}

function SearchIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export function AskSearch({ compact = false }: Props) {
  const [query, setQuery] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [results, setResults] = useState<AskResult[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const { displayed: typedSummary, isDone: typingDone } = useTypingEffect(summary);
  const loading = useLoadingStep();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    async (q?: string) => {
      const searchQuery = (q ?? query).trim();
      if (!searchQuery) return;

      if (compact) {
        window.location.href = `/posts/?q=${encodeURIComponent(searchQuery)}`;
        return;
      }

      if (q) setQuery(q);
      setPhase('searching');
      setSummary(null);
      setResults([]);
      loading.start();

      try {
        const { askWorker } = await import('../utils/summarizeInBrowser');
        const response = await askWorker(searchQuery);
        loading.stop();

        if (response.results.length === 0) {
          setPhase('no-results');
          return;
        }

        setResults(response.results);
        setSummary(response.summary);
        setPhase('results');
      } catch {
        loading.stop();
        setPhase('no-results');
      }
    },
    [query, compact],
  );

  useEffect(() => {
    if (compact) return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, []);

  const relatedHub =
    results.length > 0 && results[0].topicHub
      ? topicHubs.find((h) => h.slug === results[0].topicHub) ?? null
      : null;

  const handleReset = () => {
    setPhase('idle');
    setSummary(null);
    setResults([]);
    setQuery('');
    inputRef.current?.focus();
  };

  // ─── Compact 모드 (홈페이지용) ───
  if (compact) {
    return (
      <section className="py-8 md:py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-8">
            <h2 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-1.5 text-center">
              궁금한 치과 질문을 먼저 찾아보세요
            </h2>
            <p className="text-[11px] md:text-sm text-gray-400 mb-4 md:mb-5 text-center">
              블로그 글을 바탕으로, 관련 글과 함께 쉽게 설명해드립니다.
            </p>

            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="예: 신경치료 꼭 해야 하나요?"
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-200 text-[16px] leading-tight md:text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition-all bg-gray-50"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={!query.trim()}
                className="w-11 h-11 md:w-auto md:h-auto md:px-4 md:py-2.5 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 flex items-center justify-center"
              >
                <SearchIcon className="w-5 h-5 md:hidden" />
                <span className="hidden md:inline">질문해보기</span>
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide justify-start md:justify-center md:flex-wrap">
              {EXAMPLE_CHIPS.slice(0, 3).map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setQuery(chip);
                    handleSearch(chip);
                  }}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-brand/40 hover:text-brand hover:bg-brand/5 transition-all whitespace-nowrap shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ─── Full 모드 (/ask/ 페이지용) ───
  return (
    <div className="max-w-5xl mx-auto">
      {/* 헤더 + 검색 영역 */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          글 찾기
        </h1>
        <p className="text-lg text-gray-600">
          궁금한 질문을 입력하면 관련 글을 찾고, 쉽게 정리해드립니다.
        </p>
      </div>

      <div className="max-w-lg mx-auto mb-5">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="궁금한 치과 질문을 입력해보세요"
              className="w-full pl-12 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-200 text-[16px] leading-tight md:text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all bg-white"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || phase === 'searching'}
            className="px-5 py-3 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            질문해보기
          </button>
        </div>
      </div>

      {/* 예시 칩 */}
      {phase === 'idle' && (
        <>
          <div className="flex flex-wrap gap-2 justify-center mb-10 max-w-lg mx-auto">
            {EXAMPLE_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSearch(chip)}
                className="text-xs px-3.5 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand hover:bg-brand/5 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* 주제별 바로가기 */}
          <div className="border-t border-gray-100 pt-8">
            <p className="text-xs text-gray-400 text-center mb-4">또는 주제별로 찾아보세요</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {topicHubs.map((hub) => (
                <a
                  key={hub.slug}
                  href={`/topics/${hub.slug}/`}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:border-brand/20 hover:shadow-sm transition-all group"
                >
                  <span className="text-lg">{hub.icon}</span>
                  <span className="text-xs font-medium text-gray-700 group-hover:text-brand transition-colors">
                    {hub.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 로딩 */}
      {phase === 'searching' && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-[2.5px] border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-600 font-medium mb-1">{LOADING_STEPS[loading.step]}</p>
          <p className="text-xs text-gray-400">잠시만 기다려주세요</p>
        </div>
      )}

      {/* 결과 */}
      {phase === 'results' && (
        <div className="mt-6 space-y-5 max-w-3xl mx-auto">
          {/* AI 요약 */}
          {summary && (
            <div className="bg-brand/[0.03] rounded-2xl p-5 md:p-6 border border-brand/10">
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                <p className="text-xs font-bold text-brand">짧게 정리하면</p>
              </div>
              <p className="text-sm text-gray-700 leading-[1.8]">
                {typedSummary}
                {!typingDone && (
                  <span className="inline-block w-0.5 h-4 bg-brand/60 ml-0.5 animate-pulse align-middle" />
                )}
              </p>
            </div>
          )}

          {/* 관련 글 */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-brand rounded-full inline-block" />
              이 질문과 관련된 글
            </p>
            <div className="space-y-2.5">
              {results.map((post, i) => (
                <a
                  key={post.slug}
                  href={`/posts/${post.slug}/`}
                  className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-brand/20 hover:-translate-y-0.5 transition-all group"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-[11px] font-bold text-gray-400 flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 관련 허브 */}
          {relatedHub && (
            <a
              href={`/topics/${relatedHub.slug}/`}
              className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:border-brand/20 hover:shadow-sm transition-all group"
            >
              <span className="text-2xl">{relatedHub.icon}</span>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-400 mb-0.5">관련 주제 가이드</p>
                <p className="text-sm font-bold text-gray-900 group-hover:text-brand transition-colors">
                  {relatedHub.name} 전체 보기 →
                </p>
              </div>
            </a>
          )}

          {/* 면책 + 하단 액션 */}
          <div className="pt-5 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 text-center leading-relaxed mb-5">{DISCLAIMER}</p>
            <div className="flex flex-wrap gap-2.5 justify-center">
              <button
                onClick={handleReset}
                className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand transition-all"
              >
                다른 질문하기
              </button>
              <a
                href="/topics/"
                className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand transition-all"
              >
                주제별 가이드 보기
              </a>
              <a
                href="/qna/"
                className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand transition-all"
              >
                Q&A에 질문 남기기
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 결과 없음 */}
      {phase === 'no-results' && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1.5">딱 맞는 글을 찾지 못했습니다</p>
          <p className="text-xs text-gray-500 mb-8">
            다른 표현으로 다시 질문해보시거나, 주제별 가이드를 먼저 살펴보세요.
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={handleReset}
              className="text-xs px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand transition-all"
            >
              다른 질문하기
            </button>
            <a
              href="/topics/"
              className="text-xs px-4 py-2 rounded-lg bg-brand text-white font-bold hover:bg-brand-dark transition-all"
            >
              주제별 가이드 보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
