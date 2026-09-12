// ============================================================
// 404 演示 —— 路由 /loading-and-error/not-found-demo
// ============================================================
// 文件位置：app/loading-and-error/not-found-demo/page.tsx
//
// 怎么让用户看到 404？两种触发方式：
//   1. 页面里主动调用 notFound()
//   2. 访问一个根本没有对应文件夹的 URL
//
// 第一种更常见：数据查不到了，就主动转向 404，而不是渲染一个空页面。
// （第六章里 [slug] 页面就是这么做的。）
//
// 为了让你能亲手触发，这一页读了一个查询参数：
//   正常访问          → 显示本页
//   访问 ?missing=1   → 调用 notFound()，落到同级的 not-found.tsx

import Link from "next/link";
import { notFound } from "next/navigation";

export default async function NotFoundDemoPage({
  searchParams,
}: {
  // searchParams 和 params 一样，Next.js 15 起也是 Promise
  searchParams: Promise<{ missing?: string }>;
}) {
  const { missing } = await searchParams;

  // 主动触发 404
  if (missing) {
    notFound();
  }

  return (
    <>
      <h1>not-found.tsx 演示</h1>
      <p className="lead">
        这一页正常显示。点下面的链接，它会在渲染时调用 notFound()。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>触发 404</h3>
        <p>
          <Link
            href={{
              pathname: "/loading-and-error/not-found-demo",
              query: { missing: "1" },
            }}
          >
            点这里触发 notFound() →
          </Link>
        </p>
        <p style={{ marginBottom: 0, fontSize: "0.9rem", color: "#666" }}>
          或者直接访问一个不存在的地址，比如{" "}
          <code>/loading-and-error/这个页面不存在</code>，
          也会落到同一个 404 页面。
        </p>
      </div>

      <div className="note warn">
        <strong>页面回来后注意看：</strong>触发 404 之后，
        本章的导航栏（来自 layout.tsx）还在，只有内容区被换成了 404。
        这说明 <code>not-found.tsx</code> 是<strong>渲染在布局内部</strong>的，
        不是粗暴地跳到一个全新的空白页。
      </div>

      <div className="note">
        <strong>和返回普通页面的区别：</strong>
        <code>notFound()</code> 会把 HTTP 状态码真正设置成 <strong>404</strong>。
        如果你只是 <code>return &lt;p&gt;找不到&lt;/p&gt;</code>，
        状态码仍然是 200——搜索引擎会把这个「不存在的页面」当成正常页面收录，
        这是个常见且后患不小的错误。
      </div>
    </>
  );
}
