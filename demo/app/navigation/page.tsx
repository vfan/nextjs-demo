// ============================================================
// 总览 —— 路由 /navigation
// ============================================================
// 文件位置：app/navigation/page.tsx

import Link from "next/link";

export default function NavigationPage() {
  return (
    <>
      <h1>第八章 · 导航与路由感知</h1>
      <p className="lead">
        在 Next.js 里跳转页面，不用 <code>&lt;a&gt;</code>，
        也不用引入路由库。而且你能随时知道「我现在在哪个路由上」。
      </p>

      <h2>三个页面</h2>
      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Link 组件</h3>
          <p className="path">app/navigation/links/page.tsx</p>
          <p>
            <code>&lt;Link&gt;</code> 的几种用法：预加载、替换历史记录、
            不滚动到顶部，以及高亮当前页。
          </p>
          <Link href="/navigation/links">去看看 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>useRouter</h3>
          <p className="path">app/navigation/router/router-client.tsx</p>
          <p>
            用代码跳转：前进、后退、替换、刷新，
            以及读取当前路径和查询参数。
          </p>
          <Link href="/navigation/router">去看看 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>redirect()</h3>
          <p className="path">app/navigation/redirect/page.tsx</p>
          <p>在服务端组件里直接重定向，用户看不到中间页面。</p>
          <Link href="/navigation/redirect">试试看 →</Link>
        </div>
      </div>

      <div className="note">
        <strong>先记住一个最容易踩的坑：</strong>在 App Router 里，
        <code>useRouter</code> 要从 <code>next/navigation</code> 引入，
        <strong>不是</strong> <code>next/router</code>。
        后者是旧的 Pages Router 时代的入口，在 App Router 里用会报错。
        所有路由相关的 Hook 都来自 <code>next/navigation</code>。
      </div>
    </>
  );
}
