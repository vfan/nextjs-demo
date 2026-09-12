// ============================================================
// useRouter 演示 —— 路由 /navigation/router
// ============================================================
// 文件位置：app/navigation/router/page.tsx
//
// 这一页本身是服务端组件，交互部分交给下面的客户端组件。

import { Suspense } from "react";
import RouterClient from "./router-client";

export default function RouterPage() {
  return (
    <>
      <h1>useRouter：用代码跳转</h1>
      <p className="lead">
        <code>&lt;Link&gt;</code> 管「用户点链接」，
        <code>useRouter</code> 管「代码主动跳转」。
      </p>

      {/*
        为什么要包一层 <Suspense>？
        因为 RouterClient 里用到了 useSearchParams()。这个 Hook 读取的是
        「本次请求的查询参数」，而静态页面在构建时根本不知道查询参数是什么。
        所以 Next.js 要求：凡是用到它的组件，都必须有一个 Suspense 边界兜底，
        这部分内容改为在浏览器里渲染。
        不做这一步，npm run build 会直接报错。
      */}
      <Suspense fallback={<p className="path">加载中…</p>}>
        <RouterClient />
      </Suspense>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>next/navigation 里的三个 Hook</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>
            <code>useRouter()</code> —— push / replace / back / forward / refresh / prefetch
          </li>
          <li>
            <code>usePathname()</code> —— 当前路径，用来做导航高亮
          </li>
          <li>
            <code>useSearchParams()</code> —— 查询参数；
            动态路由的参数则用 <code>useParams()</code>
          </li>
        </ul>
      </div>

      <div className="note warn">
        <strong>再次强调这个坑：</strong>这些 Hook 全部来自{" "}
        <code>next/navigation</code>。如果你从 <code>next/router</code> 引入，
        会得到 <code>undefined</code> 或者直接报错——那是 Pages Router 的入口。
      </div>
    </>
  );
}
