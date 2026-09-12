// ============================================================
// 客户端组件示例 —— 路由 /server-client/client-demo
// ============================================================
// 文件位置：app/server-client/client-demo/page.tsx
//
// 注意：这个文件本身仍然是服务端组件——它没有 "use client"。
// 「服务端组件渲染客户端组件」是最常见的用法：
// 外层负责取数据和排版，内层负责交互。

import Counter from "../counter";

export default function ClientDemoPage() {
  return (
    <>
      <h1>客户端组件</h1>
      <p className="lead">
        页面外壳由服务端组件渲染，橙色框里的计数器来自真正的客户端组件。
      </p>

      <Counter />

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>怎么判断一个组件是不是客户端组件？</h3>
        <p>
          看两点，满足任意一条就是：
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li>
            文件顶部有 <code>&quot;use client&quot;</code>
          </li>
          <li>它导入的某个模块顶部有 &quot;use client&quot;</li>
        </ul>
      </div>

      <div className="note">
        <strong>试一试：</strong>点几下计数器，然后刷新页面——
        计数会归零。因为组件状态只活在浏览器内存里，刷新就没了。
        <br />
        但请注意别搞混：刷新后 HTML 里<strong>第一次渲染的数字仍然是 0</strong>，
        说明客户端组件也确实参与了一次服务端预渲染。
      </div>
    </>
  );
}
