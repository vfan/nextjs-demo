// ============================================================
// 价格页 —— 路由 /routing-basics/pricing
// ============================================================
// 源文件：app/routing-basics/(marketing)/pricing/page.tsx
//
// 注意关键差别：文件夹 (marketing) 带圆括号，
// 它被 Next.js 当作「路由组」，不会出现在 URL 中。
//
//   源文件里的路径：  .../routing-basics/(marketing)/pricing/
//   浏览器里的 URL：  /routing-basics/pricing          ← marketing 消失了
//
// 路由组的价值在于：你可以把一批页面归到同一个抽屉里，
// 给它们配一套共用的布局（见第二章），而 URL 依然干净。

const plans = [
  { name: "免费版", price: "¥0", note: "适合个人项目，含基础功能" },
  { name: "专业版", price: "¥99/月", note: "适合小团队，含高级分析" },
  { name: "企业版", price: "联系我们", note: "无限席位，SLA 保障" },
];

export default function PricingPage() {
  return (
    <>
      <h1>价格方案</h1>
      <p className="lead">
        你访问的是 <code>/routing-basics/pricing</code>——地址栏里没有{" "}
        <code>marketing</code> 这个词。
      </p>

      <div className="grid">
        {plans.map((plan) => (
          <div key={plan.name} className="card">
            <h3 style={{ marginTop: 0 }}>{plan.name}</h3>
            <p style={{ fontSize: "1.3rem", fontWeight: 600 }}>{plan.price}</p>
            <p className="path">{plan.note}</p>
          </div>
        ))}
      </div>

      <div className="note warn">
        <strong>为什么会这样？</strong>
        圆括号是 Next.js 的语法约定，表示「这个文件夹只是用来分类，
        别放进 URL」。如果去掉括号，变成普通的{" "}
        <code>marketing/</code> 文件夹，
        那么 URL 就会真的变成 <code>/routing-basics/marketing/pricing</code>。
      </div>
    </>
  );
}
