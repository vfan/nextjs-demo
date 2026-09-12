// ============================================================
// 模拟的博客数据
// ============================================================
// 文件位置：app/dynamic-routes/data.ts
//
// 因为文件名叫 data.ts 而不是 page.tsx，它没有对应的 URL。
// 真实项目里这里会是数据库查询，这里用数组代替。

export type Post = {
  slug: string;
  title: string;
  date: string;
  body: string;
};

export const posts: Post[] = [
  {
    slug: "hello-nextjs",
    title: "为什么要有动态路由",
    date: "2026-09-01",
    body: "如果每个页面都要手写一个文件夹，那么一万篇文章就要一万个文件夹。动态路由用一个 [slug] 文件夹把这类 URL 全部接住。",
  },
  {
    slug: "file-based-routing",
    title: "文件系统路由的得与失",
    date: "2026-09-05",
    body: "好处是零配置、所见即所得；代价是路由逻辑分散在文件夹结构里，需要一点时间适应。",
  },
  {
    slug: "server-components",
    title: "服务端组件改变了什么",
    date: "2026-09-10",
    body: "最直接的变化是：密钥和数据查询可以安全地留在服务器上，不再需要为了取数据专门绕一层 API。",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
