// ============================================================
// 第八章的章节布局
// ============================================================
// 文件位置：app/navigation/layout.tsx

import Link from "next/link";

const pages = [
  { href: "/navigation", label: "总览" },
  { href: "/navigation/links", label: "Link 组件" },
  { href: "/navigation/router", label: "useRouter" },
  { href: "/navigation/redirect", label: "redirect()" },
] as const;

export default function NavigationLayout({
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
          本章导航（由 app/navigation/layout.tsx 提供）：
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
