// ============================================================
// 条件类名演示（客户端组件）
// ============================================================
// 文件位置：app/styling/conditional/status-demo.tsx
//
// 三种拼类名的写法，从最朴素到最耐看。

"use client";

import { useState } from "react";
import styles from "./badge.module.css";

type Status = "idle" | "loading" | "done";

const STATUS_TEXT: Record<Status, string> = {
  idle: "待处理",
  loading: "处理中",
  done: "已完成",
};

export default function StatusDemo() {
  const [status, setStatus] = useState<Status>("idle");

  // 写法一：模板字符串（简单直接，类名一多就难读）
  const classA = `${styles.badge} ${styles[status]}`;

  // 写法二：数组 + filter + join（能优雅地处理「可选类名」）
  const classB = [styles.badge, styles[status], status === "done" && styles.active]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {(Object.keys(STATUS_TEXT) as Status[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: "7px 16px",
              border: "1px solid #d0d0d0",
              borderRadius: 6,
              background: status === s ? "#0070f3" : "#fff",
              color: status === s ? "#fff" : "#333",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            切换到「{STATUS_TEXT[s]}」
          </button>
        ))}
      </div>

      <div className="card">
        <p style={{ marginBottom: 10 }}>当前状态：{STATUS_TEXT[status]}</p>
        <span className={classA}>{STATUS_TEXT[status]}</span>
      </div>

      <div className="card">
        <p style={{ marginBottom: 10 }}>
          加上「已完成时高亮」这个可选类名之后：
        </p>
        <span className={classB}>{STATUS_TEXT[status]}</span>
        <p className="path" style={{ marginTop: 12, marginBottom: 0 }}>
          切到「已完成」时会出现蓝色描边
        </p>
      </div>

      <div className="note">
        <strong>写法二的值在哪？</strong>
        当条件是 <code>false</code> 时，数组里会有一个{" "}
        <code>false</code>，<code>filter(Boolean)</code> 把它剔掉，
        否则类名里会出现字面量 &quot;false&quot;。这是不加库时最实用的写法。
      </div>
    </div>
  );
}
