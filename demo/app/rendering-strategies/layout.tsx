// ============================================================
// 渲染策略章节的布局
// ============================================================
// 文件位置：app/rendering-strategies/layout.tsx
// 作用范围：/rendering-strategies 及其所有子路由
//
// 之所以把这排导航放在 layout 而不是每个页面里，是因为它要被
// 五个页面（总览 + 四种模式）共用。这本身就是第三章「布局共享外壳」
// 的一个实际应用：在这几个页面之间切换时，上面这排导航不会重新挂载。

import Link from "next/link";

const modes = [
  { href: "/rendering-strategies", label: "总览" },
  { href: "/rendering-strategies/csr", label: "CSR" },
  { href: "/rendering-strategies/ssr", label: "SSR" },
  { href: "/rendering-strategies/ssg", label: "SSG" },
  { href: "/rendering-strategies/isr", label: "ISR" },
] as const;

export default function RenderingStrategiesLayout({
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
          切换模式（由 app/rendering-strategies/layout.tsx 提供）：
        </span>
        {modes.map((m) => (
          <Link key={m.href} href={m.href}>
            {m.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
