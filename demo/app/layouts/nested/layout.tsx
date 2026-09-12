// ============================================================
// 嵌套布局示例 —— 作用于 /layouts/nested 及其子路由
// ============================================================
// 文件位置：app/layouts/nested/layout.tsx
//
// 这就是「后台管理系统」里最常见的布局形态：
// 左边一条侧边栏，右边一块内容区。
//
// 关键点在于：这个文件的组件在 /layouts/nested、/layouts/nested/analytics、
// /layouts/nested/settings 之间切换时始终存活。
// 因此放在这里的侧边栏（含它的输入框、计数器状态）不会重置。
//
// 本组件是服务端组件，但它可以直接渲染客户端组件 <NestedSidebar />。
// 这种「服务端组件里嵌客户端组件」的写法非常常见。

import NestedSidebar from "./sidebar";

export default function NestedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", border: "1px solid #e5e5e5", borderRadius: 10, overflow: "hidden", minHeight: 320 }}>
      {/* 侧边栏：属于布局，切换子页面时保持挂载 */}
      <NestedSidebar />

      {/* 内容区：只有这一块会随着路由变化而更新 */}
      <div style={{ flex: 1, padding: 22, background: "#fff" }}>{children}</div>
    </div>
  );
}
