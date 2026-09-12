// ============================================================
// 单条资源接口 —— /api/todos/[id]
// ============================================================
// 文件位置：app/api/todos/[id]/route.ts
//
// 动态路由在接口里同样适用：文件夹叫 [id]，这个接口就负责
// /api/todos/1、/api/todos/2 这类地址。
//
// 注意第二个参数的写法：Next.js 15 起 params 是 Promise，必须 await。
// 这和第六章页面里的变化是同一件事。

import { NextResponse } from "next/server";
import { deleteTodo, getTodo, updateTodo } from "../store";

type Context = {
  params: Promise<{ id: string }>;
};

// GET /api/todos/1 —— 查一条
export async function GET(_request: Request, { params }: Context) {
  const { id } = await params;
  const todo = getTodo(id);

  if (!todo) {
    return NextResponse.json({ error: "没有这条待办" }, { status: 404 });
  }

  return NextResponse.json({ todo });
}

// PUT /api/todos/1 —— 更新一条
export async function PUT(request: Request, { params }: Context) {
  const { id } = await params;
  const body = (await request.json()) as { title?: string; done?: boolean };

  const updated = updateTodo(id, {
    ...(body.title !== undefined ? { title: body.title } : {}),
    ...(body.done !== undefined ? { done: body.done } : {}),
  });

  if (!updated) {
    return NextResponse.json({ error: "没有这条待办" }, { status: 404 });
  }

  return NextResponse.json({ todo: updated });
}

// DELETE /api/todos/1 —— 删除一条
export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  const removed = deleteTodo(id);

  if (!removed) {
    return NextResponse.json({ error: "没有这条待办" }, { status: 404 });
  }

  // 204 No Content：删除成功，但没有内容要返回
  return new NextResponse(null, { status: 204 });
}
