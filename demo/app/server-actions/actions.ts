// ============================================================
// Server Actions
// ============================================================
// 文件位置：app/server-actions/actions.ts
//
// 文件顶部的 "use server" 是整件事的关键。它的意思是：
// 「这个文件里所有导出的函数，都是服务端函数」。
//
// 于是产生了一种很妙的效果：
//   · 客户端组件可以 import 这些函数，直接当事件处理函数用
//   · 但函数体永远在服务器上执行
//   · Next.js 自动帮你生成一个内部接口、序列化参数、把结果传回来
//
// 换句话说：你不用写 API 接口，不用手写 fetch、不用设 Content-Type、
// 不用 JSON.stringify，就能从浏览器调用服务端代码。
//
// 这也是第四章说过的那个「例外」——
// 函数本来不能从服务端传给客户端，但 Server Actions 被特殊处理过，可以。

"use server";

import { revalidatePath } from "next/cache";
import { addNote, deleteNote } from "./store";

// useActionState 要求 action 的签名是 (上一次的结果, formData) => 新结果
export type FormState = {
  error?: string;
  ok?: boolean;
};

export async function addNoteAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // 从表单里取值。注意 FormData 的值类型是 string | File
  const text = String(formData.get("text") ?? "").trim();

  // 校验放在服务端做，才是真的安全——
  // 浏览器里的校验只是给用户的即时反馈，绕过它太容易了
  if (!text) {
    return { error: "内容不能为空" };
  }
  if (text.length > 40) {
    return { error: "太长了，最多 40 个字" };
  }

  addNote(text);

  // 告诉 Next.js：/server-actions 下的数据变了，请重新取一次。
  // 没有这一行，页面上的列表不会更新——因为服务端组件的渲染结果被缓存了。
  revalidatePath("/server-actions");

  return { ok: true };
}

// 这个用在服务端组件的 <form action={...}> 里，不需要返回状态
export async function deleteNoteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  deleteNote(id);
  revalidatePath("/server-actions");
}
