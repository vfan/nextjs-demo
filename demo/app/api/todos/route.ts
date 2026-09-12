// ============================================================
// 集合接口 —— GET/POST /api/todos
// ============================================================
// 文件位置：app/api/todos/route.ts
//
// 一个 route.ts 就是一个 HTTP 接口。和 page.tsx 一样靠文件夹定位：
//   app/api/todos/route.ts  →  /api/todos
//
// 区别在于导出的东西：page.tsx 导出 React 组件，
// route.ts 导出以 HTTP 方法命名的函数——GET、POST、PUT、DELETE、PATCH。
//
// 一条硬性规则：同一个文件夹里 route.ts 和 page.tsx 不能共存，
// 因为它们会争抢同一个 URL。
//
// 关于缓存：Next.js 15 之前 GET 接口默认会被静态化（构建时算一次结果），
// 15 之后改成默认动态。这里显式写上 force-dynamic，避免歧义——
// 一个「增删改查」的接口被静态化会非常离谱。

import { NextResponse } from "next/server";
import { createTodo, listTodos } from "./store";

export const dynamic = "force-dynamic";

// GET /api/todos —— 列出全部
export async function GET() {
  return NextResponse.json({ todos: listTodos() });
}

// POST /api/todos —— 新建一条
export async function POST(request: Request) {
  // 读取请求体。注意 request.json() 也是异步的
  const body = (await request.json()) as { title?: string };

  const title = body.title?.trim();
  if (!title) {
    // 参数不合法就返回 400，而不是默默创建一个空标题
    return NextResponse.json(
      { error: "title 不能为空" },
      { status: 400 },
    );
  }

  const todo = createTodo(title);

  // 201 Created 是「新建成功」的标准状态码
  return NextResponse.json({ todo }, { status: 201 });
}
