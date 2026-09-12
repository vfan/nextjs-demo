// ============================================================
// 路由组专属布局 —— (marketing) 组
// ============================================================
// 文件位置：app/layouts/(marketing)/layout.tsx
//
// 这个文件和服务于 /layouts/pricing、/layouts/features 两个页面。
// 它演示了路由组最实用的一个能力：
//
//   「把一批页面归为一组，给它们配一套独立布局，
//     而 URL 里完全看不出这层分组。」
//
// 对比一下：
//   app/layouts/layout.tsx            → 所有 /layouts/* 都继承（虚线框导航）
//   app/layouts/(marketing)/layout.tsx → 只有组内页面继承（下面这个居中容器）
//
// 两个布局会叠加生效，形成「章节布局 → 分组布局 → 页面」的包裹顺序。

export default function MarketingGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "28px 24px",
        background: "#fff",
        border: "1px solid #e5e5e5",
        borderRadius: 12,
      }}
    >
      {/* 营销风页面常见的居中单栏排版 */}
      {children}
    </div>
  );
}
