// ============================================================
// 根布局（Root Layout）
// ============================================================
// 文件位置：app/layout.tsx  →  作用于全站所有路由
//
// 三条硬性规则：
//   1. 必须存在，是 Next.js 项目能启动的前提
//   2. 必须包含 <html> 和 <body>（子布局则不需要）
//   3. 全局 CSS 只能在这里引入，因为在别处引入无法保证对所有页面生效
//
// 类型说明：children 是当前路由的页面内容，Next.js 会自动注入。
// （Next.js 16 也提供了全局的 LayoutProps<"/"> 写法，二者等价，
//   这里用显式的 React.ReactNode 是为了让读者一眼看懂 children 是什么。）

import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// 站点默认元数据。子页面可以通过自己的 metadata 覆盖它。
export const metadata: Metadata = {
  title: {
    default: "Next.js 教程 Demo",
    template: "%s · Next.js 教程 Demo",
  },
  description: "配合 14 章教程的可运行示例项目",
};

// 全站导航用的章节清单。as const 让 href 保持字面量类型，
// 这样配合 Next.js 的类型化路由也能通过类型检查。
const chapters = [
  { href: "/rendering-strategies", label: "01 渲染" },
  { href: "/routing-basics", label: "02 路由" },
  { href: "/layouts", label: "03 布局" },
  { href: "/server-client", label: "04 组件" },
  { href: "/data-fetching", label: "05 取数" },
  { href: "/dynamic-routes", label: "06 动态路由" },
  { href: "/loading-and-error", label: "07 加载与错误" },
  { href: "/navigation", label: "08 导航" },
  { href: "/route-handlers", label: "09 API" },
  { href: "/server-actions", label: "10 Actions" },
  { href: "/metadata", label: "11 SEO" },
  { href: "/styling", label: "12 样式" },
  { href: "/images-fonts", label: "13 图片字体" },
  { href: "/middleware", label: "14 中间件" },
] as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 顶部导航：所有页面共享，切换路由时不会重新挂载 */}
        <header className="site-header">
          <Link href="/" className="brand">
            Next.js 教程 Demo
          </Link>
          <nav style={{ flexWrap: "wrap", gap: "4px 12px", fontSize: "0.82rem" }}>
            {chapters.map((c) => (
              <Link key={c.href} href={c.href}>
                {c.label}
              </Link>
            ))}
          </nav>
        </header>

        {/* 页面内容渲染在这里 */}
        <main className="site-main">{children}</main>

        {/* 页脚：同样所有页面共享 */}
        <footer className="site-footer">
          © 2026 Next.js 教程 Demo · 用 <code>npm run dev</code> 启动
        </footer>
      </body>
    </html>
  );
}
