// ============================================================
// 总览 —— 路由 /route-handlers
// ============================================================
// 文件位置：app/route-handlers/page.tsx
//
// 这一页演示怎么调用第九章写的那些接口。
// 页面本身是服务端组件，交互部分交给客户端组件。

import Link from "next/link";
import TodoClient from "./todo-client";

export default function RouteHandlersPage() {
  return (
    <>
      <h1>第九章 · API 路由</h1>
      <p className="lead">
        用 <code>route.ts</code> 写 HTTP 接口，给外部系统或者客户端组件调用。
      </p>

      <h2>接口清单</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>方法</th>
            <th>地址</th>
            <th>作用</th>
            <th>源文件</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>GET</code></td>
            <td className="path">/api/todos</td>
            <td>列出全部</td>
            <td className="path">app/api/todos/route.ts</td>
          </tr>
          <tr>
            <td><code>POST</code></td>
            <td className="path">/api/todos</td>
            <td>新建一条</td>
            <td className="path">app/api/todos/route.ts</td>
          </tr>
          <tr>
            <td><code>GET</code></td>
            <td className="path">/api/todos/1</td>
            <td>查一条</td>
            <td className="path">app/api/todos/[id]/route.ts</td>
          </tr>
          <tr>
            <td><code>PUT</code></td>
            <td className="path">/api/todos/1</td>
            <td>更新一条</td>
            <td className="path">app/api/todos/[id]/route.ts</td>
          </tr>
          <tr>
            <td><code>DELETE</code></td>
            <td className="path">/api/todos/1</td>
            <td>删除一条</td>
            <td className="path">app/api/todos/[id]/route.ts</td>
          </tr>
        </tbody>
      </table>

      <div className="note warn">
        <strong>可以直接在浏览器里试：</strong>
        打开{" "}
        <Link href="/api/todos">/api/todos</Link>，
        你会看到原始 JSON——因为地址栏发的是 GET 请求。
        <br />
        POST / PUT / DELETE 没法用地址栏发，得用下面的界面，
        或者在终端里用 <code>curl</code>。
      </div>

      <h2>调用这套接口</h2>
      <p>
        下面这个待办清单是真的在调上面那些接口。注意「最近一次请求」
        那一行——它会把 HTTP 状态码打出来。
      </p>

      <TodoClient />

      <div className="note">
        <strong>试着制造几个错误：</strong>
        <ul style={{ margin: "8px 0 0 20px" }}>
          <li>提交一个空标题 → 接口返回 <strong>400</strong>（参数不合法）</li>
          <li>删除某条之后，再用 curl 删同一个 id → 返回 <strong>404</strong>（已经不存在了）</li>
        </ul>
        用对了状态码，调用方才知道该不该重试、该怎么提示用户。
      </div>

      <h2>什么时候该写接口，什么时候不该</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>场景</th>
            <th>该用什么</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>自己的页面要取数据</td>
            <td>
              直接在服务端组件里调用数据模块，<strong>不需要</strong>写接口
              （第五章讲过）
            </td>
          </tr>
          <tr>
            <td>浏览器里的客户端组件要取数据</td>
            <td>可以用 route.ts，也可以用 Server Actions（第十章）</td>
          </tr>
          <tr>
            <td>外部系统要调用你的服务</td>
            <td><code>route.ts</code>——这是它最主要的用途</td>
          </tr>
          <tr>
            <td>接收 Webhook</td>
            <td><code>route.ts</code></td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
