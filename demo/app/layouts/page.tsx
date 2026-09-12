// ============================================================
// 第二章首页 —— 路由 /layouts
// ============================================================
// 文件位置：app/layouts/page.tsx
//
// 这一页演示了「嵌套布局」的默认形态：
// 你现在看到的顶部虚线框来自 app/layouts/layout.tsx，
// 而虚线框下面的内容来自本文件。
//
// 完整的三层包裹关系：
//   app/layout.tsx           （根布局：站点导航 + 页脚）
//     └ app/layouts/layout.tsx （章节布局：本章导航）
//         └ app/layouts/page.tsx （本页内容）

import Link from "next/link";

export default function LayoutsChapterPage() {
  return (
    <>
      <h1>第二章 · 布局系统</h1>
      <p className="lead">
        布局（layout）是一个「包裹组件」：它把子页面套在自己的
        <code>children</code> 位置上。最关键的特性是——
        <strong>切换路由时布局不会销毁</strong>，
        所以它内部的状态、滚动位置、正在播放的音视频都会保留下来。
      </p>

      <h2>页面是怎么被一层层包起来的</h2>
      <p>访问本页（<code>/layouts</code>）时，实际渲染的嵌套结构是：</p>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "16px 20px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.85rem",
          lineHeight: 1.7,
        }}
      >{`app/layout.tsx              ← 最外层：<html> / <body> / 站点导航
└── app/layouts/layout.tsx  ← 中间层：本章导航（虚线框）
    └── app/layouts/page.tsx ← 最内层：本页内容`}</pre>

      <h2>三个示例</h2>
      <div className="grid">
        <div className="card">
          <h3>嵌套布局 + 状态保持</h3>
          <p className="path">app/layouts/nested/layout.tsx</p>
          <p>
            侧边栏里有个输入框。随便打几个字，再切换子页面——
            文字不会丢，因为布局压根没被销毁。
          </p>
          <Link href="/layouts/nested">去试试 →</Link>
        </div>
        <div className="card">
          <h3>路由组 + 独立布局</h3>
          <p className="path">app/layouts/(marketing)/layout.tsx</p>
          <p>
            给 <code>(marketing)</code> 路由组配一套居中单栏的布局，
            组内页面自动继承，而 URL 里看不到组名。
          </p>
          <Link href="/layouts/pricing">去看看 →</Link>
        </div>
        <div className="card">
          <h3>template 与 layout 的差别</h3>
          <p className="path">app/layouts/template-demo/template.tsx</p>
          <p>
            同样都是包裹组件，template 却每次导航都重新挂载。
            页面上会显示「本次挂载时间」，切一下就变了。
          </p>
          <Link href="/layouts/template-demo">去看挂载时间 →</Link>
        </div>
      </div>

      <div className="note">
        <strong>记住这条对比：</strong>
        <code>layout.tsx</code> = 保持挂载（状态保留）；
        <code>template.tsx</code> = 重新挂载（状态重置）。
        导航栏、侧边栏用前者，入场动画、页面埋点用后者。
      </div>
    </>
  );
}
