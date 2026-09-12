// ============================================================
// 模板对比 · 第一页 —— 路由 /layouts/template-demo
// ============================================================
// 文件位置：app/layouts/template-demo/page.tsx
//
// 本页和它的兄弟页 second/page.tsx 共用上层的 template.tsx。
// 在两者之间切换时，你会看到紫色框里的「挂载时间」和「计数」都重置了。

import Link from "next/link";

export default function TemplateDemoPage() {
  return (
    <>
      <h1>template 对比 · 第一页</h1>
      <p className="lead">
        当前路由：<code>/layouts/template-demo</code>
      </p>

      <div className="note warn">
        <strong>动手验证「template 会重新挂载」：</strong>
        <ol style={{ margin: "8px 0 0 20px" }}>
          <li>先点上方的「计数」按钮几次，让它变成 5 或更大；</li>
          <li>记下紫色框里的「本次挂载时间」；</li>
          <li>点下面的链接跳到「第二页」；</li>
          <li>再跳回来——你会发现计数归零，挂载时间也变了。</li>
        </ol>
        <p style={{ marginTop: 8 }}>
          对比第二章前面的嵌套布局示例：那边放在 layout 里的计数器是
          <strong>不会</strong>归零的。
        </p>
      </div>

      <p>
        <Link href="/layouts/template-demo/second">跳到第二页 →</Link>
      </p>
    </>
  );
}
