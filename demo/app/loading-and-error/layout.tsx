// ============================================================
// 第七章的章节布局
// ============================================================
// 文件位置：app/loading-and-error/layout.tsx

import Link from "next/link";

const pages = [
  { href: "/loading-and-error", label: "总览" },
  { href: "/loading-and-error/slow", label: "loading.tsx" },
  { href: "/loading-and-error/error-demo", label: "error.tsx" },
  { href: "/loading-and-error/not-found-demo", label: "not-found.tsx" },
] as const;

export default function LoadingAndErrorLayout({
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
          本章导航（由 app/loading-and-error/layout.tsx 提供）：
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
