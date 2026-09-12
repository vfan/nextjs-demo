// ============================================================
// 模拟的文章数据
// ============================================================
// 文件位置：app/metadata/data.ts

export type Article = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
};

export const articles: Article[] = [
  {
    slug: "metadata-basics",
    title: "元数据决定了什么",
    summary: "浏览器标签页上的标题、搜索结果里的描述、分享到微信时的卡片——都来自元数据。",
    body: "元数据不显示在页面里，但它决定了别人怎么「看到」你的页面。搜索引擎靠它判断内容主题，社交平台靠它生成分享卡片。",
    publishedAt: "2026-08-20",
  },
  {
    slug: "dynamic-metadata",
    title: "动态页面怎么生成元数据",
    summary: "一万篇文章共用一个 page.tsx，标题自然也不能写死——用 generateMetadata。",
    body: "generateMetadata 是一个异步函数，和页面组件一样能拿到 params。你在里面查到数据，再返回对应的 title、description。",
    publishedAt: "2026-08-28",
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
