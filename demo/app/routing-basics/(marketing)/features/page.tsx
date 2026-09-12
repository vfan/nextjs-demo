// ============================================================
// 功能页 —— 路由 /routing-basics/features
// ============================================================
// 源文件：app/routing-basics/(marketing)/features/page.tsx
//
// 和 pricing 一样，它也在 (marketing) 路由组里。
// 这两个页面虽然住在同一个文件夹下，URL 里却完全看不出这层关系：
//   /routing-basics/pricing
//   /routing-basics/features
//
// 到了第二章，我们会给 (marketing) 配一个专属的 layout.tsx，
// 让组内所有页面自动获得统一的外观。

import Link from "next/link";

const features = [
  { title: "文件系统路由", desc: "新建文件夹即新增路由，无需注册" },
  { title: "嵌套布局", desc: "布局逐层包裹，切换路由不销毁" },
  { title: "服务端组件", desc: "默认在服务器渲染，更快更小" },
];

export default function FeaturesPage() {
  return (
    <>
      <h1>功能特性</h1>
      <p className="lead">
        当前 URL：<code>/routing-basics/features</code>
      </p>

      <ul style={{ listStyle: "none", marginLeft: 0 }}>
        {features.map((f) => (
          <li key={f.title} className="card">
            <h3 style={{ marginTop: 0 }}>{f.title}</h3>
            <p>{f.desc}</p>
          </li>
        ))}
      </ul>

      <Link href="/routing-basics/pricing">
        ← 同组的另一个页面：价格方案
      </Link>
    </>
  );
}
