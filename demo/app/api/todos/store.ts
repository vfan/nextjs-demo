// ============================================================
// 内存里的假数据库
// ============================================================
// 文件位置：app/api/todos/store.ts
//
// 真实项目里这里是数据库。为了不引入额外依赖，demo 用一个数组代替。
//
// 注意：数据存在服务器进程的内存里，所以
//   · 重启服务器 → 数据回到初始值
//   · 开发模式热更新 → 也可能被重置
// 这是 demo 的局限，不是 Next.js 的问题。

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

// 用 let 是因为下面要整体替换数组
let todos: Todo[] = [
  { id: "1", title: "读完第一章：渲染策略", done: true },
  { id: "2", title: "读完第九章：API 路由", done: false },
  { id: "3", title: "自己动手写一个接口", done: false },
];

export function listTodos(): Todo[] {
  return todos;
}

export function getTodo(id: string): Todo | undefined {
  return todos.find((t) => t.id === id);
}

export function createTodo(title: string): Todo {
  const todo: Todo = {
    id: String(Date.now()),
    title,
    done: false,
  };
  todos = [...todos, todo];
  return todo;
}

export function updateTodo(
  id: string,
  patch: Partial<Pick<Todo, "title" | "done">>,
): Todo | undefined {
  const existing = getTodo(id);
  if (!existing) return undefined;

  const updated: Todo = { ...existing, ...patch };
  todos = todos.map((t) => (t.id === id ? updated : t));
  return updated;
}

export function deleteTodo(id: string): boolean {
  const before = todos.length;
  todos = todos.filter((t) => t.id !== id);
  return todos.length < before;
}
