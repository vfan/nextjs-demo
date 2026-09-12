// ============================================================
// 第一章首页 —— 路由 /routing-basics
// ============================================================
// 文件位置：app/routing-basics/page.tsx
//
// 这一层文件夹（routing-basics）在 URL 里就体现为 /routing-basics 这一段。
// 本页作为第一章的目录，列出所有示例路由，方便逐个点击验证。

import Link from "next/link";

export default function RoutingBasicsPage() {
  return (
    <>
      <h1>第一章 · 路由基础</h1>
      <p className="lead">
        Next.js 没有路由配置文件。你写下的每一个文件夹都会变成 URL
        中的一段路径，直到某层文件夹里出现了 <code>page.tsx</code>，
        这条路径才真正「可访问」。
      </p>

      <h2>示例路由与源文件对照</h2>
      <p>
        下面的表格是这一章最核心的知识点：左边是你写的文件，
        右边是浏览器里能访问到的地址。两者的对应关系完全由约定决定。
      </p>

      <table className="route-table">
        <thead>
          <tr>
            <th>源文件路径</th>
            <th>对应的 URL</th>
            <th>演示内容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="path">app/routing-basics/page.tsx</td>
            <td className="path">/routing-basics</td>
            <td>当前这一页</td>
          </tr>
          <tr>
            <td className="path">app/routing-basics/about/page.tsx</td>
            <td className="path">/routing-basics/about</td>
            <td>一级子路由</td>
          </tr>
          <tr>
            <td className="path">app/routing-basics/blog/page.tsx</td>
            <td className="path">/routing-basics/blog</td>
            <td>列表页</td>
          </tr>
          <tr>
            <td className="path">
              app/routing-basics/blog/first-post/page.tsx
            </td>
            <td className="path">/routing-basics/blog/first-post</td>
            <td>二级嵌套路由</td>
          </tr>
          <tr>
            <td className="path">
              app/routing-basics/(marketing)/pricing/page.tsx
            </td>
            <td className="path">/routing-basics/pricing</td>
            <td>
              路由组（括号不出现在 URL 里，注意 <code>marketing</code> 消失了）
            </td>
          </tr>
          <tr>
            <td className="path">
              app/routing-basics/(marketing)/features/page.tsx
            </td>
            <td className="path">/routing-basics/features</td>
            <td>同一个路由组下的另一个页面</td>
          </tr>
        </tbody>
      </table>

      <h2>动手点一点</h2>
      <div className="grid">
        <div className="card">
          <h3>一级子路由</h3>
          <p className="path">/routing-basics/about</p>
          <Link href="/routing-basics/about">去看看 →</Link>
        </div>
        <div className="card">
          <h3>二级嵌套路由</h3>
          <p className="path">/routing-basics/blog/first-post</p>
          <Link href="/routing-basics/blog">先到博客列表 →</Link>
        </div>
        <div className="card">
          <h3>路由组示例</h3>
          <p className="path">/routing-basics/pricing</p>
          <Link href="/routing-basics/pricing">去看看 →</Link>
        </div>
      </div>

      <div className="note">
        <strong>观察点：</strong>地址栏里永远不会出现带括号的{" "}
        <code>(marketing)</code>。它不是路由的一部分，只是你用来给文件分类的抽屉。
      </div>
    </>
  );
}
