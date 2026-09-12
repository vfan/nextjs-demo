// ============================================================
// 调用接口的客户端组件
// ============================================================
// 文件位置：app/route-handlers/todo-client.tsx
//
// 这个组件用浏览器里的 fetch 去调我们刚写的那些接口。
// 之所以要把它做成客户端组件，是因为「接口到底返回了什么」
// 这件事必须在浏览器里发起请求才看得出来。
//
// 也顺便演示一下 400 / 404 这些状态码是怎么产生的：
// 试着提交一个空标题，或者删掉一条再删一次。

"use client";

import { useCallback, useEffect, useState } from "react";

type Todo = { id: string; title: string; done: boolean };

export default function TodoClient() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [log, setLog] = useState("还没有发起过请求");

  // 把「取列表」抽出来，因为增删改之后都要重新拉一次
  const load = useCallback(async () => {
    const res = await fetch("/api/todos");
    const data = (await res.json()) as { todos: Todo[] };
    setTodos(data.todos);
    setLog(`GET /api/todos → ${res.status}`);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setLog(`POST /api/todos → ${res.status}`);
    setTitle("");
    await load();
  }

  async function handleToggle(todo: Todo) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    setLog(`PUT /api/todos/${todo.id} → ${res.status}`);
    await load();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setLog(`DELETE /api/todos/${id} → ${res.status}`);
    await load();
  }

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px",
    border: "1px solid #d0d0d0",
    borderRadius: 6,
    fontSize: "0.92rem",
  };

  return (
    <div>
      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: 10, marginBottom: 16 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新的待办事项…"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          type="submit"
          style={{
            ...inputStyle,
            background: "#0070f3",
            color: "#fff",
            borderColor: "#0070f3",
            cursor: "pointer",
          }}
        >
          新建
        </button>
      </form>

      <p className="path" style={{ marginBottom: 12 }}>
        最近一次请求：{log}
      </p>

      <ul style={{ listStyle: "none", marginLeft: 0 }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
            }}
          >
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => handleToggle(todo)}
            />
            <span
              style={{
                flex: 1,
                textDecoration: todo.done ? "line-through" : "none",
                color: todo.done ? "#999" : "#111",
              }}
            >
              {todo.title}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              style={{
                padding: "4px 10px",
                border: "1px solid #e5484d",
                background: "#fff",
                color: "#b42318",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "0.82rem",
              }}
            >
              删除
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 ? (
        <p className="path">列表空了——所有待办都被删掉了。</p>
      ) : null}
    </div>
  );
}
