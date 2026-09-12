// ============================================================
// 模板对比 · 第二页 —— 路由 /layouts/template-demo/second
// ============================================================
// 文件位置：app/layouts/template-demo/second/page.tsx
//
// 它和 template-demo/page.tsx 是兄弟关系，都被
// app/layouts/template-demo/template.tsx 包裹。
// 正因为是 template 而非 layout，来回切换时包裹组件会重建。

import Link from "next/link";

export default function TemplateDemoSecondPage() {
  return (
    <>
      <h1>template 对比 · 第二页</h1>
      <p className="lead">
        当前路由：<code>/layouts/template-demo/second</code>
      </p>

      <p>
        如果你刚才在第一页把计数器点到了某个数字，现在它应该已经归零了——
        这正是 template 与 layout 最大的区别。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>什么时候该用 template？</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>每次进入页面都要播一遍的入场动画；</li>
          <li>每次访问都要上报一次的分析埋点；</li>
          <li>需要随路由变化而重置的表单或局部状态。</li>
        </ul>
      </div>

      <p>
        <Link href="/layouts/template-demo">← 返回第一页</Link>
      </p>
    </>
  );
}
