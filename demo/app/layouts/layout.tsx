// ============================================================
// 第二章的章节布局
// ============================================================
// 文件位置：app/layouts/layout.tsx  →  只作用于 /layouts/ 及其所有子路由
//
// 这是一个「子布局」：
//   • 它不需要写 <html> / <body>——那是根布局 app/layout.tsx 的职责
//   • 它会被根布局包住，形成「根布局 → 章节布局 → 页面」的三层结构
//   • 在 /layouts 下的各个页面之间来回切换时，这个导航条不会重新挂载
//
// 顺带一提：右上角这个导航条本身就是「布局持久化」的活例子——
// 你从 /layouts/nested 切到 /layouts/pricing，只有下面的内容区变了。

import Link from "next/link";

export default function LayoutsChapterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          padding: "12px 16px",
          border: "1px dashed #cfcfcf",
          borderRadius: 8,
          marginBottom: 24,
          fontSize: "0.92rem",
          background: "#fcfcfc",
        }}
      >
        <span style={{ color: "#999", fontSize: "0.85rem" }}>
          本章导航（由 app/layouts/layout.tsx 提供）：
        </span>
        <Link href="/layouts/nested">嵌套布局</Link>
        <Link href="/layouts/pricing">路由组布局</Link>
        <Link href="/layouts/template-demo">template 对比</Link>
      </div>

      {/* 子页面渲染处 */}
      {children}
    </div>
  );
}
