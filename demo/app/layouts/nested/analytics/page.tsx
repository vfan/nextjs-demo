// ============================================================
// 数据分析页 —— 路由 /layouts/nested/analytics
// ============================================================
// 文件位置：app/layouts/nested/analytics/page.tsx
//
// 和概览页一样，本页也被 app/layouts/nested/layout.tsx 包裹。
// 从概览页切到本页时，侧边栏（以及你输入的文字）不会重置。
//
// 这里的数据是写死的假数据——第一章、第二章还没讲到数据获取，
// 等学到第四章会换成在服务端组件里直接 async 取数。

const stats = [
  { label: "今日访问", value: "1,284" },
  { label: "新增用户", value: "37" },
  { label: "转化率", value: "4.2%" },
];

export default function AnalyticsPage() {
  return (
    <>
      <h1>数据分析</h1>
      <p className="lead">
        当前路由：<code>/layouts/nested/analytics</code>
      </p>

      <div className="grid">
        {stats.map((s) => (
          <div key={s.label} className="card">
            <p className="path">{s.label}</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: 0 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 20 }}>
        留意一下：刚才在侧边栏输入的文字依然在。返回概览页确认一下 →
      </p>
    </>
  );
}
