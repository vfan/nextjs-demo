// ============================================================
// 侧边栏（客户端组件）—— 用来证明「布局不会被销毁」
// ============================================================
// 文件位置：app/layouts/nested/sidebar.tsx
//
// 为什么需要 "use client"？
//   因为下面用到了 useState（组件内部状态）和 usePathname（浏览器地址）。
//   这类依赖浏览器环境的功能必须声明为客户端组件。
//   （"use client" 的完整规则是第三章的内容，这里先照着写就行。）
//
// 这个组件的存在意义，是让「布局持久化」看得见摸得着：
//   • 在输入框里打几个字，或点几下计数器
//   • 然后切到「数据分析」或「账户设置」
//   • 回来一看，字还在、数字没归零
//   这说明侧边栏组件从头到尾就没有被卸载过。

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// 用 as const 让 href 保持字面量类型，这样配合 Next.js 的类型化路由
// 也能通过类型检查。
const navItems = [
  { href: "/layouts/nested", label: "概览" },
  { href: "/layouts/nested/analytics", label: "数据分析" },
  { href: "/layouts/nested/settings", label: "账户设置" },
] as const;

export default function NestedSidebar() {
  // 状态一：一个草稿输入框的内容
  const [draft, setDraft] = useState("");
  // 状态二：一个计数器
  const [count, setCount] = useState(0);

  // 当前路径，用来高亮正在浏览的那一项（属第七章内容，此处仅作装饰）
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        padding: 18,
        borderRight: "1px solid #e5e5e5",
        background: "#fbfbfb",
      }}
    >
      <h3 style={{ fontSize: "0.85rem", color: "#888", marginTop: 0 }}>
        侧边栏（布局的一部分）
      </h3>

      <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              fontSize: "0.92rem",
              // 当前路由高亮
              background: pathname === item.href ? "#eaf3ff" : "transparent",
              color: pathname === item.href ? "#0070f3" : "#333",
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <hr style={{ margin: "18px 0", border: 0, borderTop: "1px solid #e5e5e5" }} />

      <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: 6 }}>
        试着在这里输入，然后切换上面的链接：
      </p>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="随便打点字…"
        style={{
          width: "100%",
          padding: "7px 10px",
          border: "1px solid #ddd",
          borderRadius: 6,
          fontSize: "0.88rem",
          marginBottom: 10,
        }}
      />

      <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: 6 }}>
        计数器也不会归零：
      </p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{
          width: "100%",
          padding: "7px 10px",
          border: "1px solid #ddd",
          borderRadius: 6,
          background: "#fff",
          cursor: "pointer",
          fontSize: "0.88rem",
        }}
      >
        点了 {count} 次
      </button>
    </aside>
  );
}
