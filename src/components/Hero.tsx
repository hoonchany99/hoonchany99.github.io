export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-brand-bg via-sky-50 to-white py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="hero-anim-1 text-brand font-semibold text-sm tracking-wide mb-4 uppercase">Dental Knowledge Blog</p>
        <h1 className="hero-anim-2 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
          환자에게 먼저<br className="hidden sm:block" />
          설명해주고 싶은<br />
          <span className="text-brand">치아 이야기</span>
        </h1>
        <p className="hero-anim-3 text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-xl mx-auto">
          서울대 윤원장이 진료실에서 매일 듣는 질문들을<br className="hidden sm:block" />
          알기 쉬운 언어로 정리합니다.
        </p>
        <div className="hero-anim-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/posts/" className="inline-block bg-brand text-white px-8 py-3.5 rounded-xl hover:bg-brand-dark transition-all text-center font-bold shadow-lg shadow-brand/20 hover:-translate-y-0.5">
            글 읽으러 가기
          </a>
          <a href="https://blog.naver.com/studytosurvive" target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-gray-700 px-8 py-3.5 rounded-xl border border-gray-200 hover:border-brand hover:text-brand transition-all text-center font-bold hover:-translate-y-0.5">
            네이버 블로그
          </a>
        </div>
      </div>
    </section>
  );
}
