// ============================================================
// 功能页 —— 路由 /layouts/features
// ============================================================
// 源文件：app/layouts/(marketing)/features/page.tsx
//
// 和 pricing 页一样，它也套着 (marketing) 的分组布局。
// 你可以点上面的「路由组布局」链接在两个页面之间来回切换，
// 会发现那个白底居中卡片（分组布局）始终存在——
// 因为这两个页面共用同一个 layout.tsx。

import Link from "next/link";

export default function MarketingFeaturesPage() {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>功能特性</h1>
      <p className="lead" style={{ textAlign: "center" }}>
        <code>/layouts/features</code>
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>一套布局，多个页面</h3>
        <p>
          pricing 和 features 两个页面共享{" "}
          <code>app/layouts/(marketing)/layout.tsx</code>。
          要调整这一组页面的外观，只改那一个文件就够了。
        </p>
      </div>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        <Link href="/layouts/pricing">← 回到价格方案</Link>
      </p>
    </>
  );
}
