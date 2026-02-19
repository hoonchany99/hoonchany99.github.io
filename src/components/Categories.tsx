const categories = [
  { title: '예방 치과', description: '충치와 잇몸질환 예방을 위한 올바른 칫솔질과 구강 관리법', icon: '🛡️', href: '/posts/' },
  { title: '미백 · 심미 치료', description: '아름다운 미소를 위한 치아 미백, 라미네이트 등의 심미 치료 정보', icon: '✨', href: '/posts/' },
  { title: '잇몸 관리', description: '잇몸 출혈, 치주염 등 잇몸 건강 관리와 치료 방법 안내', icon: '🩺', href: '/posts/' },
  { title: '생활 습관', description: '양치 루틴, 치실, 식습관 등 일상 속 치아 관리 팁', icon: '💡', href: '/posts/' },
];

export function Categories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">카테고리</h2>
          <p className="text-lg text-gray-600">주제별로 정리된 치과 정보를 확인하세요</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <a key={cat.title} href={cat.href} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group block border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-brand to-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-2xl">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{cat.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
