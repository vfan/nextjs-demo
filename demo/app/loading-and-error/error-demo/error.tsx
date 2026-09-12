// ============================================================
// 错误边界 —— app/loading-and-error/error-demo/error.tsx
// ============================================================
// 文件位置：app/loading-and-error/error-demo/error.tsx
//
// 这个文件有两个必须遵守的规则，少一个就不生效：
//
//   1. 必须写 "use client"
//      因为错误边界的底层实现依赖 React 的 state 和生命周期，
//      只能在客户端组件里工作。
//
//   2. 必须接收 error 和 reset 两个 props
//      error 是抛出的错误对象，reset 是一个「重试」函数。

"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5484d",
        background: "#fdecec",
        borderRadius: 10,
        padding: "22px 24px",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#b42318", fontSize: "1.15rem" }}>
        出错了
      </h2>
      <p style={{ color: "#7a271a" }}>
        这一块界面被替换成了 error.tsx 的内容，
        页面其余部分（比如上面的导航）仍然正常。
      </p>

      {/* 把错误信息显示出来，方便调试。生产环境一般不会这样直接给用户看 */}
      <p
        style={{
          fontFamily: "ui-monospace, Menlo, monospace",
          fontSize: "0.85rem",
          background: "#fff",
          padding: "10px 12px",
          borderRadius: 6,
          color: "#7a271a",
        }}
      >
        {error.message}
      </p>

      <button
        onClick={reset}
        style={{
          marginTop: 12,
          padding: "8px 18px",
          border: "1px solid #e5484d",
          background: "#fff",
          color: "#b42318",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        重试（调用 reset）
      </button>

      <p style={{ fontSize: "0.85rem", color: "#7a271a", marginTop: 12, marginBottom: 0 }}>
        点「重试」后组件会被重新渲染，因为 boom 回到了初始值，页面就恢复正常了。
      </p>
    </div>
  );
}
