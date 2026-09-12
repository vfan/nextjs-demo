// ============================================================
// 模拟登录 / 登出 —— GET /middleware/auth
// ============================================================
// 文件位置：app/middleware/auth/route.ts
//
// 中间件里的「访问保护」检查的是一个叫 demo-token 的 cookie。
// 这个接口负责设置和清除它，好让你能亲手触发两种情况：
//
//   /middleware/auth?action=login   → 种下 cookie，然后去受保护页面
//   /middleware/auth?action=logout  → 清掉 cookie，然后去受保护页面
//                                     （会被中间件拦回首页）
//
// 真实项目里这里就是你的登录接口，cookie 也应该是
// httpOnly + secure + 签名过的。

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const action = searchParams.get("action");

  // 处理完之后跳到受保护的页面，好让效果立刻可见
  const response = NextResponse.redirect(
    new URL("/middleware/protected", origin),
  );

  if (action === "logout") {
    response.cookies.delete("demo-token");
  } else {
    response.cookies.set("demo-token", "ok", {
      path: "/",
      httpOnly: true, // 禁止 JS 读取，降低 XSS 风险
      maxAge: 60 * 60, // 一小时后过期
    });
  }

  return response;
}
