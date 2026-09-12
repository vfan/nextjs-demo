// ============================================================
// 服务端组件示例 —— 路由 /server-client/server-demo
// ============================================================
// 文件位置：app/server-client/server-demo/page.tsx
//
// 这个文件里没有任何 "use client"。所以它是一个服务端组件，
// 具备三个客户端组件没有的能力：
//
//   1. 组件本身可以是 async，直接 await 数据
//   2. 可以导入只有服务器能用的模块（数据库、密钥）
//   3. 它的代码不会被打包进浏览器的 JS
//
// 反过来，它也有代价：不能用 useState、useEffect、onClick。
// 你可以试着在这行下面写一句 const [x, setX] = useState(0)，
// 构建时会直接报错——这不是限制，而是框架在帮你避免错误。

import { getDashboardData } from "../server-data";

export default async function ServerDemoPage() {
  // 直接 await。不需要 useEffect，不需要 loading 状态，不需要客户端水合。
  const data = await getDashboardData();

  return (
    <>
      <h1>服务端组件</h1>
      <p className="lead">
        这一页在服务器上完成渲染，浏览器拿到的已经是带着数据的 HTML。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>渲染时间</h3>
        <p className="path">
          由服务端组件在服务器上生成：{data.generatedAt}
        </p>
        <p style={{ marginTop: 8, fontSize: "0.9rem", color: "#666" }}>
          每次刷新都会变，因为每次请求服务器都重新执行了这个组件。
        </p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>数据表格</h3>
        <ul style={{ marginBottom: 0 }}>
          {data.rows.map((row) => (
            <li key={row.label}>
              {row.label}：<strong>{row.value}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="note warn">
        <strong>验证「代码不会发给浏览器」：</strong>
        下面这个 token 是服务器上算出来的：<code>{data.token}</code>，
        它被写进了 HTML（你按 Ctrl+U 能看到）。
        但 <code>app/server-client/server-data.ts</code> 这个文件本身
        <strong>不会</strong>出现在浏览器的 JS 包里——因为没有任何客户端组件导入它。
        <br />
        实际项目里，这个位置放的就是数据库连接串和 API 密钥。
      </div>
    </>
  );
}
