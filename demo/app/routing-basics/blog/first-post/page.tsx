// ============================================================
// 文章详情页 —— 路由 /routing-basics/blog/first-post
// ============================================================
// 文件位置：app/routing-basics/blog/first-post/page.tsx
//
// 演示「二级嵌套」：
//   app/                    ①  app
//     routing-basics/       ②  /routing-basics
//       blog/               ③  /routing-basics/blog
//         first-post/       ④  /routing-basics/blog/first-post
//           page.tsx        ← page.tsx 出现的这一层，才成为可访问的页面
//
// 这一章我们手写死了这一条路径。等学到第五章「动态路由」，
// 就可以用一个 [slug] 文件夹同时接住所有文章的 URL。

import Link from "next/link";

export default function FirstPostPage() {
  return (
    <article>
      <h1>我的第一篇博客</h1>
      <p className="path">2026-09-12</p>

      <p className="lead">
        Hello, Next.js！这一页的源文件在{" "}
        <code>app/routing-basics/blog/first-post/page.tsx</code>。
      </p>

      <h2>路径是怎么一层层加上去的</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>文件夹层级</th>
            <th>URL 片段</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="path">app/</td>
            <td className="path">/ （根）</td>
          </tr>
          <tr>
            <td className="path">routing-basics/</td>
            <td className="path">/routing-basics</td>
          </tr>
          <tr>
            <td className="path">blog/</td>
            <td className="path">/routing-basics/blog</td>
          </tr>
          <tr>
            <td className="path">first-post/</td>
            <td className="path">/routing-basics/blog/first-post</td>
          </tr>
        </tbody>
      </table>

      <Link href="/routing-basics/blog">← 返回博客列表</Link>
    </article>
  );
}
