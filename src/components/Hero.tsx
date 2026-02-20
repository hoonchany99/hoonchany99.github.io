export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-brand-bg via-sky-50 to-white py-24 md:py-36 overflow-hidden">
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
        <h1 className="hero-anim-2 text-5xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-[1.15]">
          진료실에서
          <br />
          미처 전하지 못한
          <br />
          <span className="text-brand">치아 이야기</span>
        </h1>
        <p className="hero-anim-3 text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-xl mx-auto">
          정확한 정보만, 치과의사가 직접 전합니다.
          <br />
          이 글들이 여러분의 걱정을 조금 덜어주길 바랍니다.
        </p>
        <div className="hero-anim-4 flex flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="/posts/"
            className="inline-block bg-brand text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl hover:bg-brand-dark transition-all text-center font-bold shadow-lg shadow-brand/20 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            글 읽으러 가기
          </a>
          <a
            href="/about/"
            className="inline-block bg-white text-gray-700 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl border border-gray-200 hover:border-brand hover:text-brand transition-all text-center font-bold hover:-translate-y-0.5 text-sm sm:text-base"
          >
            윤원장 소개
          </a>
        </div>
      </div>
    </section>
  );
}
