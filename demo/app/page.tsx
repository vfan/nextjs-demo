// ============================================================
// 首页 —— 路由 /
// ============================================================
// 文件位置：app/page.tsx
//
// 这是「文件夹即路由」的最直接体现：
// app/ 目录下直接放一个 page.tsx，它就对应网站的根路径 /。
//
// 注意这个组件没有加 async、没有 fetch、没有 "use client"——
// 它默认是一个服务端组件，在服务器上渲染成 HTML。

import Link from "next/link";

// 全部 14 章的索引。写成数据再渲染，比手写十几段 JSX 好维护。
// as const 让 href 保持字面量类型，配合类型化路由能通过检查。
const chapters = [
  {
    number: "01",
    title: "渲染策略",
    route: "/rendering-strategies",
    intro: "HTML 在哪里、什么时候生成？四种策略的对比。",
    links: [
      { href: "/rendering-strategies", label: "总览与对比表" },
      { href: "/rendering-strategies/csr", label: "CSR 客户端渲染" },
      { href: "/rendering-strategies/ssr", label: "SSR 服务端渲染" },
      { href: "/rendering-strategies/ssg", label: "SSG 静态生成" },
      { href: "/rendering-strategies/isr", label: "ISR 增量再生" },
    ],
  },
  {
    number: "02",
    title: "路由基础",
    route: "/routing-basics",
    intro: "文件夹即路由段，page.tsx 即页面入口。",
    links: [
      { href: "/routing-basics", label: "章节首页" },
      { href: "/routing-basics/about", label: "一级子路由" },
      { href: "/routing-basics/blog", label: "二级嵌套路由" },
      { href: "/routing-basics/pricing", label: "路由组" },
    ],
  },
  {
    number: "03",
    title: "布局系统",
    route: "/layouts",
    intro: "layout.tsx 包裹页面，切换路由时不销毁。",
    links: [
      { href: "/layouts", label: "章节首页" },
      { href: "/layouts/nested", label: "嵌套布局 + 状态保持" },
      { href: "/layouts/pricing", label: "路由组独立布局" },
      { href: "/layouts/template-demo", label: "template 对比" },
    ],
  },
  {
    number: "04",
    title: "服务端 / 客户端组件",
    route: "/server-client",
    intro: "默认是服务端组件，加了 \"use client\" 才变成客户端组件。",
    links: [
      { href: "/server-client", label: "对比总览" },
      { href: "/server-client/server-demo", label: "服务端组件" },
      { href: "/server-client/client-demo", label: "客户端组件" },
      { href: "/server-client/composition", label: "组合使用" },
    ],
  },
  {
    number: "05",
    title: "服务端数据获取",
    route: "/data-fetching",
    intro: "直接 await 取数，以及缓存怎么控制。",
    links: [
      { href: "/data-fetching", label: "直接取数据" },
      { href: "/data-fetching/caching", label: "三种缓存选项" },
      { href: "/data-fetching/parallel", label: "串行 vs 并行" },
    ],
  },
  {
    number: "06",
    title: "动态路由",
    route: "/dynamic-routes",
    intro: "一个页面接住成千上万个 URL。",
    links: [
      { href: "/dynamic-routes", label: "章节首页" },
      { href: "/dynamic-routes/blog/hello-nextjs", label: "单段 [slug]" },
      { href: "/dynamic-routes/shop/数码/耳机/降噪", label: "多段 catch-all" },
    ],
  },
  {
    number: "07",
    title: "加载状态与错误处理",
    route: "/loading-and-error",
    intro: "loading / error / not-found 三个约定文件。",
    links: [
      { href: "/loading-and-error", label: "章节首页" },
      { href: "/loading-and-error/slow", label: "loading.tsx 骨架屏" },
      { href: "/loading-and-error/error-demo", label: "error.tsx 错误边界" },
      { href: "/loading-and-error/not-found-demo", label: "not-found.tsx" },
    ],
  },
  {
    number: "08",
    title: "导航与路由感知",
    route: "/navigation",
    intro: "Link、useRouter、usePathname、redirect。",
    links: [
      { href: "/navigation", label: "章节首页" },
      { href: "/navigation/links", label: "Link 的四种用法" },
      { href: "/navigation/router", label: "useRouter" },
      { href: "/navigation/redirect", label: "redirect()" },
    ],
  },
  {
    number: "09",
    title: "API 路由",
    route: "/route-handlers",
    intro: "用 route.ts 写 HTTP 接口。",
    links: [
      { href: "/route-handlers", label: "章节首页 + 待办演示" },
      { href: "/api/todos", label: "GET /api/todos（原始 JSON）" },
    ],
  },
  {
    number: "10",
    title: "Server Actions",
    route: "/server-actions",
    intro: "不写接口，直接从表单调用服务端函数。",
    links: [
      { href: "/server-actions", label: "列表 + 删除" },
      { href: "/server-actions/simple", label: "内联 action" },
      { href: "/server-actions/validated", label: "带校验的表单" },
    ],
  },
  {
    number: "11",
    title: "SEO 与元数据",
    route: "/metadata",
    intro: "title、description、Open Graph。",
    links: [
      { href: "/metadata", label: "静态元数据" },
      { href: "/metadata/dynamic", label: "文章列表" },
      { href: "/metadata/dynamic/metadata-basics", label: "动态元数据" },
    ],
  },
  {
    number: "12",
    title: "样式方案",
    route: "/styling",
    intro: "全局 CSS、CSS Modules、条件类名。",
    links: [
      { href: "/styling", label: "四种方案对比" },
      { href: "/styling/css-modules", label: "CSS Modules" },
      { href: "/styling/conditional", label: "条件类名" },
    ],
  },
  {
    number: "13",
    title: "图片与字体优化",
    route: "/images-fonts",
    intro: "next/image 和 next/font 解决的性能问题。",
    links: [
      { href: "/images-fonts", label: "章节首页" },
      { href: "/images-fonts/image", label: "next/image 四种用法" },
      { href: "/images-fonts/font", label: "next/font/local" },
    ],
  },
  {
    number: "14",
    title: "中间件",
    route: "/middleware",
    intro: "在请求到达页面之前拦截：重定向、鉴权、注入请求头。",
    links: [
      { href: "/middleware", label: "章节首页" },
      { href: "/middleware/protected", label: "受保护的页面" },
    ],
  },
] as const;

export default function HomePage() {
  return (
    <>
      <h1>Next.js App Router 教程 Demo</h1>
      <p className="lead">
        这是一个可直接运行的 Next.js 项目，装着教程全部 14 章的示例代码。
        每一章在仓库根目录都有一份 HTML 讲解，这里是配套的可运行页面。
      </p>

      <div className="note">
        <strong>建议的用法：</strong>
        先读某一章的 HTML 讲解，再回到这里点开对应路由，亲手验证一下。
        每个页面上都写着「可以动手验证什么」。
        <br />
        验证 SSG / ISR 时记得用 <code>npm run build &amp;&amp; npm start</code>——
        开发模式为了热更新会每次重新渲染，看不出静态缓存的效果。
      </div>

      {chapters.map((chapter) => (
        <section key={chapter.number} style={{ marginTop: 36 }}>
          <h2 style={{ marginTop: 0 }}>
            {chapter.number} · {chapter.title}
          </h2>
          <p className="path" style={{ marginBottom: 10 }}>
            {chapter.intro}
          </p>
          <ul
            style={{
              listStyle: "none",
              marginLeft: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {chapter.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: "inline-block",
                    padding: "6px 14px",
                    border: "1px solid #e0e0e0",
                    borderRadius: 999,
                    background: "#fff",
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
