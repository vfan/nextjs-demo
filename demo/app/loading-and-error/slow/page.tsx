// ============================================================
// 慢页面 —— 路由 /loading-and-error/slow
// ============================================================
// 文件位置：app/loading-and-error/slow/page.tsx
//
// 这个页面故意慢 2 秒，用来观察同目录下的 loading.tsx 什么时候出现。
//
// 为什么必须加 force-dynamic？
//   如果这个页面被静态化（构建时就生成好），那么运行时根本不需要等待，
//   loading.tsx 永远不会出现——因为它是在「服务器正在渲染」这段时间里
//   显示给用户的。没有等待，就没有加载状态。
//   这里强制动态渲染，保证每次访问都真的慢 2 秒。

export const dynamic = "force-dynamic";

export default async function SlowPage() {
  const startedAt = Date.now();

  // 模拟一次很慢的数据库查询或第三方接口调用
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const elapsed = Date.now() - startedAt;

  return (
    <>
      <h1>慢页面</h1>
      <p className="lead">
        这一页等了 {elapsed} ms 才渲染出来。
      </p>

      <div className="note warn">
        <strong>刚才发生了什么？</strong>
        你应该先看到了一屏灰色的骨架屏（来自同目录的{" "}
        <code>loading.tsx</code>），2 秒之后才被真正的内容替换掉。
        <br />
        如果没看到，试试把开发者工具的 Network 面板打开、
        勾上「Disable cache」再刷新——本地太快的时候骨架屏可能一闪而过。
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>它是怎么生效的？</h3>
        <p style={{ marginBottom: 0 }}>
          Next.js 发现这个文件夹里有 <code>loading.tsx</code>，
          就自动把页面包进一个 <code>&lt;Suspense&gt;</code> 里：
        </p>
        <pre
          style={{
            background: "#1e1e1e",
            color: "#d4d4d4",
            padding: "14px 18px",
            borderRadius: 8,
            overflowX: "auto",
            fontSize: "0.82rem",
            marginTop: 12,
            marginBottom: 0,
          }}
        >{`<Suspense fallback={<Loading />}>
  <SlowPage />        {/* 还在等数据的页面 */}
</Suspense>`}</pre>
      </div>

      <p className="path">
        对照文件：app/loading-and-error/slow/loading.tsx
      </p>
    </>
  );
}
