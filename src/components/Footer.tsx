export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">윤원장의 치과사전</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              건강한 미소를 위한 신뢰할 수 있는 치과 정보.<br />
              치과의사가 직접 전하는 전문 지식과 최신 정보를 공유합니다.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">홈</a></li>
              <li><a href="/posts/" className="text-gray-400 hover:text-white transition-colors">블로그</a></li>
              <li><a href="/about/" className="text-gray-400 hover:text-white transition-colors">소개</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">소셜</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://blog.naver.com/studytosurvive" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  네이버 블로그
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 윤원장의 치과사전. All rights reserved.</p>
          <p className="mt-2 text-xs">본 블로그의 모든 정보는 참고용이며, 개인의 치료는 전문의와 상담이 필요합니다.</p>
        </div>
      </div>
    </footer>
  );
}
