// ============================================================
// 静态元数据 —— 路由 /metadata
// ============================================================
// 文件位置：app/metadata/page.tsx
//
// 在这个文件里导出一个叫 metadata 的常量，Next.js 就会把这些内容
// 变成 HTML 的 <title> 和 <meta> 标签。
//
// 注意：metadata 只能从**服务端组件**里导出。
// 如果你在 "use client" 文件里写 export const metadata，会报错。
// 客户端组件要用元数据，只能由它的父级服务端组件来设置。

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  // 根布局里配了模板 "%s · Next.js 教程 Demo"，
  // 所以这里写 "SEO 与元数据"，最终会渲染成 "SEO 与元数据 · Next.js 教程 Demo"
  title: "SEO 与元数据",
  description:
    "演示 Next.js 的元数据配置：静态 metadata、generateMetadata、Open Graph 分享卡片。",
  keywords: ["Next.js", "SEO", "metadata", "generateMetadata"],
  openGraph: {
    title: "SEO 与元数据",
    description: "元数据不显示在页面上，但它决定了别人怎么看到你的页面。",
    type: "website",
  },
};

export default function MetadataPage() {
  return (
    <>
      <h1>第十一章 · SEO 与元数据</h1>
      <p className="lead">
        页面上看不到这些东西，但浏览器标签、搜索结果、分享卡片全靠它们。
      </p>

      <div className="note warn">
        <strong>先验证一下本页：</strong>
        按 <code>Ctrl+U</code> 查看网页源代码，在 <code>&lt;head&gt;</code>{" "}
        里找 <code>&lt;title&gt;</code> 和 <code>&lt;meta name=&quot;description&quot;&gt;</code>。
        它们就是下面那个 <code>metadata</code> 对象生成的。
      </div>

      <h2>常用字段</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>字段</th>
            <th>出现在哪</th>
            <th>注意</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="path">title</td>
            <td>浏览器标签页、搜索结果标题</td>
            <td>建议 50～60 字以内</td>
          </tr>
          <tr>
            <td className="path">description</td>
            <td>搜索结果里的摘要</td>
            <td>建议 150～160 字，直接影响点击率</td>
          </tr>
          <tr>
            <td className="path">openGraph</td>
            <td>分享到社交平台时的卡片</td>
            <td>微信、Twitter、Slack 都读它</td>
          </tr>
          <tr>
            <td className="path">keywords</td>
            <td>—</td>
            <td>主流搜索引擎早已忽略，写着无妨</td>
          </tr>
          <tr>
            <td className="path">robots</td>
            <td>是否允许收录</td>
            <td>后台页面建议设成 noindex</td>
          </tr>
          <tr>
            <td className="path">metadataBase</td>
            <td>其他字段里的相对路径基准</td>
            <td>通常在根布局设置一次</td>
          </tr>
        </tbody>
      </table>

      <h2>title 模板：全站统一后缀</h2>
      <p>
        本 demo 的根布局里配置了标题模板，所以每个页面只需要写自己的部分：
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
      >{`// app/layout.tsx
export const metadata = {
  title: {
    default: "Next.js 教程 Demo",
    template: "%s · Next.js 教程 Demo",   // %s 会被子页面的 title 替换
  },
}`}</pre>

      <p>
        于是本页的 <code>title: &quot;SEO 与元数据&quot;</code> 最终渲染成{" "}
        <strong>「SEO 与元数据 · Next.js 教程 Demo」</strong>。
        全站改一次后缀，所有页面都跟着变。
      </p>

      <h2>元数据可以分层覆盖</h2>
      <p>
        和 <code>layout.tsx</code>/<code>loading.tsx</code> 一样，
        <code>metadata</code> 也是就近生效：
      </p>
      <ul>
        <li>根布局定义全站默认值；</li>
        <li>子布局可以覆盖一部分；</li>
        <li>页面自己的 <code>metadata</code> 优先级最高。</li>
      </ul>
      <p>
        但要注意：<strong>它会整体替换，而不是深合并</strong>。
        如果子页面重新定义了 <code>openGraph</code>，父级 <code>openGraph</code>{" "}
        里没重写的字段就不会继承。这是个容易踩的坑。
      </p>

      <h2>去动态元数据那边看看</h2>
      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>动态元数据</h3>
          <p className="path">app/metadata/dynamic/[slug]/page.tsx</p>
          <p>
            一万篇文章共用一个页面组件，标题当然也不能写死。
            那里用的是 <code>generateMetadata</code>。
          </p>
          <Link href="/metadata/dynamic">去看看 →</Link>
        </div>
      </div>
    </>
  );
}
