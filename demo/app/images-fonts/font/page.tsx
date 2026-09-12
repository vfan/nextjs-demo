// ============================================================
// next/font —— 路由 /images-fonts/font
// ============================================================
// 文件位置：app/images-fonts/font/page.tsx
//
// 字体是另一项影响首屏的东西。传统做法是在 CSS 里写 @font-face
// 指向一个字体文件，会有两个麻烦：
//
//   1. 字体文件在别处（CDN），浏览器要先连它——多一次握手
//   2. 字体没下载完之前，文字要么不可见、要么字体跳变（闪烁）
//
// next/font 在**构建时**就把字体文件下载好、放进你自己的产物里，
// 顺便算好字体度量、自动生成 @font-face，让浏览器提前预留空间。
//
// 本页用的是 next/font/local —— 指向项目里的字体文件。
// 好处是构建和运行都**不需要访问外网**，适合国内项目。
//
// 字体授权说明：这里用的 Geist 字体是 SIL Open Font License 1.1，
// 允许自由分发（Next.js 自身也内置了它）。

import type { Metadata } from "next";
import localFont from "next/font/local";

// 构建时读取这个文件，生成 @font-face，并把文件放进静态产物
const geist = localFont({
  src: "./geist-latin.woff2", // 相对当前文件
  display: "swap", // 字体没加载好时先用后备字体显示文字，避免"看不见"
  variable: "--font-geist", // 同时暴露成 CSS 变量，方便在别处引用
});

export const metadata: Metadata = {
  title: "next/font",
  description: "用 next/font 在构建时内联字体，消除外部请求和字体闪烁。",
};

export default function FontPage() {
  return (
    <div className={geist.variable}>
      <h1>next/font</h1>
      <p className="lead">
        构建时把字体收进自己的产物里，没有外部请求，也不会闪。
      </p>

      <h2>效果对比</h2>
      <div className="card">
        <p className="path" style={{ marginBottom: 10 }}>
          用了 Geist 字体：<span className={geist.className}>The quick brown fox jumps over the lazy dog — 0123456789</span>
        </p>
        <p className="path" style={{ marginBottom: 0 }}>
          没有用（系统默认）：
          <span>The quick brown fox jumps over the lazy dog — 0123456789</span>
        </p>
      </div>

      <div className="note">
        <strong>注意区分：</strong>Geist 只包含拉丁字符集，
        所以中文部分仍会回退到系统字体——这是正常的。
        中文字体的体积通常有几 MB，一般不整份引入，
        而是按需子集化（只打包用到的字），或者干脆用系统自带的中文字体。
      </div>

      <h2>代码</h2>
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
      >{`import localFont from "next/font/local"

const geist = localFont({
  src: "./geist-latin.woff2",
  display: "swap",              // 避免文字长时间不可见
  variable: "--font-geist",     // 暴露成 CSS 变量
})

// 用法一：直接给某一处加 className
<h2 className={geist.className}>Hello</h2>

// 用法二：在外层挂上 variable，内层用 CSS 变量引用
<div className={geist.variable}>
  <p style={{ fontFamily: "var(--font-geist)" }}>Hello</p>
</div>`}</pre>

      <h2>想用 Google Fonts 怎么办</h2>
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
      >{`import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], display: "swap" })`}</pre>

      <div className="callout note">
        <strong>国内项目的注意事项：</strong>
        <code>next/font/google</code> 会在<strong>构建时</strong>去
        Google 的服务器取字体。如果构建环境访问不了 Google，
        构建会失败或卡住。这时有两个办法：
        <ul style={{ margin: "8px 0 0 20px" }}>
          <li>改用 <code>next/font/local</code>，把字体文件放进仓库（本页的做法）；</li>
          <li>或者把字体文件放到自己的 CDN，仍然用 local 的方式引用。</li>
        </ul>
      </div>

      <div className="callout note">
        <strong>为什么它比手写 @font-face 好？</strong>
        next/font 还会自动计算字体的 <code>size-adjust</code> 等度量指标，
        让后备字体和自定义字体的行高尽量接近。这样从「后备字体」切换到
        「真实字体」时，页面不会明显跳动——这是手写 @font-face 很难做到的。
      </div>
    </div>
  );
}
