// ============================================================
// 第十一章的章节布局
// ============================================================
// 文件位置：app/metadata/layout.tsx

import Link from "next/link";

export default function MetadataLayout({
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
          本章导航（由 app/metadata/layout.tsx 提供）：
        </span>
        <Link href="/metadata">静态元数据</Link>
        <Link href="/metadata/dynamic">动态元数据</Link>
        <Link href="/metadata/dynamic/metadata-basics">一篇文章</Link>
      </div>

      {children}
    </div>
  );
}
