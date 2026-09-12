# Next.js 教程（App Router）

一套面向初学者的 Next.js 教程，**每个文件夹讲清楚一个知识点**，每个知识点配一份
图解讲解，所有代码集中在**一个可运行的 demo 项目**里。

教程只讲 App Router（`app/` 目录），不涉及已过时的 Pages Router。
共 14 章，提供两个版本：[单文件 Markdown](nextjs-tutorial.md) 和 [分章 HTML](index.html)。

---

## 为什么长这样

学习 Next.js 最大的障碍不是 API 太多，而是概念之间的**因果关系**：
为什么要有 `page.tsx`？`layout.tsx` 和普通组件差在哪？`"use client"` 到底在划什么线？
为什么同一个页面有时每次刷新都在变，有时永远不变？

所以这套教程的取舍是：

- **一个文件夹 = 一个知识点**。不做大而全的综述，一次只解决一个疑问。
- **渲染策略放在第一位**。HTML 到底在什么时候生成，是所有后续概念的地基。
- **代码只有一份**。每个章节文件夹里只有一份 HTML 讲解，不额外放代码片段；
  所有能跑的代码都在 `demo/` 里，chapter 与 demo 路由的对应关系写在讲解里。
- **不引入无关依赖**。示例里没有 Tailwind、没有 UI 库，避免读者分不清
  「这是 Next.js 的规则」还是「这是某个库的写法」。

---

## 目录结构

```
nextjs-demo/
├── nextjs-tutorial.md               ← 全部 14 章合并成的单文件讲义（Markdown）
├── index.html                       ← 教程总目录（浏览器直接打开）
├── README.md                        ← 本文件
│
├── 01-rendering-strategies/         ← 渲染策略：CSR / SSR / SSG / ISR
│   └── index.html
├── 02-routing-basics/               ← 路由基础
│   └── index.html
├── 03-layouts/                      ← 布局系统
│   └── index.html
├── 04-server-client-components/     ← 服务端 / 客户端组件
├── 05-data-fetching/
├── 06-dynamic-routes/
├── 07-loading-and-error/
├── 08-navigation/
├── 09-route-handlers/
├── 10-server-actions/
├── 11-metadata-seo/
├── 12-styling/
├── 13-images-and-fonts/
├── 14-middleware/
│
└── demo/                            ← 唯一可运行的 Next.js 项目
    ├── README.md                    ← 逐个介绍每个页面
    ├── package.json
    └── app/                         ← 所有章节的示例路由
```

课件有**两个版本，内容一致**：

- `nextjs-tutorial.md` —— 14 章合并成的一个 Markdown 文件，带目录，适合通读、
  打印或发布到支持 Markdown 的平台；
- `01-…` 到 `14-…` 这 14 个文件夹 —— 每章一份独立的 HTML 图解，
  排版更丰富，适合在浏览器里逐章阅读。

章节文件夹里**只有 HTML**，代码全部在 `demo/app/` 下。每章讲解里都会注明
「本章的代码在 demo 的哪个路由、哪个文件」。

---

## 三个入口

### 1. 通读全文（Markdown）

打开 [`nextjs-tutorial.md`](nextjs-tutorial.md)。单文件、自带目录，
14 章从头到尾。

### 2. 逐章阅读（HTML 图解）

用浏览器打开根目录的 `index.html`，它会链接到每一章的图解页面。

### 3. 跑代码（需要 Node.js）

```bash
cd demo
npm install
npm run dev
```

然后访问 http://localhost:3000。每个页面上都有说明文字，告诉你「这个文件
演示了什么」以及「可以动手验证什么」。详见 [`demo/README.md`](demo/README.md)。

> 验证渲染策略（SSG / ISR）时请用 `npm run build && npm start`。
> 开发模式为了热更新会每次重新渲染，看不出静态缓存的效果。

---

## 全部章节

| # | 知识点 | HTML 讲解 | demo 路由 |
| --- | --- | :---: | --- |
| 01 | 渲染策略：CSR / SSR / SSG / ISR | ✅ | `/rendering-strategies` |
| 02 | 路由基础：文件系统路由、`page.tsx`、路由组 | ✅ | `/routing-basics` |
| 03 | 布局系统：`layout.tsx`、嵌套布局、持久化、`template.tsx` | ✅ | `/layouts` |
| 04 | 服务端组件 vs 客户端组件：默认值、`"use client"` 边界 | ✅ | `/server-client` |
| 05 | 服务端数据获取：直接 `await`、缓存、串行 vs 并行 | ✅ | `/data-fetching` |
| 06 | 动态路由：`[slug]`、catch-all、`generateStaticParams` | ✅ | `/dynamic-routes` |
| 07 | 加载与错误处理：`loading.tsx`、`error.tsx`、`not-found.tsx` | ✅ | `/loading-and-error` |
| 08 | 导航：`Link`、`useRouter`、`usePathname`、`redirect()` | ✅ | `/navigation` |
| 09 | API 路由：`route.ts` 的 GET / POST / PUT / DELETE | ✅ | `/route-handlers` |
| 10 | Server Actions：表单、`useActionState`、`revalidatePath` | ✅ | `/server-actions` |
| 11 | SEO 与元数据：`metadata`、`generateMetadata`、Open Graph | ✅ | `/metadata` |
| 12 | 样式方案：全局 CSS、CSS Modules、条件类名 | ✅ | `/styling` |
| 13 | 图片与字体优化：`next/image`、`next/font` | ✅ | `/images-fonts` |
| 14 | 中间件：请求拦截、重定向、鉴权初筛 | ✅ | `/middleware` |

> 第十四章的约定文件在 Next.js 16 里叫 `proxy.ts`（以前叫 `middleware.ts`），
> 讲解里说明了这个变化。

---

## 环境要求

- Node.js 20 或更高版本
- 本项目验证时使用的版本：Node 24 · Next.js 16.3.5 · React 19.2.8 · TypeScript 5
