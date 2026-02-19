export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <a href="/" className="inline-block mb-6">
          <span className="text-2xl font-extrabold tracking-tight">
            서울대 윤원장의 <span className="text-brand">치과사전</span>
          </span>
        </a>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
          정확한 정보만, 치과의사가 직접 전합니다.<br />
          이 글들이 여러분의 걱정을 조금 덜어주길 바랍니다.
        </p>

        <div className="flex items-center justify-center gap-6 mb-10">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">홈</a>
          <span className="text-gray-700">·</span>
          <a href="/posts/" className="text-sm text-gray-400 hover:text-white transition-colors">블로그</a>
          <span className="text-gray-700">·</span>
          <a href="/about/" className="text-sm text-gray-400 hover:text-white transition-colors">소개</a>
          <span className="text-gray-700">·</span>
          <a
            href="https://blog.naver.com/studytosurvive"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand hover:text-brand-light transition-colors font-semibold"
          >
            네이버 블로그
          </a>
        </div>

        <div className="border-t border-gray-800 pt-8 text-gray-500 text-xs space-y-1">
          <p>&copy; {new Date().getFullYear()} 서울대 윤원장의 치과사전. All rights reserved.</p>
          <p>본 블로그의 모든 정보는 참고용이며, 개인의 치료는 전문의와 상담이 필요합니다.</p>
        </div>
      </div>
    </footer>
  );
}
