// ============================================================
// 内联 Server Action —— 路由 /server-actions/simple
// ============================================================
// 文件位置：app/server-actions/simple/page.tsx
//
// 除了把 action 写在单独的文件里（"use server" 在文件顶部），
// 还有一种更紧凑的写法：直接写在组件内部，在函数体第一行写 "use server"。
//
// 什么时候用哪种？
//   · 内联：这个 action 只服务于这一个页面，不需要复用
//   · 独立文件：多个页面共用，或者需要单独测试
//
// 注意：内联 action 不能定义在客户端组件里。
// 客户端组件要用 action，只能 import 一个已经定义好的。

import Link from "next/link";
import { revalidatePath } from "next/cache";
import { addNote } from "../store";

export default function SimplePage() {
  // 内联的 Server Action
  async function addNoteInline(formData: FormData) {
    "use server"; // 这一行让它变成服务端函数

    const text = String(formData.get("text") ?? "").trim();
    if (!text) return;

    addNote(text);
    // 让列表页重新取数据
    revalidatePath("/server-actions");
  }

  return (
    <>
      <h1>内联的 Server Action</h1>
      <p className="lead">
        整个交互逻辑写在同一段代码里，不用跳去别的文件。
      </p>

      <form
        action={addNoteInline}
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
      >
        <input
          name="text"
          placeholder="写点什么…"
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1px solid #d0d0d0",
            borderRadius: 8,
            fontSize: "0.95rem",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 22px",
            border: "1px solid #0070f3",
            background: "#0070f3",
            color: "#fff",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          发布
        </button>
      </form>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>它和直接写接口有什么不同</h3>
        <p style={{ marginBottom: 0 }}>
          如果用第九章的 route.ts 做同样的事，你要写：
          一个 POST 接口、一个客户端组件、用 useState 管理输入、
          用 fetch 发请求、处理加载和错误、再手动刷新列表。
          <br />
          用 Server Action，上面这些只剩一个函数和一个 <code>&lt;form&gt;</code>。
        </p>
      </div>

      <div className="note">
        <strong>去哪里看结果？</strong>
        回到{" "}
        <Link href="/server-actions">列表页</Link>，
        刚才发布的内容就在最上面——因为 action 里调用了{" "}
        <code>revalidatePath</code>，列表页会自动重新取数据。
      </div>

      <div className="note warn">
        <strong>一个容易困惑的点：</strong>浏览器里的 <code>&lt;form action=&#123;函数&#125;&gt;</code>
        看起来像是把函数传给了 DOM，其实不是。
        构建时 Next.js 为这个函数生成了一个内部标识，
        表单提交时浏览器把数据 POST 到服务端，由 Next.js 找到对应的函数执行。
        你看到的是「像调用本地函数」，实际跨越了网络。
      </div>
    </>
  );
}
