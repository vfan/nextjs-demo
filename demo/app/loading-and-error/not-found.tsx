// ============================================================
// 404 页面 —— app/loading-and-error/not-found.tsx
// ============================================================
// 文件位置：app/loading-and-error/not-found.tsx
//
// 作用范围是 app/loading-and-error/ 及其子路由。
// 既然每一层都可以有自己的 not-found.tsx，就可以做到「分区定制」：
//   · 全站的 404  → app/not-found.tsx
//   · 文档区的 404 → app/docs/not-found.tsx（可以带搜索框和目录）
//   · 后台的 404  → app/admin/not-found.tsx（可以带返回按钮）
//
// 不写任何 not-found.tsx 时，Next.js 会用内置的默认 404 页面。

import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 10,
        padding: "32px 28px",
        textAlign: "center",
        background: "#fff",
      }}
    >
      <p style={{ fontSize: "2.6rem", margin: "0 0 6px" }}>404</p>
      <h2 style={{ marginTop: 0, fontSize: "1.2rem" }}>这里什么都没有</h2>
      <p style={{ color: "#666" }}>
        这块内容是 <code>app/loading-and-error/not-found.tsx</code> 渲染出来的。
      </p>
      <p style={{ marginBottom: 0 }}>
        <Link href="/loading-and-error">← 回到本章首页</Link>
      </p>
    </div>
  );
}
