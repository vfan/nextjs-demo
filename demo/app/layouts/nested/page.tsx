// ============================================================
// 概览页 —— 路由 /layouts/nested
// ============================================================
// 文件位置：app/layouts/nested/page.tsx
//
// 本页是「嵌套布局 + 状态保持」示例的起点。
// 注意看左边的侧边栏——它不属于本页，而属于 app/layouts/nested/layout.tsx。

export default function NestedOverviewPage() {
  return (
    <>
      <h1>概览</h1>
      <p className="lead">
        当前路由：<code>/layouts/nested</code>
      </p>

      <div className="note warn">
        <strong>动手验证「布局不会被销毁」：</strong>
        <ol style={{ margin: "8px 0 0 20px" }}>
          <li>在左边侧边栏的输入框里打几个字，再点几下计数器；</li>
          <li>点击侧边栏里的「数据分析」或「账户设置」，切换过去；</li>
          <li>再切回本页——输入的字和计数都还在。</li>
        </ol>
        <p style={{ marginTop: 8 }}>
          如果布局被销毁重建，这些状态就会归零。它们没有归零，
          说明 <code>app/layouts/nested/layout.tsx</code> 始终挂在页面上。
        </p>
      </div>

      <h2>为什么会这样？</h2>
      <p>
        这三个页面（概览、数据分析、账户设置）共用同一个父级布局。
        路由切换时，Next.js 只替换布局里 <code>{"{children}"}</code>{" "}
        的那部分内容，布局组件本身原封不动。
      </p>
      <p className="path">
        对照文件：app/layouts/nested/layout.tsx
      </p>
    </>
  );
}
