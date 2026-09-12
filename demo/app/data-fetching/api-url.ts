// ============================================================
// 拼出「当前应用自己」的绝对地址
// ============================================================
// 文件位置：app/data-fetching/api-url.ts
//
// 为什么需要这个？因为服务端组件里的 fetch 必须用绝对 URL
// （它运行在 Node 里，没有「当前页面」这个概念，猜不出域名）。
//
// 而本章的「第三方天气接口」恰好就部署在同一个应用里，
// 所以我们从请求头里拿到 host，拼出完整地址。
//
// 真实项目里的两种情况都不会用到它：
//   1. 调外部接口 → 直接写 https://api.example.com/weather
//   2. 用自己的数据 → 多数时候不需要 API 层，直接在服务端组件里
//      调用数据模块（连 fetch 都不需要）

import { headers } from "next/headers";

export async function apiUrl(path: string): Promise<string> {
  // headers() 是异步的，Next.js 15 之后必须 await
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";

  // 本地开发用 http，线上一般用 https
  const protocol =
    host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";

  return `${protocol}://${host}${path}`;
}
