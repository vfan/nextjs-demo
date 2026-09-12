// ============================================================
// 一个会「故意」抛错的客户端组件
// ============================================================
// 文件位置：app/loading-and-error/error-demo/broken.tsx

"use client";

import { useState } from "react";

export default function Broken() {
  const [boom, setBoom] = useState(false);

  // 关键：错误在「渲染期间」抛出，而不是在事件回调里。
  // 点击按钮只是把 boom 改成 true，触发一次重新渲染；
  // 这次渲染过程中抛出的错误才会被 error.tsx 捕获。
  if (boom) {
    throw new Error("这是故意抛出的错误，用来演示 error.tsx");
  }

  return (
    <button
      onClick={() => setBoom(true)}
      style={{
        padding: "10px 20px",
        border: "1px solid #e5484d",
        background: "#fdecec",
        color: "#b42318",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: "0.95rem",
      }}
    >
      点我抛出一个错误
    </button>
  );
}
