import { topicHubs } from '../data/topicHubs';

interface Props {
  hubCounts: Record<string, number>;
}

export function TopicHubs({ hubCounts }: Props) {
  return (
    <section className="py-20 bg-gray-50/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">주제별 치과 정보</h2>
          <p className="text-lg text-gray-600">내 증상, 내 치료에 맞는 글을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {topicHubs.map((hub) => (
            <a
              key={hub.slug}
              href={`/topics/${hub.slug}/`}
              className="group bg-white rounded-2xl border border-gray-100 p-5 md:p-6 hover:shadow-lg hover:border-brand/30 hover:-translate-y-0.5 transition-all"
            >
              <div className="text-2xl md:text-3xl mb-3">{hub.icon}</div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 group-hover:text-brand transition-colors mb-1.5 leading-snug">
                {hub.name}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">
                {hub.description}
              </p>
              <span className="text-xs font-semibold text-brand">
                {hubCounts[hub.slug] ?? 0}편 →
              </span>
            </a>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/topics/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-brand font-medium transition-colors"
          >
            주제별 가이드 보기
          </a>
        </div>
      </div>
    </section>
  );
}
