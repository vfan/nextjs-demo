// ============================================================
// 价格页 —— 路由 /layouts/pricing
// ============================================================
// 源文件：app/layouts/(marketing)/pricing/page.tsx
//
// 两件事同时发生：
//   1. 外面的虚线框导航来自 app/layouts/layout.tsx（祖先布局）
//   2. 这个白底居中卡片来自 app/layouts/(marketing)/layout.tsx（分组布局）
//
// 而 URL 里只有 /layouts/pricing，看不出 (marketing) 的存在。

import Link from "next/link";

export default function MarketingPricingPage() {
  return (
    <>
      <h1 style={{ textAlign: "center" }}>价格方案</h1>
      <p className="lead" style={{ textAlign: "center" }}>
        <code>/layouts/pricing</code>
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>专业版</h3>
        <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>¥99/月</p>
        <p className="path">含高级分析、API 接入、优先支持</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>企业版</h3>
        <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          联系我们
        </p>
        <p className="path">无限席位、SLA、专属客服</p>
      </div>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        <Link href="/layouts/features">看看同组的「功能特性」页 →</Link>
      </p>
    </>
  );
}
