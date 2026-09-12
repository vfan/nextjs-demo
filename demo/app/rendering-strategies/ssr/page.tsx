// ============================================================
// SSR · 服务端渲染 —— 路由 /rendering-strategies/ssr
// ============================================================
// 文件位置：app/rendering-strategies/ssr/page.tsx
//
// 每一行关键代码都在这：
//   export const dynamic = "force-dynamic"
// 这一行让它从「默认静态」变成「每次请求都重新渲染」。
//
// 怎么验证：
//   反复刷新页面，时间戳每次都变——因为每一次请求，
//   服务器都重新执行了一遍这个组件。
//
// 注意：在 App Router 官方文档里，这个模式通常叫「动态渲染」
// （Dynamic Rendering），本质就是传统的 SSR。

import ModeCard from "../mode-card";

// 路由段配置。没有这一行的话，这个页面会被静态化（变成 SSG）。
export const dynamic = "force-dynamic";

export default function SsrPage() {
  // 这行代码在服务器上运行。因为上面强制了动态渲染，
  // 每次请求都会重新执行一次，所以时间永远是新出炉的。
  const renderedAt = new Date().toLocaleString("zh-CN");

  return (
    <>
      <h1>SSR · 服务端渲染</h1>
      <p className="lead">
        每次请求，服务器都现场把 HTML 拼好再发出去。
      </p>

      <ModeCard
        mode="SSR"
        tagline="HTML 在服务器上生成，浏览器拿到的是一份直接可显示的完整页面。"
        stampLabel="本次 HTML 的生成时间（服务器，每次请求都重新执行）"
        renderedAt={renderedAt}
      >
        <strong>动手验证：</strong>连续刷新几次，时间戳每次都不一样。
        因为 <code>dynamic = &quot;force-dynamic&quot;</code> 让服务器在每次请求时
        都重新渲染了一遍。按 <code>Ctrl+U</code> 看源代码，时间就在 HTML 里——
        说明内容是服务端渲染好送过来的，不依赖 JS。
      </ModeCard>

      <div className="note">
        <strong>代价：</strong>每次请求都占用服务器算力。访问量一大，这是真金白银的成本。
        所以只有「内容必须最新」或「因人而异」的页面才值得用它，比如购物车、个人中心。
      </div>
    </>
  );
}
