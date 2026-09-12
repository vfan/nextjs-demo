// ============================================================
// 博客列表页 —— 路由 /routing-basics/blog
// ============================================================
// 文件位置：app/routing-basics/blog/page.tsx
//
// 这一页是「父级路由」，它下面还有一层子路由：
//   app/routing-basics/blog/first-post/page.tsx → /routing-basics/blog/first-post
//
// 换句话说，文件夹嵌套的层数 = URL 路径的级数。

import Link from "next/link";

export default function BlogIndexPage() {
  return (
    <>
      <h1>博客</h1>
      <p className="lead">
        这是 <code>/routing-basics/blog</code>，一个列表页。
      </p>

      <p>
        下面的链接指向 <code>blog/</code> 里面的一个子文件夹，
        点进去后 URL 会再深一层。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {/* href 指向 app/routing-basics/blog/first-post/page.tsx */}
          <Link href="/routing-basics/blog/first-post">我的第一篇博客</Link>
        </h3>
        <p className="path">2026-09-12</p>
      </div>

      <div className="note">
        <strong>对比一下地址栏：</strong>从这一页点进文章后，URL 会从{" "}
        <code>/routing-basics/blog</code> 变成{" "}
        <code>/routing-basics/blog/first-post</code>，
        多出来的那一段正对应多出来的一层文件夹。
      </div>
    </>
  );
}
