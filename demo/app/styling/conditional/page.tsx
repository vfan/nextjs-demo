// ============================================================
// 条件类名 —— 路由 /styling/conditional
// ============================================================
// 文件位置：app/styling/conditional/page.tsx

import type { Metadata } from "next";
import StatusDemo from "./status-demo";

export const metadata: Metadata = {
  title: "条件类名",
  description: "根据状态拼出不同的 className，三种常见写法。",
};

const codeStyle: React.CSSProperties = {
  background: "#1e1e1e",
  color: "#d4d4d4",
  padding: "16px 20px",
  borderRadius: 8,
  overflowX: "auto",
  fontSize: "0.82rem",
  lineHeight: 1.7,
};

export default function ConditionalPage() {
  return (
    <>
      <h1>条件类名</h1>
      <p className="lead">
        「加载中显示橙色、成功显示绿色」——类名要根据状态拼出来。
        这里介绍几种写法。
      </p>

      <StatusDemo />

      <h2 style={{ fontSize: "1.15rem" }}>三种写法</h2>

      <p>
        <strong>① 模板字符串</strong>——最直接，但类名一多就难读：
      </p>
      <pre style={codeStyle}>{`const className = \`\${styles.badge} \${styles[status]}\``}</pre>

      <p style={{ marginTop: 18 }}>
        <strong>② 数组 + filter + join</strong>——能优雅处理「可选类名」：
      </p>
      <pre style={codeStyle}>{`const className = [
  styles.badge,
  styles[status],
  isActive && styles.active,   // 条件为假时是 false
]
  .filter(Boolean)             // 把 false 剔掉
  .join(" ")`}</pre>

      <p style={{ marginTop: 18 }}>
        <strong>③ 用 clsx 之类的库</strong>——写法最紧凑，代价是多一个依赖：
      </p>
      <pre style={codeStyle}>{`import clsx from "clsx"

const className = clsx(styles.badge, styles[status], {
  [styles.active]: isActive,
})`}</pre>

      <div className="note warn">
        <strong>为什么不直接用字符串拼接？</strong>
        <code>{'`badge ${isActive && "active"}`'}</code>{" "}
        在条件为假时会拼出字面量 <code>&quot;false&quot;</code>，
        变成 <code>class=&quot;badge false&quot;</code>。
        虽然多数情况下没影响，但很脏，也容易掩盖 bug。
      </div>

      <div className="note">
        <strong>关于 CSS-in-JS：</strong>styled-components、Emotion 这类库
        在 App Router 里需要额外配置（主要是服务端渲染时的样式注入问题），
        而且会增加客户端负担。除非团队已有积累，否则优先考虑
        CSS Modules 或 Tailwind。
      </div>
    </>
  );
}
