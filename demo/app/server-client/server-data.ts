// ============================================================
// 只在服务端运行的代码
// ============================================================
// 文件位置：app/server-client/server-data.ts
//
// 这个模块只被服务端组件导入。因为没有任何客户端组件导入它，
// 它的代码不会进入发给浏览器的 JS 包里。
//
// 真实项目里，这里放的就是「绝不能泄露到浏览器」的东西：
// 数据库连接、API 密钥、只读环境变量（process.env.DB_PASSWORD）等。
// 这正是服务端组件最大的价值之一——敏感逻辑天然留在服务器上。

// 模拟一个只有服务器知道的字符串。它会被渲染进 HTML，
// 但它的「来源代码」不会出现在浏览器的 JS 里。
const INTERNAL_TOKEN = "srv_9f3a91c4";

export type DashboardData = {
  token: string;
  generatedAt: string;
  rows: { label: string; value: string }[];
};

// 服务端组件可以直接 await 一个异步函数，不需要 useEffect。
export async function getDashboardData(): Promise<DashboardData> {
  // 模拟一次数据库查询的耗时
  await new Promise((resolve) => setTimeout(resolve, 120));

  return {
    token: INTERNAL_TOKEN,
    generatedAt: new Date().toLocaleString("zh-CN"),
    rows: [
      { label: "今日订单", value: "1,284" },
      { label: "活跃用户", value: "8,932" },
      { label: "转化率", value: "4.2%" },
    ],
  };
}
