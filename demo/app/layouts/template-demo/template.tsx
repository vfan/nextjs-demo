// ============================================================
// 模板（Template）—— 每次导航都会重新挂载
// ============================================================
// 文件位置：app/layouts/template-demo/template.tsx
//
// template.tsx 的写法和 layout.tsx 几乎一样，都接收 children 并包裹它。
// 唯一的、也是决定性的差别：
//
//   layout.tsx   → 切换路由时保持挂载，内部状态保留
//   template.tsx → 切换路由时销毁并重建，内部状态重置
//
// 为了让你亲眼看到「重建」，这个模板里放了一个计数器：
//   点几下 → 计数器上升 → 切到「第二页」再切回来 → 计数器归零。
// 如果你在 layout 里做同样的事，计数不会归零。
//
// 典型用途：页面入场动画、每次访问都要重新触发的统计埋点。

"use client";

import { useEffect, useState, type ReactNode } from "react";

export default function TemplateDemo({ children }: { children: ReactNode }) {
  // 计数：用来证明组件被重建了（重建后回到 0）
  const [count, setCount] = useState(0);
  // 挂载时间：在浏览器里读取，避免服务端渲染与客户端不一致
  const [mountedAt, setMountedAt] = useState<string>("");

  useEffect(() => {
    // 每次挂载都会执行——路由切换后这个时间会更新
    setMountedAt(new Date().toLocaleTimeString());
    // 每次导航都重新触发的埋点可以写在这里
    console.log("[template] 挂载于", new Date().toLocaleTimeString());
  }, []);

  return (
    <div>
      {/* 模板自己的一小块 UI，用来展示它的状态 */}
      <div
        style={{
          border: "1px solid #d9c7ff",
          background: "#f7f2ff",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 20,
          fontSize: "0.9rem",
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ color: "#7a5af5", fontWeight: 600 }}>
          这部分来自 template.tsx
        </span>
        <span className="path">本次挂载时间：{mountedAt || "…"}</span>
        <button
          onClick={() => setCount((c) => c + 1)}
          style={{
            padding: "4px 12px",
            border: "1px solid #c9b6f5",
            borderRadius: 6,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          计数 {count}
        </button>
      </div>

      {/* 页面内容 */}
      {children}
    </div>
  );
}
