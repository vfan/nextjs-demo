// ============================================================
// ISR · 增量静态再生 —— 路由 /rendering-strategies/isr
// ============================================================
// 文件位置：app/rendering-strategies/isr/page.tsx
//
// 和 SSG 唯一的区别，就是多了这一行：
//   export const revalidate = 10
// 它的意思是：这份静态 HTML 的「保质期」是 10 秒。
//
// 怎么验证（用生产模式：npm run build && npm start）：
//   第 1 次刷新 ── 看到时间戳 A
//   10 秒内再刷 ── 还是 A（保质期内，直接用缓存）
//   过了 10 秒再刷 ── 仍然是 A！这是关键：过期后的第一个访客拿到的是旧页面
//   紧接着再刷一次 ── 变成新的 B（后台已经悄悄生成好了）
//
// 第二步那个「还是旧值」不是 bug，而是 ISR 的核心设计：
// 永远不让用户等服务器重新生成，速度优先。

import ModeCard from "../mode-card";

// 路由段配置：每 10 秒允许再生一次。
// 想看得更明显可以把它改成 3。
export const revalidate = 10;

export default function IsrPage() {
  // 同样是构建时生成，但每隔 revalidate 秒之后会被重新执行一次，
  // 生成一份新的 HTML 替换掉旧的。
  const renderedAt = new Date().toLocaleString("zh-CN");

  return (
    <>
      <h1>ISR · 增量静态再生</h1>
      <p className="lead">
        本质是 SSG，但给静态 HTML 加了一个「保质期」。
      </p>

      <ModeCard
        mode="ISR"
        tagline="构建时生成，之后每隔 revalidate 秒允许在后台重新生成一次。"
        stampLabel={`生成时间（保质期 ${10} 秒）`}
        renderedAt={renderedAt}
      >
        <strong>动手验证：</strong>用 <code>npm run build &amp;&amp; npm start</code> 启动。
        刷新记下当前时间戳，<strong>10 秒内</strong>再刷新几次——都是同一个值。
        等过了 10 秒再刷新——你会发现它<strong>还是旧值</strong>；
        别急，再刷一次就变成新的了。中间那次「还是旧的」，就是
        ISR 为了保证速度而做的取舍（术语叫 stale-while-revalidate）。
      </ModeCard>

      <div className="note">
        <strong>什么时候用它：</strong>文章列表、商品列表、新闻首页——数量庞大、
        不常变、但终究会变的内容。一个百万篇文章的博客用 ISR，就永远不需要
        为了发一篇文章而重新构建全站。
      </div>
    </>
  );
}
