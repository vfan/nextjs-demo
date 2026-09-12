// ============================================================
// 第四章的章节布局
// ============================================================
// 文件位置：app/server-client/layout.tsx
//
// 和前面几章一样，这排导航放在 layout 里由四个页面共用。
// 它本身就是个服务端组件——注意它没有任何 "use client"，
// 却可以正常渲染，这是最平常不过的情况。

import Link from "next/link";

const pages = [
  { href: "/server-client", label: "总览" },
  { href: "/server-client/server-demo", label: "服务端组件" },
  { href: "/server-client/client-demo", label: "客户端组件" },
  { href: "/server-client/composition", label: "组合使用" },
] as const;

export default function ServerClientLayout({
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
         本章导航（由 app/server-client/layout.tsx 提供）：
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
