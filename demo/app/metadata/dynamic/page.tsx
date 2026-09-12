// ============================================================
// 动态元数据列表 —— 路由 /metadata/dynamic
// ============================================================
// 文件位置：app/metadata/dynamic/page.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "../data";

export const metadata: Metadata = {
  title: "动态元数据",
  description: "用 generateMetadata 为每一篇文章生成各自的标题和描述。",
};

export default function DynamicMetadataPage() {
  return (
    <>
      <h1>动态元数据</h1>
      <p className="lead">
        列表页的标题是写死的，但每篇文章的标题不能写死。
      </p>

      <p>
        点进任意一篇文章，然后 <code>Ctrl+U</code> 看源代码里的{" "}
        <code>&lt;title&gt;</code>——每一篇都不一样，
        而且描述也是各自的内容摘要。这是 <code>generateMetadata</code> 做的。
      </p>

      <ul style={{ listStyle: "none", marginLeft: 0 }}>
        {articles.map((article) => (
          <li key={article.slug} className="card">
            <h3 style={{ marginTop: 0 }}>
              <Link href={`/metadata/dynamic/${article.slug}`}>
                {article.title}
              </Link>
            </h3>
            <p className="path">{article.publishedAt}</p>
            <p style={{ marginBottom: 0 }}>{article.summary}</p>
          </li>
        ))}
      </ul>

      <div className="note">
        <strong>为什么列表页用静态 metadata、详情页用 generateMetadata？</strong>
        <br />
        列表页只有一个，标题固定，写死最简单；
        详情页有成百上千个 URL，每个的标题都得从数据里来。
        判断标准就是：<strong>这个页面的标题会随 URL 变化吗？</strong>
      </div>
    </>
  );
}
