import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts")).sort(
    (a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0)
  );

  return rss({
    title: "서울대 윤원장의 치과사전",
    description:
      "임플란트, 충치, 신경치료, 사랑니, 라미네이트, 스케일링까지. 서울대 치의학대학원 출신 치과의사가 진료실에서 미처 전하지 못한 치과 정보를 정확하고 쉽게 전합니다.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? "",
      link: `/posts/${post.slug}/`
    })),
    customData: "<language>ko</language>"
  });
}
