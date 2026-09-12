// ============================================================
// 样式总览 —— 路由 /styling
// ============================================================
// 文件位置：app/styling/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "样式方案",
  description: "Next.js 支持的所有样式写法：全局 CSS、CSS Modules、Tailwind。",
};

export default function StylingPage() {
  return (
    <>
      <h1>第十二章 · 样式方案</h1>
      <p className="lead">
        Next.js 对样式没有强制主张，几种主流方案都能用。
        这一章讲清楚每种方案的定位和取舍。
      </p>

      <h2>四种方案</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>方案</th>
            <th>作用域</th>
            <th>适合</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="path">全局 CSS</td>
            <td>全站</td>
            <td>主题变量、基础排版、重置样式</td>
          </tr>
          <tr>
            <td className="path">CSS Modules</td>
            <td>单个文件</td>
            <td>组件样式，需要写真实 CSS 时</td>
          </tr>
          <tr>
            <td className="path">Tailwind CSS</td>
            <td>全站（原子类）</td>
            <td>快速迭代、统一设计规范</td>
          </tr>
          <tr>
            <td className="path">CSS-in-JS</td>
            <td>组件</td>
            <td>已有技术积累的团队；需额外配置</td>
          </tr>
        </tbody>
      </table>

      <div className="note warn">
        <strong>本 demo 用的是前两种。</strong>
        原因很简单：这个教程想让你看清
        「哪些是 Next.js 的规则，哪些是某个库的用法」。
        Tailwind 的类名会把这一点搅在一起，所以没有引入。
        但 Tailwind 完全可以用，配置方法本章最后一节有说明。
      </div>

      <h2>全局样式</h2>
      <p>
        全局 CSS 只能在一个地方引入：<strong>根布局</strong>。
        因为只有根布局能保证对所有页面生效。
      </p>
      <p className="path">
        本 demo 的全局样式：app/globals.css，由 app/layout.tsx 引入
      </p>
      <p>
        里面定义了主题色变量、基础排版，以及几个通用类——
        本章导航上的虚线框、<code>.card</code> 白卡片、
        <code>.note</code> 提示条，都来自那里。
      </p>

      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "16px 20px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.82rem",
          lineHeight: 1.7,
        }}
      >{`/* app/layout.tsx —— 全局样式只能在这里引入 */
import "./globals.css"

/* app/globals.css */
:root {
  --accent: #0070f3;      /* 定义主题变量 */
  --border: #e5e5e5;
}
.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
}`}</pre>

      <h2>去两个示例页面看看</h2>
      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>CSS Modules</h3>
          <p className="path">app/styling/css-modules/card.module.css</p>
          <p>
            局部作用域的 CSS。打开 Elements 面板能看到类名被加了哈希后缀。
          </p>
          <Link href="/styling/css-modules">去看看 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>条件类名</h3>
          <p className="path">app/styling/conditional/status-demo.tsx</p>
          <p>
            根据状态切换样式，三种写法对比，还有一个能点的演示。
          </p>
          <Link href="/styling/conditional">去看看 →</Link>
        </div>
      </div>

      <h2>关于 Tailwind</h2>
      <p>
        Tailwind 在 Next.js 里配置很简单，创建项目时选一下就行
        （<code>create-next-app</code> 会问你要不要用）。装了之后写起来是这样：
      </p>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "16px 20px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.82rem",
          lineHeight: 1.7,
        }}
      >{`<div className="rounded-lg border border-gray-200 bg-white p-5">
  <h3 className="text-lg font-semibold">卡片标题</h3>
</div>`}</pre>

      <p><strong>它的取舍很鲜明：</strong></p>
      <ul>
        <li>好处是样式和结构写在一起、不用想类名、设计约束统一；</li>
        <li>代价是 JSX 会变得很长，复杂组件里可读性下降。</li>
      </ul>

      <div className="note">
        <strong>不要混着用太多方案。</strong>
        一个项目里同时出现 Tailwind、CSS Modules、内联样式和 CSS-in-JS，
        是维护噩梦。选一到两种，定下来，然后一致地用下去。
      </div>
    </>
  );
}
