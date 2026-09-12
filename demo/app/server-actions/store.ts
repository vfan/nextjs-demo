// ============================================================
// 内存里的假数据库（留言板）
// ============================================================
// 文件位置：app/server-actions/store.ts
//
// 和第九章的 todos 一样，这里用数组代替数据库。
// 重启服务器会回到初始状态。

export type Note = {
  id: string;
  text: string;
  createdAt: string;
};

let notes: Note[] = [
  { id: "1", text: "Server Actions 可以直接操作数据库", createdAt: "09:00" },
  { id: "2", text: "不用写 API 接口，不用手动发 fetch", createdAt: "09:05" },
];

export function listNotes(): Note[] {
  return notes;
}

export function addNote(text: string): Note {
  const note: Note = {
    id: String(Date.now()),
    text,
    createdAt: new Date().toLocaleTimeString("zh-CN"),
  };
  notes = [note, ...notes];
  return note;
}

export function deleteNote(id: string): boolean {
  const before = notes.length;
  notes = notes.filter((n) => n.id !== id);
  return notes.length < before;
}
