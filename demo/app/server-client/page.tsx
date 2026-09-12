// ============================================================
// 总览 —— 路由 /server-client
// ============================================================
// 文件位置：app/server-client/page.tsx
//
// 这一页本身就是一个服务端组件。判断依据：文件顶部没有 "use client"。

import Link from "next/link";

const rows = [
  {
    item: "默认身份",
    server: "默认就是服务端组件",
    client: "必须显式写 \"use client\"",
  },
  {
    item: "能用 useState / onClick 吗",
    server: "不能",
    client: "能",
  },
  {
    item: "能直接 await 取数据吗",
    server: "能，组件本身可以是 async",
    client: "不能，要用 useEffect 或 use()",
  },
  {
    item: "代码会发给浏览器吗",
    server: "不会（只发送渲染结果）",
    client: "会（整份组件代码都在 JS 包里）",
  },
  {
    item: "能读数据库 / 密钥吗",
    server: "能，安全",
    client: "不能，会泄露",
  },
  {
    item: "能渲染另一个吗",
    server: "能渲染客户端组件",
    client: "不能直接 import 服务端组件",
  },
];

export default function ServerClientPage() {
  return (
    <>
      <h1>第四章 · 服务端组件 vs 客户端组件</h1>
      <p className="lead">
        这是理解 App Router 最关键的一道分界线。它决定了你的代码
        到底跑在服务器上还是浏览器里——也决定了你能不能用
        <code>useState</code>、能不能安全地读数据库。
      </p>

      <div className="note warn">
        <strong>先记住一句话：</strong>在 App Router 里，
        <strong>所有组件默认都是服务端组件</strong>。
        你什么都不写，它就在服务器上渲染。只有当你写了{" "}
        <code>&quot;use client&quot;</code>，这个文件才会变成客户端组件。
      </div>

      <h2>对比表</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>对比项</th>
            <th>服务端组件（默认）</th>
            <th>客户端组件（&quot;use client&quot;）</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item}>
              <td>
                <strong>{r.item}</strong>
              </td>
              <td>{r.server}</td>
              <td>{r.client}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>三个页面，三种情况</h2>
      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>服务端组件</h3>
          <p className="path">app/server-client/server-demo/page.tsx</p>
          <p>
            直接 <code>await</code> 取数据、读只有服务器知道的变量，
            全程没有 <code>useState</code>。
          </p>
          <Link href="/server-client/server-demo">看看 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>客户端组件</h3>
          <p className="path">app/server-client/counter.tsx</p>
          <p>有计数器按钮，靠 useState 记住点击次数。</p>
          <Link href="/server-client/client-demo">看看 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>组合使用</h3>
          <p className="path">app/server-client/composition/page.tsx</p>
          <p>
            服务端组件渲染客户端组件，并把数据当 props 传下去。
          </p>
          <Link href="/server-client/composition">看看 →</Link>
        </div>
      </div>

      <div className="note">
        <strong>一个常见的误解：</strong>「客户端组件」≠「不在服务器上渲染」。
        客户端组件同样会先在服务器上渲染成 HTML（这叫预渲染），
        只是它<strong>额外</strong>还会把 JS 发到浏览器、在那里再「激活」一次。
        所以刷新页面时，客户端组件的内容一开始就已经在 HTML 里了。
      </div>
    </>
  );
}
