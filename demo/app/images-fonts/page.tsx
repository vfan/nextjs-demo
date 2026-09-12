// ============================================================
// 总览 —— 路由 /images-fonts
// ============================================================
// 文件位置：app/images-fonts/page.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "图片与字体优化",
  description: "next/image 和 next/font 解决的性能问题。",
};

export default function ImagesFontsPage() {
  return (
    <>
      <h1>第十三章 · 图片与字体优化</h1>
      <p className="lead">
        图片和字体通常占一个页面体积的大部分，它们也最容易拖慢首屏。
        Next.js 各提供了一个封装好的工具。
      </p>

      <h2>各自解决的问题</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>工具</th>
            <th>解决的问题</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="path">next/image</td>
            <td>
              布局跳动、大图硬塞给手机、格式老旧、视口外的图白加载
            </td>
          </tr>
          <tr>
            <td className="path">next/font</td>
            <td>
              额外的域名握手、字体加载期间文字闪烁或不可见
            </td>
          </tr>
        </tbody>
      </table>

      <div className="note warn">
        <strong>这两个工具都不是「用不用都行」的装饰。</strong>
        它们直接影响两个真实的用户体验指标：<strong>LCP</strong>
        （主要内容多大程度上算加载完成）和 <strong>CLS</strong>
        （页面内容有没有突然跳动）。这两个数字会被搜索引擎计入排名。
      </div>

      <h2>两个示例页面</h2>
      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>next/image</h3>
          <p className="path">app/images-fonts/image/page.tsx</p>
          <p>
            四种用法：静态导入、路径引用、fill 铺满、priority 首屏优先。
          </p>
          <Link href="/images-fonts/image">去看看 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>next/font</h3>
          <p className="path">app/images-fonts/font/page.tsx</p>
          <p>
            构建时把字体收进产物，没有外部请求，也不会闪烁。
          </p>
          <Link href="/images-fonts/font">去看看 →</Link>
        </div>
      </div>

      <div className="note">
        <strong>本 demo 的一个选择：</strong>字体用的是{" "}
        <code>next/font/local</code> 配一个本地字体文件，而不是{" "}
        <code>next/font/google</code>。原因是 Google Fonts
        在国内的构建环境里往往访问不到，会让 <code>npm run build</code> 卡住。
        用本地字体则完全离线可用。
      </div>
    </>
  );
}
