// ============================================================
// 第六章的章节布局
// ============================================================
// 文件位置：app/dynamic-routes/layout.tsx

import Link from "next/link";

export default function DynamicRoutesLayout({
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
          本章导航（由 app/dynamic-routes/layout.tsx 提供）：
        </span>
        <Link href="/dynamic-routes">总览</Link>
        <Link href="/dynamic-routes/blog/hello-nextjs">单段动态 [slug]</Link>
        <Link href="/dynamic-routes/shop/数码/耳机/降噪">多段 catch-all</Link>
      </div>

      {children}
    </div>
  );
}
