// ============================================================
// 动态路由总览 —— 路由 /dynamic-routes
// ============================================================
// 文件位置：app/dynamic-routes/page.tsx
//
// 前几章的路由都是「一个文件夹对应一个固定 URL」。
// 这一章解决的问题是：如果我有一万篇文章，总不能建一万个文件夹。
//
// 答案是用方括号命名文件夹： [slug]。
// 它像一个通配符，把这一层的任意值都接住，并作为参数交给你。

import Link from "next/link";
import { posts } from "./data";

export default function DynamicRoutesPage() {
  return (
    <>
      <h1>第六章 · 动态路由</h1>
      <p className="lead">
        一个 <code>page.tsx</code> 接住成千上万个 URL。
      </p>

      <h2>两种写法</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>文件夹名</th>
            <th>匹配的 URL</th>
            <th>拿到的参数</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="path">[slug]</td>
            <td className="path">/blog/hello-nextjs</td>
            <td className="path">slug = &quot;hello-nextjs&quot;</td>
          </tr>
          <tr>
            <td className="path">[id]</td>
            <td className="path">/products/42</td>
            <td className="path">id = &quot;42&quot;</td>
          </tr>
          <tr>
            <td className="path">[...slug]</td>
            <td className="path">/shop/数码/耳机/降噪</td>
            <td className="path">
              slug = [&quot;数码&quot;, &quot;耳机&quot;, &quot;降噪&quot;]
            </td>
          </tr>
          <tr>
            <td className="path">[[...slug]]</td>
            <td className="path">/shop 也会匹配</td>
            <td className="path">slug = undefined</td>
          </tr>
        </tbody>
      </table>

      <p>
        <strong>方括号里写什么名字不重要</strong>（写 <code>slug</code>、
        <code>id</code>、<code>name</code> 都行），它只是你稍后在代码里
        读取这个值用的变量名。重要的是方括号本身——它表示「这一段是变化的」。
      </p>

      <div className="note">
        <strong>正则约束：</strong>如果想让某一段必须符合特定格式（比如必须是数字），
        可以写成 <code>[id]</code> 配合页面内的校验，
        或者用 <code>[slug]</code> 加自己的正则判断。
        Next.js 也支持 <code>[file].png</code> 这类带后缀的写法。
      </div>

      <h2>示例一：单段动态路由</h2>
      <p>
        三篇文章共用一个 <code>[slug]</code> 页面：
        <code className="path">app/dynamic-routes/blog/[slug]/page.tsx</code>
      </p>
      <div className="grid">
        {posts.map((post) => (
          <div key={post.slug} className="card">
            <h3 style={{ marginTop: 0 }}>
              <Link href={`/dynamic-routes/blog/${post.slug}`}>
                {post.title}
              </Link>
            </h3>
            <p className="path">{post.date}</p>
            <p className="path" style={{ marginBottom: 0 }}>
              /dynamic-routes/blog/{post.slug}
            </p>
          </div>
        ))}
      </div>

      <h2>示例二：多段 catch-all</h2>
      <p>
        一个页面接住任意层级的路径：
        <code className="path">app/dynamic-routes/shop/[...slug]/page.tsx</code>
      </p>
      <div className="grid">
        <div className="card">
          <p className="path" style={{ marginBottom: 6 }}>
            /dynamic-routes/shop/数码/耳机/降噪
          </p>
          <Link href="/dynamic-routes/shop/数码/耳机/降噪">三层路径 →</Link>
        </div>
        <div className="card">
          <p className="path" style={{ marginBottom: 6 }}>
            /dynamic-routes/shop/数码
          </p>
          <Link href="/dynamic-routes/shop/数码">一层路径 →</Link>
        </div>
      </div>

      <div className="note warn">
        <strong>点进去看两个细节：</strong>
        <ol style={{ margin: "8px 0 0 20px" }}>
          <li>
            页面上的 <code>params</code> 在你面前被打印出来了，
            能看到单段的是字符串、多段的是数组。
          </li>
          <li>
            试着把 URL 手动改成一个不存在的 slug——会走 404，
            因为页面里调用了 <code>notFound()</code>。
          </li>
        </ol>
      </div>
    </>
  );
}
