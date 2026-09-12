// ============================================================
// 加载状态 —— app/loading-and-error/slow/loading.tsx
// ============================================================
// 文件位置：app/loading-and-error/slow/loading.tsx
//
// 这个文件名是约定好的。一旦存在，Next.js 会自动把它作为
// 同目录 page.tsx 的「加载中」界面——本质是给你套了一层
// <Suspense fallback={...}>。
//
// 所以这里通常放骨架屏（skeleton）：结构和真实内容差不多，
// 但内容是灰色的占位块。比一个转圈图标体验好得多，
// 因为用户能预判内容大概长什么样、出现在哪里。

export default function Loading() {
  return (
    <>
      <h1>慢页面</h1>
      <p className="lead" style={{ color: "#aaa" }}>
        正在服务器上取数据……
      </p>

      {/* 三块灰色占位，模拟数据卡片 */}
      <div className="grid">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="card"
            style={{ background: "#f4f4f5", borderColor: "#ececec" }}
          >
            <div
              style={{
                height: 14,
                width: "55%",
                background: "#e2e2e4",
                borderRadius: 4,
                marginBottom: 12,
              }}
            />
            <div
              style={{
                height: 12,
                width: "85%",
                background: "#e9e9eb",
                borderRadius: 4,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 12,
                width: "65%",
                background: "#e9e9eb",
                borderRadius: 4,
              }}
            />
          </div>
        ))}
      </div>

      <p className="path">↑ 这些灰色方块来自 loading.tsx</p>
    </>
  );
}
