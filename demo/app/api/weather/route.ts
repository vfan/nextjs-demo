// ============================================================
// 一个模拟的第三方接口 —— GET /api/weather
// ============================================================
// 文件位置：app/api/weather/route.ts
//
// 这一章要演示「服务端取数据」，总得有个数据源。这个 route.ts
// 就充当那个数据源——假装它是一个外部的天气接口。
//
// 关于 route.ts 的完整用法在第九章，这里只用到最简单的 GET。
//
// 关键的一行是 force-dynamic：它保证每次请求都真的执行这段代码。
// 否则 Next.js 可能在构建时就把它算成一个固定结果，
// 那样「每次返回的时间不一样」这个前提就不成立了。

import { NextResponse } from "next/server";

// 让这个接口每次都重新执行，不做静态化
export const dynamic = "force-dynamic";

export async function GET() {
  // 模拟一次网络往返的耗时，让「串行 vs 并行」的差异看得更明显
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json({
    city: "北京",
    // 加一点随机，这样重复调用能看出来确实每次都重新执行了
    temp: Math.round(15 + Math.random() * 12),
    updatedAt: new Date().toLocaleString("zh-CN"),
  });
}
