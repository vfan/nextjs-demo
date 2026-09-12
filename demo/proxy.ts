// ============================================================
// 中间件（Next.js 16 起叫 proxy）
// ============================================================
// 文件位置：proxy.ts —— 必须放在项目根目录（或 src/ 下）
//
// ⚠️ 一个重要的命名变化
// ---------------------------------------------------------------
// Next.js 16 把这个约定文件从 middleware.ts 改名成了 proxy.ts，
// 导出的函数也从 middleware 改成了 proxy。
//
//   旧写法（Next.js 15 及以前）    新写法（Next.js 16 起）
//   middleware.ts                  proxy.ts
//   export function middleware()   export function proxy()
//
// 功能完全一样，只是名字变了——官方认为 "proxy"（代理）
// 更能准确表达它的本质：在请求抵达页面之前做一层转发和改写。
//
// 本 demo 用的是 Next.js 16，所以文件叫 proxy.ts。
// 如果你在旧项目里看到 middleware.ts，那是同一个东西。
// 这个概念在社区里仍然普遍叫「中间件」。
// ---------------------------------------------------------------
//
// 它在「请求到达页面之前」运行。每个匹配到的请求都会先经过这里，
// 你可以决定：放行、改写、重定向，或者直接返回一个响应。
//
// 两个重要限制：
//   1. 运行在 Edge 运行时，不是完整的 Node 环境。
//      很多 Node 专有 API 用不了（这也是为什么它必须轻量）。
//   2. 文件必须在项目根目录，不是在 app/ 里面。
//
// ⚠️ 本 demo 的注意点：它会作用于整个应用。
// 为了不影响其它章节的演示，下面用 config.matcher 把范围
// 严格限制在 /middleware/* —— 只有这一章的页面会经过它。

import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---------------------------------------------------------
  // 场景一：旧地址迁移
  // ---------------------------------------------------------
  // 网站改版后旧的链接不能直接 404，要平滑地导到新地址。
  if (pathname === "/middleware/old") {
    // 307 临时重定向：浏览器会改用新地址再请求一次
    return NextResponse.redirect(new URL("/middleware/new", request.url));
  }

  // ---------------------------------------------------------
  // 场景二：访问保护（鉴权初筛）
  // ---------------------------------------------------------
  // 检查有没有登录凭证（这里用一个 cookie 模拟）。
  // 没有就踢回首页，并带上一个标记，好让首页显示提示。
  if (pathname.startsWith("/middleware/protected")) {
    const token = request.cookies.get("demo-token");

    if (!token) {
      const loginUrl = new URL("/middleware", request.url);
      loginUrl.searchParams.set("denied", "1");
      return NextResponse.redirect(loginUrl);
    }
  }

  // ---------------------------------------------------------
  // 场景三：往下传一个自定义头
  // ---------------------------------------------------------
  // 这是「它确实运行过」的证据。
  //
  // 这里有个容易搞错的细节：请求头和响应头是两回事。
  //   · 改 request 头  → 页面里的 headers() 才读得到
  //   · 改 response 头 → 只有浏览器/网络面板看得到
  // 所以下面两个都设置了，页面上和网络面板里都能验证。
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-demo-middleware", "hello-from-middleware");

  const response = NextResponse.next({
    // 把改过的请求头交给后续的页面
    request: { headers: requestHeaders },
  });
  // 同时在响应头里也放一份，方便在浏览器网络面板里直接看到
  response.headers.set("x-demo-middleware", "hello-from-middleware");

  return response;
}

// ============================================================
// matcher：限定生效范围
// ============================================================
// 不写 matcher 的话，它会对**每一个**请求运行，包括静态资源。
// 这既浪费性能，也容易出意外（比如把图片也重定向了）。
//
// 这里的写法表示：只处理 /middleware 及其子路径。
// 其它章节的页面完全不会经过它。

export const config = {
  matcher: ["/middleware/:path*"],
};
