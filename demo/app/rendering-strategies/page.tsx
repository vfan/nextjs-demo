// ============================================================
// 渲染策略总览 —— 路由 /rendering-strategies
// ============================================================
// 文件位置：app/rendering-strategies/page.tsx
//
// 这一页是第一章的目录。四种模式各有一个页面，每个页面上都显示
// 「本次 HTML 的生成时间」。反复刷新那几个页面，观察时间戳的变化规律，
// 比读十遍文字更有效。

import Link from "next/link";

const modes = [
  {
    href: "/rendering-strategies/csr",
    badge: "badge-csr",
    name: "CSR",
    full: "客户端渲染",
    where: "浏览器",
    when: "运行时",
    observe: "刷新时能看到一瞬间的「加载中」",
  },
  {
    href: "/rendering-strategies/ssr",
    badge: "badge-ssr",
    name: "SSR",
    full: "服务端渲染",
    where: "服务器",
    when: "每次请求",
    observe: "每次刷新时间戳都变",
  },
  {
    href: "/rendering-strategies/ssg",
    badge: "badge-ssg",
    name: "SSG",
    full: "静态站点生成",
    where: "服务器",
    when: "构建时一次",
    observe: "怎么刷都不变，固定在构建那一刻",
  },
  {
    href: "/rendering-strategies/isr",
    badge: "badge-isr",
    name: "ISR",
    full: "增量静态再生",
    where: "服务器",
    when: "构建时 + 定时再生",
    observe: "10 秒内不变，过期后第二次刷新才更新",
  },
] as const;

export default function RenderingStrategiesPage() {
  return (
    <>
      <h1>第一章 · 渲染策略</h1>
      <p className="lead">
        四种策略都在回答同一个问题：<strong>这段 HTML 是在哪里、什么时候生成的？</strong>
        下面四个页面用的代码几乎一样，只有顶部那一行配置不同——但表现天差地别。
      </p>

      <h2>横向对比</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>模式</th>
            <th>HTML 生成于</th>
            <th>生成时机</th>
            <th>刷新时的表现</th>
          </tr>
        </thead>
        <tbody>
          {modes.map((m) => (
            <tr key={m.name}>
              <td>
                <span className={`badge ${m.badge}`}>{m.name}</span>
                <div style={{ fontSize: "0.85rem", color: "#666", marginTop: 4 }}>
                  {m.full}
                </div>
              </td>
              <td>{m.where}</td>
              <td>{m.when}</td>
              <td>{m.observe}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>去这四个页面看看</h2>
      <div className="note warn">
        <strong>看之前先做一件事：</strong>在每个页面上<strong>连续刷新几次</strong>，
        盯着「本次 HTML 的生成时间」那一行。这个数字的变化规律，
        就是这四种渲染策略的全部区别。
      </div>

      <div className="grid">
        {modes.map((m) => (
          <div key={m.name} className="card">
            <h3 style={{ marginTop: 0 }}>
              <span className={`badge ${m.badge}`}>{m.name}</span>
            </h3>
            <p className="path">{m.full}</p>
            <p>{m.observe}</p>
            <Link href={m.href}>打开 {m.name} 示例 →</Link>
          </div>
        ))}
      </div>

      <div className="note">
        <strong>一个重要提醒：</strong>SSG 和 ISR 的静态 HTML 是<strong>构建产物</strong>。
        用 <code>npm run dev</code> 开发时，为了热更新，每次请求都会重新渲染，
        所以你看到的 SSG 时间戳也会变——这是开发模式的正常现象。
        要看真实行为，请用 <code>npm run build &amp;&amp; npm start</code>。
      </div>
    </>
  );
}
