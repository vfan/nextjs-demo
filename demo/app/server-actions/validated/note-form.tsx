// ============================================================
// 带校验和提交状态的表单（客户端组件）
// ============================================================
// 文件位置：app/server-actions/validated/note-form.tsx
//
// 为什么这里必须是客户端组件？因为用到了 useActionState ——
// 它要保存「上一次提交的结果」和「是否正在提交」这两个状态。
//
// useActionState 来自 react（React 19 起）。它返回三样东西：
//   state       上一次 action 的返回值
//   formAction  绑到 <form action={...}> 上的东西
//   isPending   是否正在提交
//
// 有了 isPending，就终于能在服务端逻辑执行期间给用户反馈了——
// 这正是第五章说的「服务端组件没有加载状态」的补丁。

"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNoteAction, type FormState } from "../actions";

const initialState: FormState = {};

export default function NoteForm() {
  const [state, formAction, isPending] = useActionState(
    addNoteAction,
    initialState,
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // 提交成功后清空输入框。
  // useActionState 不会自动重置表单，所以要自己动手。
  useEffect(() => {
    if (state.ok && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [state.ok]);

  return (
    <form action={formAction}>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          ref={inputRef}
          name="text"
          placeholder="最多 40 个字…"
          // 提交期间禁用输入，避免用户重复提交
          disabled={isPending}
          style={{
            flex: 1,
            padding: "10px 14px",
            border: "1px solid #d0d0d0",
            borderRadius: 8,
            fontSize: "0.95rem",
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: "10px 22px",
            border: "1px solid #0070f3",
            background: isPending ? "#8ab8f0" : "#0070f3",
            color: "#fff",
            borderRadius: 8,
            cursor: isPending ? "wait" : "pointer",
            fontSize: "0.95rem",
          }}
        >
          {isPending ? "提交中…" : "发布"}
        </button>
      </div>

      {/* 错误提示 */}
      {state.error ? (
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            color: "#b42318",
            fontSize: "0.9rem",
          }}
        >
          {state.error}
        </p>
      ) : null}

      {/* 成功提示 */}
      {state.ok ? (
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            color: "#157347",
            fontSize: "0.9rem",
          }}
        >
          发布成功，去列表页看看。
        </p>
      ) : null}
    </form>
  );
}
