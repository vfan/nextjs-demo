// ============================================================
// 第五章的章节布局
// ============================================================
// 文件位置：app/data-fetching/layout.tsx

import Link from "next/link";

const pages = [
  { href: "/data-fetching", label: "直接取数据" },
  { href: "/data-fetching/caching", label: "缓存控制" },
  { href: "/data-fetching/parallel", label: "串行 vs 并行" },
] as const;

export default function DataFetchingLayout({
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
          本章导航（由 app/data-fetching/layout.tsx 提供）：
        </span>
        {pages.map((p) => (
          <Link key={p.href} href={p.href}>
            {p.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
