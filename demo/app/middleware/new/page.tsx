// ============================================================
// 重定向目标 —— 路由 /middleware/new
// ============================================================
// 文件位置：app/middleware/new/page.tsx
//
// 旧地址 /middleware/old 被中间件重定向到这里。
// 值得强调的是：/middleware/old 在项目里没有对应的文件夹，
// 如果中间件没拦住它，用户会看到 404。

import Link from "next/link";

export default function NewPathPage() {
  return (
    <>
      <h1>新地址</h1>
      <p className="lead">
        你被中间件从 <code>/middleware/old</code> 带到了这里。
      </p>

      <div className="note">
        <strong>看看地址栏：</strong>现在显示的是{" "}
        <code>/middleware/new</code>。旧地址从来没有渲染过任何页面——
        中间件在路由匹配之前就返回了一个 307，浏览器于是用新地址重新请求了一次。
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>这种模式在真实项目里很常见</h3>
        <p style={{ marginBottom: 0 }}>
          网站改版、栏目改名、文章换了 slug 之后，
          旧的 URL 可能已经被搜索引擎收录、被用户收藏、被别的网站链接。
          直接用中间件做一层映射表，既能保住流量，也不用为每个旧地址
          保留一个页面文件。
        </p>
      </div>

      <p>
        <Link href="/middleware">← 回到中间件总览</Link>
      </p>
    </>
  );
}
