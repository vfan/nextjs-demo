// ============================================================
// 高亮当前页的导航（客户端组件）
// ============================================================
// 文件位置：app/navigation/links/active-nav.tsx
//
// 「我现在在哪个路由上」这个问题，靠 usePathname 回答。
// 它是客户端 Hook，所以这个文件必须是客户端组件。
//
// 另一个用途类似的 Hook 是 useParams，用来读动态路由的参数
// （第六章的 [slug] 那种）。

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/navigation/links", label: "Link 组件" },
  { href: "/navigation/router", label: "useRouter" },
  { href: "/navigation/redirect", label: "redirect()" },
] as const;

export default function ActiveNav() {
  // 当前路径，例如 "/navigation/links"
  const pathname = usePathname();

  return (
    <nav
      style={{
        display: "flex",
        gap: 10,
        padding: 8,
        background: "#f6f8fa",
        borderRadius: 8,
        border: "1px solid #e5e5e5",
      }}
    >
      {items.map((item) => {
        // 简单判断：当前路径是不是以这一项的地址开头
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: "0.9rem",
              textDecoration: "none",
              background: active ? "#0070f3" : "transparent",
              color: active ? "#fff" : "#333",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
