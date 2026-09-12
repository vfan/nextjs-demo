// ============================================================
// 动态元数据 —— /metadata/dynamic/[slug]
// ============================================================
// 文件位置：app/metadata/dynamic/[slug]/page.tsx
//
// generateMetadata 和页面组件是「兄弟」——都接收同样的参数，
// 但前者负责生成 <head> 里的内容，后者负责页面主体。
//
// 一个实际的好处：这个函数在服务端执行，所以你可以放心地去查数据库。
// 键是不要在客户端组件里做这件事——那会把查询逻辑暴露出去。

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "../../data";

// 构建时预生成（第六章讲过的 generateStaticParams）
export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

// 生成这个页面的元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // 和页面一样，params 是 Promise，要 await
  const { slug } = await params;
  const article = getArticle(slug);

  // 文章不存在时给一个兜底标题，同时告诉搜索引擎别收录
  if (!article) {
    return { title: "文章不存在", robots: { index: false } };
  }

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article>
      <h1>{article.title}</h1>
      <p className="path">{article.publishedAt}</p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>这一页的元数据</h3>
        <p className="path" style={{ marginBottom: 6 }}>
          &lt;title&gt;{article.title} · Next.js 教程 Demo&lt;/title&gt;
        </p>
        <p className="path" style={{ marginBottom: 0 }}>
          &lt;meta name=&quot;description&quot; content=&quot;{article.summary}&quot; /&gt;
        </p>
      </div>

      <p>{article.body}</p>

      <div className="note warn">
        <strong>动手对比一下：</strong>
        打开本页和另一篇文章，分别按 <code>Ctrl+U</code>，
        对比 <code>&lt;title&gt;</code> 和 <code>&lt;meta name=&quot;description&quot;&gt;</code>。
        <br />
        如果你把 URL 改成一个不存在的 slug，
        <code>generateMetadata</code> 会返回「文章不存在」并加上{" "}
        <code>robots: noindex</code>——告诉搜索引擎不要收录这个页面。
      </div>

      <p>
        <Link href="/metadata/dynamic">← 返回文章列表</Link>
      </p>
    </article>
  );
}
