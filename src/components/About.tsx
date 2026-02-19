const stats = [
  { icon: '🎓', title: '전문 교육', desc: '서울대 치의학대학원 출신' },
  { icon: '🏆', title: '임상 경험', desc: '다양한 진료 분야 임상' },
  { icon: '📖', title: '지속 학습', desc: '최신 치의학 트렌드 연구' },
  { icon: '❤️', title: '환자 중심', desc: '신뢰와 소통 우선' },
];

export function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10">
              <div className="w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-brand-100 to-sky-100 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-9xl">👨‍⚕️</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-brand-50 rounded-2xl -z-0 hidden md:block" />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              안녕하세요,<br />
              <span className="text-brand">치과의사 윤훈찬</span>입니다
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              올바른 치과 정보를 쉽고 정확하게 전달하여 많은 분들의 구강 건강에 도움을 드리고자 이 블로그를 시작했습니다.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              복잡하고 어려운 치과 용어와 치료 과정을 누구나 이해하기 쉽게 설명하고,
              최신 치과 의학 정보를 빠르게 공유하여 건강한 미소를 지킬 수 있도록 돕겠습니다.
            </p>

            <div className="grid grid-cols-2 gap-5">
              {stats.map((s) => (
                <div key={s.title} className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-brand-bg flex items-center justify-center flex-shrink-0 text-xl">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-0.5 text-sm">{s.title}</h4>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
