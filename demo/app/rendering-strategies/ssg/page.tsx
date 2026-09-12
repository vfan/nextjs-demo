// ============================================================
// SSG · 静态站点生成 —— 路由 /rendering-strategies/ssg
// ============================================================
// 文件位置：app/rendering-strategies/ssg/page.tsx
//
// 这一页最值得注意的是：它什么配置都没写。
//
// 你在这个文件里找不到任何 revalidate、dynamic 配置——因为
// 「构建时生成静态 HTML」就是 App Router 的默认行为。
// 你什么都不做，就已经在用 SSG 了。
//
// 怎么验证（必须用生产模式，开发模式看不出效果）：
//   npm run build && npm start
//   然后反复刷新，时间戳纹丝不动——它固定在构建那一刻。
//
// 为什么必须是生产模式？因为静态 HTML 是构建产物。
// npm run dev 为了热更新会每次重新渲染，所以时间戳会变，那是开发模式的假象。

import ModeCard from "../mode-card";

export default function SsgPage() {
  // 这行代码只在「构建时」执行一次，结果被固化成静态 HTML 文件，
  // 之后无论谁来访问、访问多少次，拿到的都是同一份。
  const renderedAt = new Date().toLocaleString("zh-CN");

  return (
    <>
      <h1>SSG · 静态站点生成</h1>
      <p className="lead">
        构建时生成一份 HTML 存着，之后谁访问都发这一份。
      </p>

      <ModeCard
        mode="SSG"
        tagline="HTML 在构建时生成一次，之后作为静态文件被反复发送。"
        stampLabel="构建时间（不是访问时间——所有人看到的都一样）"
        renderedAt={renderedAt}
      >
        <strong>动手验证：</strong>用 <code>npm run build &amp;&amp; npm start</code> 启动，
        然后疯狂刷新这个页面。时间戳不会变，因为它压根不是「生成」出来的，
        而是构建时就烤进文件里的。顺便注意 build 输出的路由列表，
        这个路由会被标成 <code>○ (Static)</code>。
      </ModeCard>

      <div className="note warn">
        <strong>开发模式下会「骗」你：</strong>用 <code>npm run dev</code> 时，
        这个页面的时间戳每次刷新都会变。那不是 SSG 失效了，
        而是开发模式为了保证热更新，放弃了静态缓存。以 build + start 的结果为准。
      </div>

      <div className="note">
        <strong>什么时候用它：</strong>博客文章、产品文档、营销落地页——内容不常变，
        但访问量可能很大。这类页面做成静态，速度快到几乎和纯文件服务器一样，
        而且可以直接扔到 CDN 上。
      </div>
    </>
  );
}
