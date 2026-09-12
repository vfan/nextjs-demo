// ============================================================
// 直接取数据 —— 路由 /data-fetching
// ============================================================
// 文件位置：app/data-fetching/page.tsx
//
// 这是 App Router 里取数据最自然的样子：组件是 async 的，
// 里面直接 await，拿到数据后渲染。
//
// 对比一下纯 React 的写法：
//   useState 存数据 + useEffect 发请求 + 处理 loading/error 两套状态
// 服务端组件把这些全省了——数据在渲染之前就已经拿到，
// 所以页面根本不存在「加载中」这个中间状态。

import { apiUrl } from "./api-url";

type Weather = {
  city: string;
  temp: number;
  updatedAt: string;
};

export default async function DataFetchingPage() {
  // 拿到本应用的绝对地址（因为接口和数据获取代码在同一个项目里）
  const url = await apiUrl("/api/weather");

  // 直接 await。cache: "no-store" 表示这次请求的结果不要缓存。
  const response = await fetch(url, { cache: "no-store" });
  const weather = (await response.json()) as Weather;

  return (
    <>
      <h1>在服务端组件里直接取数据</h1>
      <p className="lead">
        页面在服务器上完成取数和渲染，浏览器拿到的是已经带着数据的 HTML。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>
          {weather.city} · {weather.temp}°C
        </h3>
        <p className="path">接口返回的时间：{weather.updatedAt}</p>
        <p style={{ marginTop: 8, fontSize: "0.9rem", color: "#666" }}>
          每次刷新都会变，因为用了 <code>cache: &quot;no-store&quot;</code>，
          每次请求都真的去调了一次接口。
        </p>
      </div>

      <div className="note warn">
        <strong>注意这里没有「加载中」。</strong>
        因为数据是在服务器上取好之后才开始渲染 HTML 的，
        浏览器压根不会经历「页面出来了但数据还没到」的状态。
        <br />
        （想要加载状态？那是第七章 <code>loading.tsx</code> 要解决的事——
        它优化的是「服务器取数据这段时间用户看什么」，是另一回事。）
      </div>

      <div className="note">
        <strong>真实项目里通常还要更简单：</strong>如果数据来自你自己的数据库，
        连 <code>fetch</code> 和 API 接口都不需要——
        直接在服务端组件里调用数据模块即可：
        <br />
        <code>const posts = await db.post.findMany()</code>
        <br />
        服务端组件的代码不会发到浏览器，所以这样做既安全又少一层网络开销。
      </div>
    </>
  );
}
