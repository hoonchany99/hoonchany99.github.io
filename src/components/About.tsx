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
              치과의사 <span className="text-brand">윤원장</span>입니다
            </h2>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              치과가 무서운 건 당연한 일입니다. 그런데 생각해보면, 치료 자체보다{" "}
              <span className="font-semibold text-gray-800">"앞으로 뭘 하는지 모른다"</span>는
              게 더 무서울 때가 많아요.
            </p>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              저는 서울대학교 치의학대학원을 졸업했고, 진료실에서 늘 이게
              아쉬웠습니다. 설명하고 싶은 건 많은데 시간이 부족하고, 환자분은
              긴장한 채로 의자에 앉아 계시니 절반도 전달이 안 되는 것 같았어요.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              그래서 이 공간을 만들었습니다. 어려운 말 없이, 초등학생도 이해할 수
              있게. 그리고 의사가 책임질 수 있을 만큼 정확하게요.
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
