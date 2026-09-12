// ============================================================
// CSR · 客户端渲染 —— 路由 /rendering-strategies/csr
// ============================================================
// 文件位置：app/rendering-strategies/csr/page.tsx
//
// 时间戳由浏览器里的 JavaScript 生成，服务器发下来的 HTML 里没有它。
//
// 怎么验证：
//   1. 打开页面，快速刷新几次——会看到一瞬间的「加载中…」
//   2. 右键「查看网页源代码」（或 Ctrl+U），搜一下时间——
//      你会发现 HTML 里根本没有时间，只有一句「加载中…」
//   3. 打开浏览器开发者工具的 Network 面板重新加载，
//      能看到 JS 下载、执行之后内容才出现
//
// 这就是 CSR 的代价：内容要等 JS，搜索引擎抓到的也是空壳。

"use client"; // 需要 useState / useEffect，必须声明为客户端组件（下一章详解）

import { useEffect, useState } from "react";
import ModeCard from "../mode-card";

export default function CsrPage() {
  // 初始为 null，表示「浏览器还没有算出来」
  const [renderedAt, setRenderedAt] = useState<string | null>(null);

  useEffect(() => {
    // 真实项目里，这里通常是 fetch("/api/...") 或 useSWR 之类的数据请求。
    // 这里用 600ms 延时模拟一次网络往返，好让「加载中」这个中间状态看得见。
    const timer = setTimeout(() => {
      setRenderedAt(new Date().toLocaleString("zh-CN"));
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <h1>CSR · 客户端渲染</h1>
      <p className="lead">
        服务器只发一个空壳 HTML，内容由浏览器里的 JS 填进去。
      </p>

      <ModeCard
        mode="CSR"
        tagline="HTML 由浏览器生成，服务器发下来的那份里没有内容。"
        stampLabel="本次内容的生成时间（由浏览器填写）"
        renderedAt={renderedAt ?? "加载中…（浏览器还没执行 JS）"}
        pending={renderedAt === null}
      >
        <strong>动手验证：</strong>
        按 <code>Ctrl+U</code> 查看网页源代码，搜索下面的时间——你会发现
        HTML 里搜不到，只有「加载中…」。因为那个时间要到浏览器把 JS 跑起来之后才存在。
        这也是为什么 CSR 对 SEO 不友好：搜索引擎拿到的就是一份空壳。
      </ModeCard>

      <div className="note">
        <strong>什么时候用它：</strong>后台管理系统、需要大量本地交互的应用。
        这类页面不需要被搜索引擎收录，用户也不介意多等一小会儿。
      </div>
    </>
  );
}
