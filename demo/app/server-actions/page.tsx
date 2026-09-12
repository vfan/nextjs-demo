// ============================================================
// 列表 + 删除 —— 路由 /server-actions
// ============================================================
// 文件位置：app/server-actions/page.tsx
//
// 这一页有个值得注意的地方：它是<strong>服务端组件</strong>，
// 却在表单里用了 action——而且这个表单不需要任何客户端 JavaScript。
//
// 也就是说，即使浏览器禁用了 JS，这个「删除」按钮照样能用。
// 这是 Server Actions 相比「fetch + onClick」的一个隐藏优势。

import Link from "next/link";
import { deleteNoteAction } from "./actions";
import { listNotes } from "./store";

// 数据存在服务器内存里，随时可能变，所以每次都重新渲染
export const dynamic = "force-dynamic";

export default function ServerActionsPage() {
  // 服务端组件直接读数据，不需要接口
  const notes = listNotes();

  return (
    <>
      <h1>第十章 · Server Actions</h1>
      <p className="lead">
        不用写接口，直接从表单调用服务端函数。
      </p>

      <div className="note">
        <strong>这一页为什么是服务端组件？</strong>
        因为它只读取数据、渲染表单，不需要任何交互状态。
        表单的提交由 Server Action 处理——函数体在服务器上跑。
      </div>

      <h2>留言板</h2>
      <p className="path">共 {notes.length} 条</p>

      <ul style={{ listStyle: "none", marginLeft: 0 }}>
        {notes.map((note) => (
          <li
            key={note.id}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 18px",
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom: 2 }}>{note.text}</p>
              <p className="path" style={{ marginBottom: 0 }}>
                {note.createdAt}
              </p>
            </div>

            {/*
              这个表单直接调用服务端函数。
              注意它没有 onClick、没有 fetch、没有 useState——
              就是一个普通的 HTML form，提交时浏览器会把数据发给服务端。
            */}
            <form action={deleteNoteAction}>
              <input type="hidden" name="id" value={note.id} />
              <button
                type="submit"
                style={{
                  padding: "6px 14px",
                  border: "1px solid #e5484d",
                  background: "#fff",
                  color: "#b42318",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                删除
              </button>
            </form>
          </li>
        ))}
      </ul>

      {notes.length === 0 ? (
        <p className="path">
          一条都没有了。去{" "}
          <Link href="/server-actions/simple">内联 action</Link> 那一页新增几条吧。
        </p>
      ) : null}

      <div className="callout note" style={{ marginTop: 24 }}>
        <strong>删除之后列表为什么立刻变了？</strong>
        因为 <code>deleteNoteAction</code> 最后调用了{" "}
        <code>revalidatePath(&quot;/server-actions&quot;)</code>，
        告诉 Next.js「这个路径的数据过期了，请重新取」。
        <br />
        少了这一行，你会删掉数据但页面纹丝不动——这是初学者最常遇到的困惑。
      </div>

      <div className="note warn">
        <strong>试试禁用 JavaScript：</strong>在浏览器设置里关掉 JS 再打开本页，
        删除按钮依然工作。因为整个流程（表单提交 → 服务端函数 → 重新渲染）
        都不依赖客户端脚本。这是 Server Actions 相对「fetch + onClick」的
        一个实在的优势。
      </div>
    </>
  );
}
