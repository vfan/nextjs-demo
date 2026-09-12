// ============================================================
// 中间件总览 —— 路由 /middleware
// ============================================================
// 文件位置：app/middleware/page.tsx
//
// 这一页用来验证两件事：
//   1. 中间件确实运行过（读它传下来的请求头）
//   2. 被拦截时的提示（读查询参数）

import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "中间件",
  description: "在请求到达页面之前拦截：重定向、鉴权初筛、注入请求头。",
};

export default async function MiddlewarePage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const { denied } = await searchParams;

  // 读中间件塞进来的请求头。headers() 是异步的，要 await。
  const headerList = await headers();
  const marker = headerList.get("x-demo-middleware");

  return (
    <>
      <h1>第十四章 · 中间件</h1>
      <p className="lead">
        在所有请求到达页面之前先过一道关卡。
      </p>

      {/* 被中间件拦回来时显示的提示 */}
      {denied ? (
        <div
          className="card"
          style={{
            background: "#fdecec",
            borderColor: "#e5484d",
          }}
        >
          <strong style={{ color: "#b42318" }}>
            你刚才是被中间件拦回来的。
          </strong>
          <p style={{ marginTop: 6, marginBottom: 0, color: "#7a271a" }}>
            受保护的页面要求有 <code>demo-token</code> cookie，
            你还没有，所以中间件把你重定向到了这里。
            点下面的「登录」按钮拿到凭证再试一次。
          </p>
        </div>
      ) : null}

      <h2>证据一：中间件传下来的请求头</h2>
      <div className="card">
        <p className="path" style={{ marginBottom: 0 }}>
          headers().get(&quot;x-demo-middleware&quot;) ={" "}
          {marker ? (
            <strong style={{ color: "#157347" }}>&quot;{marker}&quot;</strong>
          ) : (
            <span style={{ color: "#b42318" }}>null（中间件没运行？）</span>
          )}
        </p>
      </div>
      <p>
        这个头是 <code>middleware.ts</code> 塞进来的。能在页面上读到它，
        就说明请求确实经过了中间件。
      </p>
      <div className="note">
        也可以在开发者工具的 Network 面板里点开这个文档请求，
        在 <strong>Response Headers</strong> 里找同名的头——中间件把它也写进了响应。
      </div>

      <h2>证据二：旧地址自动跳转</h2>
      <div className="card">
        <p style={{ marginBottom: 8 }}>
          <Link href="/middleware/old">点这个旧地址（/middleware/old）</Link>
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: 0 }}>
          你应该会落到 <code>/middleware/new</code>，而且地址栏里是新的路径。
          打开 Network 面板，能看到那个请求返回的是 <strong>307</strong>。
          <br />
          注意：<code>/middleware/old</code> 这个页面<strong>在项目里根本不存在</strong>——
          它在中间件层就被拦下了，压根没有走到路由匹配那一步。
        </p>
      </div>

      <h2>证据三：访问保护</h2>
      <div className="card">
        <p style={{ marginBottom: 10 }}>
          受保护页面是 <code>/middleware/protected</code>，需要凭证才能进。
        </p>
        <p style={{ marginBottom: 6 }}>
          <Link href="/middleware/auth?action=login">① 先登录（种下 cookie）</Link>
        </p>
        <p style={{ marginBottom: 6 }}>
          <Link href="/middleware/protected">② 再访问受保护页面</Link>
        </p>
        <p style={{ marginBottom: 0 }}>
          <Link href="/middleware/auth?action=logout">③ 登出（清掉 cookie）</Link>
        </p>
      </div>
      <div className="note warn">
        <strong>注意第 ③ 步之后会发生什么：</strong>
        登出接口本身会把你导向受保护页面，但中间件发现 cookie 没了，
        于是又把你送回本页，并带上 <code>?denied=1</code>——
        所以你会看到页面顶部的红色提示。
      </div>

      <h2>中间件能做什么、不该做什么</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>适合</th>
            <th>不适合</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>重定向、改写 URL</td>
            <td>查数据库</td>
          </tr>
          <tr>
            <td>鉴权的初步筛选（有没有 cookie）</td>
            <td>复杂的权限判断</td>
          </tr>
          <tr>
            <td>加请求头 / 响应头</td>
            <td>耗时超过几十毫秒的操作</td>
          </tr>
          <tr>
            <td>A/B 测试分流、地区/语言跳转</td>
            <td>业务逻辑（应该放 Server Actions 或接口里）</td>
          </tr>
        </tbody>
      </table>
      <p>
        原因很简单：中间件运行在 Edge 运行时，而且<strong>每个匹配到的请求都要跑一遍</strong>。
        它慢一点，整个站点都慢。
      </p>
    </>
  );
}
