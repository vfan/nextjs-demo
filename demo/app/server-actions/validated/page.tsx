// ============================================================
// 带校验的表单 —— 路由 /server-actions/validated
// ============================================================
// 文件位置：app/server-actions/validated/page.tsx

import Link from "next/link";
import NoteForm from "./note-form";

export default function ValidatedPage() {
  return (
    <>
      <h1>带校验与提交状态的表单</h1>
      <p className="lead">
        校验在服务端做，提交状态由 useActionState 提供。
      </p>

      <NoteForm />

      <div className="note warn" style={{ marginTop: 24 }}>
        <strong>试一试这两种错误：</strong>
        <ul style={{ margin: "8px 0 0 20px" }}>
          <li>什么都不填直接点「发布」→ 提示「内容不能为空」</li>
          <li>输入超过 40 个字 → 提示「太长了」</li>
        </ul>
        这些提示来自 <code>addNoteAction</code> 的返回值，
        通过 <code>useActionState</code> 的 <code>state</code> 传回界面。
        整个过程中表单没有跳转、没有整页刷新。
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>为什么校验要放在服务端？</h3>
        <p style={{ marginBottom: 0 }}>
          浏览器里的校验（比如 <code>required</code> 属性、正则）
          只是给用户的即时反馈，绕过它太容易了——改一行 HTML 就行。
          <strong>只有服务端校验才算数</strong>。
          <br />
          所以正确的做法是两边都做：浏览器端为了体验，服务端为了安全。
        </p>
      </div>

      <div className="note">
        <strong>去哪里看结果？</strong>
        发布成功后回到 <Link href="/server-actions">列表页</Link>，
        新内容会出现在最上面。这是 <code>revalidatePath</code> 的功劳。
      </div>
    </>
  );
}
