// ============================================================
// 第十章 的章节布局
// ============================================================
// 文件位置：app/server-actions/layout.tsx

import Link from "next/link";

const pages = [
  { href: "/server-actions", label: "列表 + 删除" },
  { href: "/server-actions/simple", label: "内联 action" },
  { href: "/server-actions/validated", label: "带校验的表单" },
] as const;

export default function ServerActionsLayout({
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
          本章导航（由 app/server-actions/layout.tsx 提供）：
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
