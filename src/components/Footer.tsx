const topicLinks = [
  { label: "충치·신경치료", href: "/topics/cavity/" },
  { label: "임플란트", href: "/topics/implant/" },
  { label: "크라운·인레이", href: "/topics/crown-inlay/" },
  { label: "사랑니·발치", href: "/topics/wisdom-tooth/" },
  { label: "라미네이트·미백", href: "/topics/laminate-whitening/" },
  { label: "잇몸·예방", href: "/topics/gum-prevention/" },
];

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
          치과 치료가 막막할 때 기준이 되는 설명.<br />
          치과의사가 정확하고 쉽게 풀어드립니다.
        </p>

        <div className="flex items-center justify-center gap-6 mb-6">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors">홈</a>
          <span className="text-gray-700">·</span>
          <a href="/topics/" className="text-sm text-gray-400 hover:text-white transition-colors">주제별</a>
          <span className="text-gray-700">·</span>
          <a href="/posts/" className="text-sm text-gray-400 hover:text-white transition-colors">블로그</a>
          <span className="text-gray-700">·</span>
          <a href="/qna/" className="text-sm text-gray-400 hover:text-white transition-colors">Q&A</a>
          <span className="text-gray-700">·</span>
          <a href="/about/" className="text-sm text-gray-400 hover:text-white transition-colors">소개</a>
          <span className="text-gray-700">·</span>
          <a
            href="https://blog.naver.com/doctoryoon-kr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand hover:text-brand-light transition-colors font-semibold"
          >
            네이버 블로그
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mb-10">
          {topicLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-gray-500 text-xs space-y-1">
          <p>&copy; {new Date().getFullYear()} 서울대 윤원장의 치과사전. All rights reserved.</p>
          <p>본 블로그의 모든 정보는 참고용이며, 개인의 치료는 전문의와 상담이 필요합니다.</p>
        </div>
      </div>
    </footer>
  );
}
