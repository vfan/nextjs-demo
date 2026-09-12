// ============================================================
// 多段 catch-all 路由 —— /dynamic-routes/shop/[...slug]
// ============================================================
// 文件位置：app/dynamic-routes/shop/[...slug]/page.tsx
//
// 三个点加方括号 [...slug] 表示「这一层可以有好几段，全都收下来」。
//
//   /shop/数码                  → slug = ["数码"]
//   /shop/数码/耳机             → slug = ["数码", "耳机"]
//   /shop/数码/耳机/降噪        → slug = ["数码", "耳机", "降噪"]
//
// 这就是电商分类页、文档目录页常用的写法：一套代码处理任意深度的路径。
//
// 如果还想让 /shop 本身也能访问，把文件夹改名叫 [[...slug]]（多一层方括号），
// 这叫可选 catch-all，此时 slug 会是 undefined。

import Link from "next/link";

export default async function ShopPage({
  params,
}: {
  // catch-all 拿到的是数组
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // 用它拼一个面包屑
  const crumbs = slug.map((segment, index) => ({
    label: segment,
    // 累积路径：["数码","耳机"] → "数码" / "数码/耳机"
    path: "/dynamic-routes/shop/" + slug.slice(0, index + 1).join("/"),
  }));

  return (
    <>
      <h1>分类页</h1>
      <p className="lead">
        当前路径：<code>/dynamic-routes/shop/{slug.join("/")}</code>
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>从 URL 里拿到的参数</h3>
        <p className="path">
          params.slug = [{slug.map((s) => `"${s}"`).join(", ")}]
        </p>
        <p className="path" style={{ marginBottom: 0 }}>
          共 {slug.length} 段
        </p>
      </div>

      <h2 style={{ fontSize: "1.1rem" }}>面包屑（用数组拼出来的）</h2>
      <p>
        {crumbs.map((crumb, i) => (
          <span key={crumb.path}>
            {i > 0 ? " / " : ""}
            <Link href={crumb.path}>{crumb.label}</Link>
          </span>
        ))}
      </p>

      <div className="note warn">
        <strong>动手验证：</strong>把地址栏改成
        <code>/dynamic-routes/shop/a/b/c/d/e</code>——加多少层都行，
        同一个页面照样接住，页面上的「共 N 段」会跟着变。
        <br />
        但 <code>/dynamic-routes/shop</code> 本身会 404，
        因为 <code>[...slug]</code> 要求至少有一段。想让根路径也匹配，
        需要改用 <code>[[...slug]]</code>。
      </div>

      <div className="note">
        <strong>什么时候用 catch-all？</strong>
        当你事先不知道路径有几层时：分类目录、文件浏览器、
        GitHub 那样的仓库路径 <code>/owner/repo/issues/123</code>。
        如果层级固定，就用多个单段动态路由（<code>[a]/[b]/[c]</code>）更清晰。
      </div>

      <p>
        <Link href="/dynamic-routes">← 返回总览</Link>
      </p>
    </>
  );
}
