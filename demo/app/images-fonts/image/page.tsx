// ============================================================
// next/image —— 路由 /images-fonts/image
// ============================================================
// 文件位置：app/images-fonts/image/page.tsx
//
// 原生 <img> 有三个老问题：图片撑开页面导致布局跳动、
// 大图直接在手机上加载、格式不对没有兜底。
// <Image> 把这几件事都替你处理了：
//
//   · 强制要求宽高（或 fill）→ 预留位置，避免布局跳动（CLS）
//   · 懒加载：不在视口内的图片不加载
//   · 自动转成 WebP/AVIF（体积更小）
//   · 按屏幕尺寸生成多个版本，用 srcset 让浏览器自己挑
//
// 注意：本页的图片是静态导入的，所以宽高和模糊占位都是自动的。
// 用字符串路径则需要自己写 width/height，见下面的对比。

import type { Metadata } from "next";
import Image from "next/image";
// 静态导入：Next.js 会读出图片的真实尺寸，并自动生成模糊占位图
import photo from "@/public/photo.png";

export const metadata: Metadata = {
  title: "next/image",
  description: "用 Image 组件做图片优化：防止布局跳动、懒加载、自动转格式。",
};

export default function ImagePage() {
  return (
    <>
      <h1>next/image</h1>
      <p className="lead">
        同样是一张图，用 <code>&lt;Image&gt;</code> 比 <code>&lt;img&gt;</code>{" "}
        多做四件事。
      </p>

      <h2>① 静态导入：宽高和模糊占位全自动</h2>
      <p>
        把图片当成模块导入，Next.js 会读出它的真实尺寸，
        并自动生成一张极小的模糊图作为加载占位。
      </p>
      <Image
        src={photo}
        alt="一张渐变的示例图片"
        placeholder="blur"
        sizes="(max-width: 900px) 100vw, 820px"
        style={{ width: "100%", height: "auto", borderRadius: 10 }}
      />
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "14px 18px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.82rem",
          lineHeight: 1.7,
          marginTop: 12,
        }}
      >{`import photo from "@/public/photo.png"

<Image src={photo} alt="..." placeholder="blur" />`}</pre>

      <h2>② 字符串路径：要自己写宽高</h2>
      <p>
        如果图片放在 <code>public/</code> 里按路径引用，
        Next.js 无从得知它的尺寸，你就得手动写出来——
        这个宽高不是为了显示，而是为了<strong>预留位置</strong>。
      </p>
      <div style={{ position: "relative", maxWidth: 420 }}>
        <Image
          src="/photo.png"
          alt="同一张图，用路径引用"
          width={960}
          height={540}
          style={{ width: "100%", height: "auto", borderRadius: 10 }}
        />
      </div>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "14px 18px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.82rem",
          lineHeight: 1.7,
          marginTop: 12,
        }}
      >{`<Image src="/photo.png" alt="..." width={960} height={540} />`}</pre>

      <div className="note warn">
        <strong>为什么必须写宽高？</strong>因为浏览器需要在图片下载完成之前
        就知道它占多大地方，才能把后续内容排好。不写的话，
        图片加载完会把下面的内容「顶下去」——这就是
        <strong>布局跳动（CLS）</strong>，一项真实的用户体验指标。
      </div>

      <h2>③ fill：填满父容器</h2>
      <p>
        不知道具体尺寸、只想让图铺满一块区域时，用 <code>fill</code>。
        <strong>父元素必须有定位</strong>（<code>position: relative</code>），
        否则它会铺满整个页面。
      </p>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Image
          src="/photo.png"
          alt="用 fill 铺满容器"
          fill
          sizes="(max-width: 900px) 100vw, 820px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "14px 18px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.82rem",
          lineHeight: 1.7,
          marginTop: 12,
        }}
      >{`<div style={{ position: "relative", aspectRatio: "16 / 9" }}>
  <Image src="/photo.png" alt="..." fill style={{ objectFit: "cover" }} />
</div>`}</pre>

      <h2>④ priority：首屏大图</h2>
      <p>
        默认所有 <code>&lt;Image&gt;</code> 都是懒加载的——进入视口才开始下载。
        但首屏那张最大的图（LCP 元素）恰恰应该<strong>优先</strong>加载，
        否则用户会看到它慢慢冒出来。
      </p>
      <pre
        style={{
          background: "#1e1e1e",
          color: "#d4d4d4",
          padding: "14px 18px",
          borderRadius: 8,
          overflowX: "auto",
          fontSize: "0.82rem",
          lineHeight: 1.7,
        }}
      >{`{/* 首屏的封面图 */}
<Image src={cover} alt="..." priority />

{/* 页面下方的图，保持默认懒加载就好 */}
<Image src={photo} alt="..." />`}</pre>

      <div className="callout note">
        <strong>别给所有图都加 priority。</strong>
        它会让浏览器提前抢带宽，如果每张图都加，等于取消了优化，
        顺序还会互相打架。一般一个页面只给一两张图加。
      </div>

      <h2>验证方法</h2>
      <div className="note">
        打开开发者工具，把 Network 面板的过滤设为 <code>Img</code>，刷新页面：
        <ul style={{ margin: "8px 0 0 20px" }}>
          <li>往下滚动，能看到图片是<strong>滚动到附近才开始加载</strong>的；</li>
          <li>请求的地址是 <code>/_next/image?url=...&amp;w=...</code>——
              Next.js 在中间做了一层转换；</li>
          <li>看响应头 / 文件类型，会被转成 <strong>WebP</strong> 之类的现代格式，
              比原始 PNG 小得多（前提是用了 sharp，Next.js 会自动检测）。</li>
        </ul>
      </div>

      <div className="note warn">
        <strong>用外部图床的图片要配置域名。</strong>
        直接写 <code>src=&quot;https://example.com/a.jpg&quot;</code> 会报错，
        必须先在 <code>next.config.ts</code> 里声明允许的域名：
        <pre
          style={{
            background: "#1e1e1e",
            color: "#d4d4d4",
            padding: "12px 16px",
            borderRadius: 6,
            overflowX: "auto",
            fontSize: "0.78rem",
            marginTop: 10,
            marginBottom: 0,
          }}
        >{`images: {
  remotePatterns: [{ protocol: "https", hostname: "example.com" }],
}`}</pre>
        这是刻意的安全设计——防止别人把你当成免费的图片处理服务。
      </div>
    </>
  );
}
