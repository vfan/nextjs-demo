// ============================================================
// 第十二章的章节布局
// ============================================================
// 文件位置：app/styling/layout.tsx

import Link from "next/link";

const pages = [
  { href: "/styling", label: "总览" },
  { href: "/styling/css-modules", label: "CSS Modules" },
  { href: "/styling/conditional", label: "条件类名" },
] as const;

export default function StylingLayout({
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
          本章导航（由 app/styling/layout.tsx 提供）：
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
