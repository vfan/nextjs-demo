// ============================================================
// 串行 vs 并行 —— 路由 /data-fetching/parallel
// ============================================================
// 文件地址：app/data-fetching/parallel/page.tsx
//
// 一个很容易被忽略的性能问题：多个 await 写成一排，会一个等一个，
// 总耗时是它们的和。用 Promise.all 能让它们同时跑，总耗时是最慢的那个。
//
// 这个页面请求三次接口（接口故意慢 300ms），分别用两种方式，
// 并把耗时打出来。刷新看看两个数字差多少。
//
// 小技巧：为什么三次请求要带不同的 ?slot= 参数？
// 因为 React 会对同一次渲染中「URL 完全相同」的请求做去重，
// 三次相同的请求会被合成一次，那就测不出真实耗时了。

import { apiUrl } from "../api-url";

type Weather = { city: string; temp: number; updatedAt: string };

function getWeather(url: string): Promise<Weather> {
  return fetch(url, { cache: "no-store" }).then(
    (r) => r.json() as Promise<Weather>,
  );
}

export default async function ParallelPage() {
  const url = await apiUrl("/api/weather");

  // ---------- 写法一：串行（一个等一个） ----------
  const serialStart = Date.now();
  const serial = [
    await getWeather(`${url}?slot=a`),
    await getWeather(`${url}?slot=b`),
    await getWeather(`${url}?slot=c`),
  ];
  const serialMs = Date.now() - serialStart;

  // ---------- 写法二：并行（同时发出） ----------
  const parallelStart = Date.now();
  const parallel = await Promise.all([
    getWeather(`${url}?slot=d`),
    getWeather(`${url}?slot=e`),
    getWeather(`${url}?slot=f`),
  ]);
  const parallelMs = Date.now() - parallelStart;

  return (
    <>
      <h1>串行 vs 并行</h1>
      <p className="lead">
        同样请求三次接口。一个写法花了三倍时间，另一个只花了一倍。
      </p>

      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>串行（逐个 await）</h3>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "4px 0" }}>
            {serialMs} ms
          </p>
          <p className="path">
            三次耗时相加 ≈ 300 + 300 + 300
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>并行（Promise.all）</h3>
          <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "4px 0" }}>
            {parallelMs} ms
          </p>
          <p className="path">同时发出，总耗时 ≈ 最慢的那一个</p>
        </div>
      </div>

      <h2 style={{ fontSize: "1.1rem" }}>两次拿到的数据</h2>
      <div className="card">
        <p className="path">串行：{serial.map((w) => w.temp).join("°C / ")}°C</p>
        <p className="path" style={{ marginBottom: 0 }}>
          并行：{parallel.map((w) => w.temp).join("°C / ")}°C
        </p>
      </div>

      <h3>两个写法的代码对比</h3>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "16px 20px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.82rem",
          lineHeight: 1.7,
        }}
      >{`// ❌ 串行：等完第一个才开始第二个，总耗时 900ms
const a = await getWeather(url)
const b = await getWeather(url)
const c = await getWeather(url)

// ✅ 并行：三个请求同时发出，总耗时 300ms
const [a, b, c] = await Promise.all([
  getWeather(url),
  getWeather(url),
  getWeather(url),
])`}</pre>

      <div className="note warn">
        <strong>什么时候不能并行？</strong>
        当第二个请求依赖第一个的结果时。比如先查用户 id，
        再拿这个 id 去查订单——那就只能串行。
        但只要请求之间没有依赖，就该并行。
      </div>

      <div className="note">
        <strong>更隐蔽的串行：</strong>嵌套的 async 组件也会造成瀑布流——
        父组件 await 完才渲染子组件，子组件再去 await。
        这种情况下可以用 <code>&lt;Suspense&gt;</code> 把子组件包起来，
        让它们各自流式加载（第八章会讲到）。
      </div>
    </>
  );
}
