// ============================================================
// 一个最小的客户端组件
// ============================================================
// 文件位置：app/server-client/counter.tsx
//
// 这个文件顶部有 "use client"。它只做一件事：给这个文件以及它
// 导入的所有模块，划出一条边界——边界以内的代码会被打包进浏览器。
//
// 判断标准很简单：需要用到 useState / useEffect / onClick 这些
// 「浏览器里才有的能力」，就必须加 "use client"。
// 反过来，只要你没写这行，组件就默认是服务端组件。

"use client";

import { useState } from "react";

export default function Counter({ initial = 0 }: { initial?: number }) {
  // useState 只能在客户端组件里用。服务端组件里写这行会直接报错。
  const [count, setCount] = useState(initial);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        border: "1px solid #d9c7ff",
        background: "#f7f2ff",
        borderRadius: 8,
      }}
    >
      <span style={{ fontSize: "0.85rem", color: "#7a5af5" }}>
        客户端组件（counter.tsx）
      </span>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: "4px 14px",
          border: "1px solid #c9b6f5",
          borderRadius: 6,
          background: "#fff",
          cursor: "pointer",
        }}
      >
        点了 {count} 次
      </button>
    </div>
  );
}
