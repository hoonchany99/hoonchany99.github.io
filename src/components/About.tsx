export function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative z-10">
              <div className="w-full aspect-square max-w-sm mx-auto rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src="/img/profile.png"
                  alt="서울대 윤원장"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-brand-50 rounded-2xl -z-0 hidden md:block" />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              안녕하세요,
              <br />
              <span className="text-brand">서울대학교 치의학대학원</span> 출신
              <br />
              치과의사 윤원장입니다
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              사실 저는 제 이야기를 길게 꺼내는 사람이 아닙니다. 환자분 이야기를
              듣는 게 더 편하고, 진료실에서도 먼저 묻습니다.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              이 블로그는 진료실에서 미처 다 하지 못한 이야기들을 차분히
              정리하고 기록하기 위해 만들었습니다.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              <span className="font-semibold text-gray-800">
                "정확하고, 쉽게 이해되고, 믿을 수 있는 치과 정보"
              </span>
              만 담겠습니다.
              <br />
              초등학생도 이해할 수 있을 만큼 쉽게, 의사가 책임질 수 있을 만큼
              정확하게요.
            </p>

            <a
              href="/about"
              className="inline-block bg-brand text-white px-8 py-3.5 rounded-xl hover:bg-brand-dark transition-all font-bold shadow-lg shadow-brand/20 hover:-translate-y-0.5"
            >
              윤원장에 대해 더 알아보기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
