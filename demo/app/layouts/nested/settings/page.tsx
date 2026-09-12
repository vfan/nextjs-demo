// ============================================================
// 账户设置页 —— 路由 /layouts/nested/settings
// ============================================================
// 文件位置：app/layouts/nested/settings/page.tsx
//
// 这是嵌套布局示例里的第三个页面。
// 三个页面共用同一个 layout，所以它们之间的任何切换都不会
// 打扰侧边栏的状态。

export default function SettingsPage() {
  return (
    <>
      <h1>账户设置</h1>
      <p className="lead">
        当前路由：<code>/layouts/nested/settings</code>
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>一个只有三个页面的小后台</h3>
        <p>
          概览、数据分析、账户设置——这三个页面在 URL 上是平级的，
          在文件系统里也是平级的（都是 <code>nested/</code> 的直接子文件夹）。
        </p>
        <p className="path">
          app/layouts/nested/analytics/page.tsx
          <br />
          app/layouts/nested/settings/page.tsx
          <br />
          app/layouts/nested/page.tsx
        </p>
      </div>

      <p>
        它们唯一的共同点，是都被 <code>nested/layout.tsx</code> 包住。
        这就是「用布局共享外壳」的典型场景。
      </p>
    </>
  );
}
