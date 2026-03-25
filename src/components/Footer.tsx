const topicLinks = [
  { label: "충치·신경치료", href: "/topics/cavity/" },
  { label: "임플란트", href: "/topics/implant/" },
  { label: "크라운·인레이", href: "/topics/crown-inlay/" },
  { label: "사랑니·발치", href: "/topics/wisdom-tooth/" },
  { label: "라미네이트·미백", href: "/topics/laminate-whitening/" },
  { label: "잇몸·예방", href: "/topics/gum-prevention/" },
];

export function Footer() {
  const navLinks = [
    { label: "홈", href: "/" },
    { label: "주제별", href: "/topics/" },
    { label: "블로그", href: "/posts/" },
    { label: "Q&A", href: "/qna/" },
    { label: "소개", href: "/about/" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <a href="/" className="inline-block mb-4 md:mb-6">
          <span className="text-xl md:text-2xl font-extrabold tracking-tight">
            서울대 윤원장의 <span className="text-brand">치과사전</span>
          </span>
        </a>
        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 max-w-md mx-auto">
          치과 치료가 막막할 때 기준이 되는 설명.<br />
          치과의사가 정확하고 쉽게 풀어드립니다.
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-0 mb-8 md:mb-10 max-w-[320px] mx-auto text-left">
          <div className="space-y-2">
            <p className="text-[11px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">사이트맵</p>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-xs md:text-sm text-gray-500 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
            <a
              href="https://blog.naver.com/doctoryoon-kr"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs md:text-sm text-brand hover:text-brand-light transition-colors font-semibold"
            >
              네이버 블로그
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">주제별</p>
            {topicLinks.map((link) => (
              <a key={link.href} href={link.href} className="block text-xs md:text-sm text-gray-500 hover:text-gray-300 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 md:pt-8 text-gray-500 text-[11px] md:text-xs space-y-1">
          <p>&copy; {new Date().getFullYear()} 서울대 윤원장의 치과사전</p>
          <p>모든 정보는 참고용이며, 개인의 치료는 전문의 상담이 필요합니다.</p>
        </div>
      </div>
    </footer>
  );
}
