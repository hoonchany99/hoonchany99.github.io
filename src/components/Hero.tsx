interface QuickTerm {
  slug: string;
  name: string;
}

interface Props {
  termCount: number;
  quickTerms: QuickTerm[];
}

export function Hero({ termCount, quickTerms }: Props) {
  return (
    <section className="relative bg-gradient-to-b from-brand-bg via-sky-50 to-white py-20 md:py-28 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="hero-anim-1 text-brand font-semibold text-sm tracking-wide mb-4 uppercase">
          Dr. Yoon's Dental Dictionary
        </p>
        <h1 className="hero-anim-2 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 tracking-tight leading-[1.15]">
          치과가 막막할 때
          <br />
          기준이 되는
          <br />
          <span className="text-brand">치과 설명</span>
        </h1>
        <p className="hero-anim-3 text-base md:text-xl text-gray-500 mb-8 leading-relaxed max-w-xl mx-auto">
          치과 용어 {termCount}개를 치과의사가 직접 정리했습니다.
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          궁금한 단어를 검색해 보세요.
        </p>

        {/* 사전 검색 — JS 없이도 /terms/?q= 로 넘어간다 */}
        <form
          action="/terms/"
          method="get"
          role="search"
          className="hero-anim-4 max-w-xl mx-auto"
        >
          <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 shadow-lg shadow-brand/5 p-2 focus-within:border-brand transition-colors">
            <label htmlFor="hero-term-search" className="sr-only">
              치과 용어 검색
            </label>
            <div className="relative flex-1 min-w-0">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                id="hero-term-search"
                type="search"
                name="q"
                placeholder="예: 임플란트, 신경치료, 스케일링"
                autoComplete="off"
                className="w-full pl-10 pr-2 py-3 text-[15px] md:text-base outline-none bg-transparent placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="shrink-0 bg-brand text-white font-bold px-5 md:px-6 py-3 rounded-xl hover:bg-brand-dark transition-colors text-sm md:text-base min-h-[44px]"
            >
              검색
            </button>
          </div>
        </form>

        <div className="hero-anim-4 mt-5 flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
          <span className="text-xs text-gray-400 mr-1 hidden sm:inline">많이 찾는 용어</span>
          {quickTerms.map((term) => (
            <a
              key={term.slug}
              href={`/terms/${term.slug}/`}
              className="px-3 py-1.5 rounded-full bg-white/80 border border-gray-200 text-xs md:text-sm text-gray-600 hover:border-brand/40 hover:text-brand transition-colors"
            >
              {term.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
