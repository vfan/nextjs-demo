// ============================================================
// 单段动态路由 —— /dynamic-routes/blog/[slug]
// ============================================================
// 文件位置：app/dynamic-routes/blog/[slug]/page.tsx
//
// 文件夹名叫 [slug]，所以 /dynamic-routes/blog/任意值 都会走进这个文件。
//
// 有两个细节是 Next.js 15 之后才变化的，很多旧教程还是老写法：
//
//   1. params 现在是一个 Promise，必须 await 之后才能取值。
//      以前可以直接写 params.slug，现在会报错。
//   2. notFound() 用来把「查不到数据」变成 404 页面。

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "../../data";

// 构建时预生成静态页面：告诉 Next.js 「这篇文章有哪些 slug」
// 这样三条文章路径都会在 npm run build 时变成静态 HTML（第一章的 SSG）。
// 如果不写这个函数，页面会在用户第一次访问时按需渲染。
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  // 注意类型是 Promise —— Next.js 15 起的写法
  params: Promise<{ slug: string }>;
}) {
  // 必须 await，否则拿到的是 Promise 而不是对象
  const { slug } = await params;

  const post = getPost(slug);

  // 查不到就返回 404。会渲染最近的 not-found.tsx（没有的话用默认的）
  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p className="path">{post.date}</p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>从 URL 里拿到的参数</h3>
        <p className="path" style={{ marginBottom: 0 }}>
          params.slug = &quot;{slug}&quot;
        </p>
      </div>

      <p>{post.body}</p>

      <div className="note">
        <strong>试试看：</strong>把地址栏里的 slug 改成任意一个不存在的值
        （比如 <code>/dynamic-routes/blog/nothing-here</code>），
        会看到 404 页面——因为上面的 <code>notFound()</code> 生效了。
        <br />
        改回正确的 slug，页面又能正常显示。
      </div>

      <p>
        <Link href="/dynamic-routes">← 返回总览</Link>
      </p>
    </article>
  );
}
