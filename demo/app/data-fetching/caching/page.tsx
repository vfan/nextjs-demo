// ============================================================
// 缓存控制 —— 路由 /data-fetching/caching
// ============================================================
// 文件位置：app/data-fetching/caching/page.tsx
//
// 同一个接口，用三种不同的 fetch 选项各调一次，看看返回的时间戳
// 是不是同一个。这就是「缓存」在这门框架里的全部表现形式。
//
// 怎么验证：
//   连续刷新几次（间隔短一点），逐个对比三张卡片里的时间。
//     · no-store   → 每次都变
//     · revalidate → 10 秒内不变，超过后更新
//     · 默认       → 每次都变（下面有解释，这条最容易踩坑）

import { apiUrl } from "../api-url";

type Weather = {
  city: string;
  temp: number;
  updatedAt: string;
};

export default async function CachingPage() {
  const url = await apiUrl("/api/weather");

  // 三个请求并行发起，不要串行等待（原因见 parallel 页）
  const [noStore, revalidated, defaulted] = await Promise.all([
    // ① 明确不缓存：每次请求都真的去调接口
    fetch(url, { cache: "no-store" }).then((r) => r.json() as Promise<Weather>),

    // ② 缓存 10 秒：这段时间内复用同一个结果
    fetch(url, { next: { revalidate: 10 } }).then(
      (r) => r.json() as Promise<Weather>,
    ),

    // ③ 什么都不写
    fetch(url).then((r) => r.json() as Promise<Weather>),
  ]);

  // 页面自身的渲染时刻，用来对比
  const renderedAt = new Date().toLocaleString("zh-CN");

  return (
    <>
      <h1>缓存控制</h1>
      <p className="lead">
        同一个接口，三种 fetch 选项。连续刷新，对比它们的时间戳。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          <code>cache: &quot;no-store&quot;</code>
        </h3>
        <p className="path">接口返回时间：{noStore.updatedAt}</p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: 0 }}>
          每次刷新都变。适合实时数据。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          <code>next: &#123; revalidate: 10 &#125;</code>
        </h3>
        <p className="path">接口返回时间：{revalidated.updatedAt}</p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: 0 }}>
          10 秒内刷新多少次都是同一个值；超过 10 秒后才更新。
          这就是第一章讲过的 ISR 思路，只不过用在了数据上。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          <code>fetch(url)</code> 什么都不写
        </h3>
        <p className="path">接口返回时间：{defaulted.updatedAt}</p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: 0 }}>
          和 no-store 表现一样——因为在 Next.js 15 之后，
          <strong>fetch 默认不再缓存</strong>。
        </p>
      </div>

      <p className="path">本页渲染时间：{renderedAt}</p>

      <div className="note warn">
        <strong>这是最容易踩的一个坑。</strong>
        很多老教程会说「Next.js 默认缓存 fetch」，那是 Next.js 14 及以前的行为。
        从 15 开始默认值反过来了：<strong>不写就等于不缓存</strong>。
        想缓存必须显式写 <code>next: &#123; revalidate: N &#125;</code> 或{" "}
        <code>cache: &quot;force-cache&quot;</code>。
      </div>

      <div className="note">
        <strong>如果数据不是通过 fetch 来的呢？</strong>
        比如直接查数据库。那么 fetch 的缓存选项管不着它——
        可以用 <code>unstable_cache</code> 把任意函数包起来缓存，
        或者用路由段配置 <code>export const revalidate = 10</code>{" "}
        控制整个页面的再生周期（第一章讲过）。
      </div>
    </>
  );
}
