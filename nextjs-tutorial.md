# Next.js 教程（App Router）

一套完整的 Next.js App Router 教程，共 14 章。每章聚焦一个知识点，配图解式讲解；
所有代码集中在同一个可运行的 demo 项目里。

- 只讲 App Router（`app/` 目录），不涉及已过时的 Pages Router
- 版本基准：Next.js 16.3.5 · React 19.2.8 · TypeScript 5 · Node 24
- 零额外依赖：示例里没有 Tailwind、没有 UI 库，避免让读者分不清
  「这是 Next.js 的规则」还是「这是某个库的写法」

## 怎么用这份文档

建议按章节顺序从头读。第一章的「渲染策略」是地基——它回答「HTML 到底什么时候生成」，
后面所有关于数据、缓存、性能的话题都建立在它之上。

每章末尾都列出了对应 demo 的文件路径。配套的可运行项目在 `demo/` 目录下：

```bash
cd demo
npm install
npm run dev
```

然后打开 http://localhost:3000，首页按章列出了所有示例的入口。

> **验证 SSG / ISR 时务必用 `npm run build && npm start`。**
> 开发模式为了热更新会每次重新渲染，静态页面的时间戳也会变，看不出真实行为。

## 目录

- [第 1 章 · 渲染策略：CSR / SSR / SSG / ISR](#ch-01)
- [第 2 章 · 路由基础](#ch-02)
- [第 3 章 · 布局系统](#ch-03)
- [第 4 章 · 服务端组件 vs 客户端组件](#ch-04)
- [第 5 章 · 服务端数据获取](#ch-05)
- [第 6 章 · 动态路由](#ch-06)
- [第 7 章 · 加载状态与错误处理](#ch-07)
- [第 8 章 · 导航与路由感知](#ch-08)
- [第 9 章 · API 路由：route.ts](#ch-09)
- [第 10 章 · Server Actions](#ch-10)
- [第 11 章 · SEO 与元数据](#ch-11)
- [第 12 章 · 样式方案](#ch-12)
- [第 13 章 · 图片与字体优化](#ch-13)
- [第 14 章 · 中间件（proxy.ts）](#ch-14)

---

<a id="ch-01"></a>

## 第 1 章 · 渲染策略：CSR / SSR / SSG / ISR

Next.js 的所有特性，最终都在回答同一个问题：**这段 HTML 是在哪里、什么时候生成的？**
弄懂这件事，后面的服务端组件、数据获取、缓存策略才有立足点。所以这一章放在最前面。

> **配套可运行代码：**本章四个模式都有真实可跑的页面，在 `demo/` 项目里。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/rendering-strategies`，
> 每个模式页面上都会显示「本次 HTML 的生成时间」——反复刷新，时间戳的变化规律就是它们的区别。

### 1. 先建立一个概念：渲染 = 生成 HTML

浏览器需要 HTML 才能显示页面。但「HTML 从哪来」有好几种答案，这就是渲染策略。

举一个具体的例子。假设页面上要显示一段实时数据：

```
<p>当前时间：{now}</p>
```

这个 `{now}` 究竟是什么时候被替换成真实时间的？四种答案对应四种策略：

| 策略 | HTML 生成于 | 一句话解释 |
|---|---|---|
| CSR | 用户的浏览器里 | 服务器只发一个空壳，时间由浏览器里的 JS 填进去 |
| SSR | 每次请求时的服务器上 | 服务器现取现算，每个访客都拿到刚出炉的完整 HTML |
| SSG | 构建时的服务器上 | 打包时就生成好一份 HTML 存着，之后谁访问都发这一份 |
| ISR | 构建时 + 之后定时再生 | 本质是 SSG，但隔一段时间偷偷更新一次那份 HTML |

注意这四个缩写里有三个是「服务器端」（SSR / SSG / ISR），只有一个在客户端（CSR）。
这就是为什么 Next.js 被称作「服务端渲染框架」——它默认在服务器上生成 HTML，
而不是像早期的纯 React 单页应用那样把渲染工作全丢给浏览器。

### 2. 四种策略逐个拆解

#### CSR — 客户端渲染

服务器返回的 HTML 几乎是空的，真正的内存在浏览器里由 JavaScript 生成。经典的
React 单页应用（SPA）走的就是这条路。

```
浏览器                        服务器
  │ 请求页面                    │
  ├───────────────────────────► │
  │ ◄──────── 空壳 HTML + JS ───┤   ① 拿到的 HTML 里没有内容
  │                             │
  │  ② 下载并执行 JS            │
  │  ③ JS 再发一次数据请求       │
  ├───────────────────────────► │
  │ ◄────────────────── 数据 ───┤
  │  ④ 这才渲染出内容            │
```

```tsx
// app/rendering-strategies/csr/page.tsx
"use client"   // 必须声明为客户端组件，因为要用浏览器里的 useEffect

import { useEffect, useState } from "react"

export default function CsrPage() {
  const [now, setNow] = useState<string | null>(null)

  useEffect(() => {
    // 这段代码只在浏览器里执行，所以时间永远是最新的
    setNow(new Date().toLocaleString())
  }, [])

  return <p>当前时间：{now ?? "加载中…"}</p>
}
```

**优点**：服务器几乎不干活，首屏之后的一切交互都在本地完成，页面之间切换极快。
**缺点**：首屏要等 JS 下载执行完；搜索引擎拿到的是一份空壳，对 SEO 不利；低端设备上慢。

**什么时候用**：后台管理系统、需要大量本地交互的应用——这类页面不需要被搜索引擎收录，
用户也不介意多等一小会儿。

#### SSR — 服务端渲染

每次有请求进来，服务器都现场取数据、现场把 HTML 拼好，再发给浏览器。浏览器拿到的是
一份可以直接显示的完整 HTML。

```
浏览器                        服务器
  │ 请求页面                    │
  ├───────────────────────────► │  ① 取数据
  │                             │  ② 用数据渲染出完整 HTML
  │ ◄──────── 完整 HTML ────────┤
  │  ③ 立刻就能看到内容          │
```

```tsx
// app/rendering-strategies/ssr/page.tsx
export const dynamic = "force-dynamic"   // 强制每次请求都重新渲染

export default async function SsrPage() {
  // 这行代码在服务器上运行，每次请求都会重新执行
  const now = new Date().toLocaleString()

  return <p>当前时间：{now}</p>
}
```

**优点**：首屏快（内容已经在 HTML 里）；SEO 友好；每次都是最新数据。
**缺点**：每次请求都要占用服务器算力。流量大时这是真金白银的成本。

**什么时候用**：内容需要实时或因人而异。比如「你当前的购物车」「登录用户的个人信息」。

> **术语提醒：**在 App Router 的官方文档里，SSR 这个模式通常被称作
> **动态渲染（Dynamic Rendering）**。名字变了，本质还是传统的服务端渲染。
> 叫它 SSR 完全没问题，本章为了跟 SSG / ISR 放在一起对比，统一用 SSR 这个叫法。

#### SSG — 静态站点生成

在建站的时候（`next build` 那一刻）就把 HTML 生成好，存成文件。
之后不管谁来访问，直接把这份现成的文件发出去。对服务器来说，这几乎不消耗算力。

```
【构建时·只发生一次】
build  ──► 取数据 ──► 生成 page.html 存进产物里

【运行时·每次请求】
浏览器 ──► 服务器 ──► 直接返回那份 page.html（不重新渲染）

     结果：时间永远停在构建那一刻
```

```tsx
// app/rendering-strategies/ssg/page.tsx
// 什么都不用写——这就是 App Router 的默认行为

export default function SsgPage() {
  // 这行代码只在构建时执行一次，之后结果被固化成静态 HTML
  const now = new Date().toLocaleString()

  return <p>当前时间：{now}</p>
}
```

**优点**：最快（几乎是纯静态文件服务），服务器压力最小，还能直接部署到 CDN 上。
**缺点**：数据是死的。想更新内容就得重新构建、重新部署。

**什么时候用**：博客文章、产品文档、营销落地页——这类内容不常变，但访问量可能很大。

> **这是 Next.js 的默认档位。**你写一个普通的页面，只要它没有用到任何
> 「跟本次请求有关」的东西（后面会讲具体是哪些），Next.js 就会在构建时把它变成静态 HTML。
> 你什么都不做，就已经在用 SSG 了。

#### ISR — 增量静态再生

ISR 是 SSG 和 SSR 的折中。页面仍然是静态生成的，但你可以指定一个「保质期」：
过了这段时间，下一个来访问的人会先看到旧页面，同时服务器在后台悄悄重新生成一份新的。

```
build   ──► 生成 HTML v1（存起来）

t = 0s   有人访问 ──► 直接返回 v1
t = 3s   有人访问 ──► 直接返回 v1        ┐
t = 9s   有人访问 ──► 直接返回 v1        ┘ 保质期内，都用旧的那份

t = 12s  有人访问 ──► 先返回 v1（旧的）    ← 不等待
                        └─► 后台重新生成 v2

t = 13s  有人访问 ──► 返回 v2（新的）
```

```tsx
// app/rendering-strategies/isr/page.tsx
export const revalidate = 10   // 单位：秒。每 10 秒允许再生一次

export default function IsrPage() {
  const now = new Date().toLocaleString()

  return <p>当前时间：{now}</p>
}
```

**优点**：享受静态页面的速度，同时数据不会永远停在构建那一刻。
**缺点**：数据有延迟，最多滞后 `revalidate` 秒。不适合毫秒级要求。

**什么时候用**：文章列表、商品列表、新闻首页——数量庞大、不常变、但终究会变的内容。
一个百万篇文章的博客，用 ISR 就永远不需要为了发一篇文章而重新构建全站。

### 3. 横向对比

把四个模式摊开放在一起看。这张表建议背下来，后面遇到任何「该用哪种」的问题都能回来查。

| 对比项 | CSR | SSR | SSG | ISR |
|---|---|---|---|---|
| **HTML 生成时机** | 浏览器运行时 | 每次请求 | 构建时一次 | 构建时 + 定时再生 |
| **数据新鲜度** | 总是最新 | 总是最新 | 构建那刻的快照 | 最多滞后 revalidate 秒 |
| **首屏速度** | 慢（要等 JS） | 快 | 最快 | 最快 |
| **服务器成本** | 最低 | 最高 | 最低 | 很低 |
| **SEO** | 差 | 好 | 好 | 好 |
| **能否上 CDN** | 可以 | 通常不行 | 可以 | 可以 |
| **每个用户看到的内容** | 各自不同 | 可能不同 | 完全相同 | 一段时间内相同 |
| **典型场景** | 后台管理系统 | 购物车、个人中心 | 博客、文档、营销页 | 商品列表、新闻首页 |

#### 怎么选？一条决策路径

1. **这个页面需要被搜索引擎收录吗？**不需要，且交互很重 → 直接选 **CSR**，别纠结。
2. **内容是否因人而异、或必须实时？**是 → 选 **SSR**（同一份 HTML 给所有人就没意义了）。
3. **内容对所有访客都一样，且变化不频繁？**是 → 选 **SSG**，这是最省钱的方案。
4. **内容不常变，但偶尔需要更新，且页面数量很大？**是 → 选 **ISR**，避免为了改一点内容重建全站。

### 4. Next.js 怎么替你决定？

关键的一点：**在 App Router 里，你通常不需要手动选**。Next.js 会看你的代码，
自动推断这个页面能不能静态化。

#### 默认是静态的

只要你写的是普通页面，没有用到下面这些「跟请求有关」的能力，Next.js 就在构建时把它静态化（SSG）：

- `cookies()` — 读取 cookie，因人而异
- `headers()` — 读取请求头
- 页面的 `searchParams` — 同一路径带不同查询参数
- 在 `fetch()` 里写了 `cache: "no-store"`

一旦用了其中任何一个，这个页面就「不可能在构建时算出来」，于是自动转为
**动态渲染**（也就是 SSR）。

#### 需要时可以强制

```ts
// 强制动态渲染（SSR）：每次请求都重新生成
export const dynamic = "force-dynamic"

// 强制静态渲染（SSG）：即使代码里有动态能力也坚持静态化
export const dynamic = "force-static"

// 开启 ISR：每 N 秒允许再生一次
export const revalidate = 10
```

这三行叫**路由段配置（Route Segment Config）**，写在 `page.tsx` 或
`layout.tsx` 的顶层，跟组件并列。

> **怎么知道某个页面最终是静态还是动态？**跑一次 `npm run build`，
> 构建输出里会逐个列出路由，并在右边标注 `○ (Static)` 或 `ƒ (Dynamic)`。
> 这是最权威的答案——框架怎么想的不重要，它实际做了什么才重要。

### 5. 去 demo 里亲手验证

概念讲完了，但「时间戳会不会变」这件事，看一眼比读十遍强。打开 demo 里的这四个页面：

> **实验步骤：**依次打开下面四个页面，每个页面都**连续刷新几次**，
> 盯着页面上显示的那个「HTML 生成时间」看。

| 页面 | 刷新后时间戳的表现 |
|---|---|
| `/rendering-strategies/csr` | 会变，而且能看到一瞬间的「加载中」——因为内容是浏览器拿到 JS 之后才填的 |
| `/rendering-strategies/ssr` | 每次刷新都变——服务器每次请求都重新渲染了一遍 |
| `/rendering-strategies/ssg` | 永远不变，固定在构建那一刻——这个时间戳是「烤」进 HTML 里的 |
| `/rendering-strategies/isr` | 10 秒内不变，超过 10 秒后第一次刷新仍是旧值，再刷一次才更新 |

> **ISR 那个「再刷一次才更新」不是 bug。**这正是 ISR 的设计：
> 过期后的第一个访客拿到的是旧页面（保证速度），服务器在后台同时生成新版本，
> 下一个访客才看到新内容。这个过程叫「后台再生」（stale-while-revalidate）。

> **一个容易踩的坑：**如果你改了代码想看 SSG 时间戳变化，光刷新浏览器是没用的，
> 必须重新 `npm run build && npm start`。因为静态 HTML 是构建产物，构建不重跑，
> 它永远停在旧的时间上。用 `npm run dev` 时行为会有所不同——开发模式为了热更新，
> 每次请求都重新渲染，所以 SSG 在 dev 下看起来「每次都在变」，这是正常的，
> 以 `build + start` 的结果为准。

### 6. 小结

- 渲染策略回答的是「HTML 在哪、何时生成」。
- **CSR** 在浏览器生成——快在交互，慢在首屏，不利于 SEO。
- **SSR** 每次请求在服务器生成——最新，但吃服务器资源。
- **SSG** 构建时生成一次——最快最省，但内容是死的。
- **ISR** 是 SSG 加上保质期——静态的速度，可接受的延迟。
- App Router 默认静态化，用到 `cookies()`、`headers()`、`searchParams`
      这类请求相关能力时自动转为动态。
- 用 `build` 输出的 `○ / ƒ` 标记来确认实际结果。

下一章开始讲路由——先有页面，才有「这个页面该怎么渲染」的问题。

<a id="ch-02"></a>

## 第 2 章 · 路由基础

Next.js 的路由系统不依赖任何配置文件——它直接读取你写在 `app/` 目录下的文件夹结构来生成 URL。
这是一种「约定大于配置」的设计：文件夹 = 路由段，`page.tsx` = 页面入口。

> **配套可运行代码：**本章所有示例都在仓库的 `demo/` 项目里，
> 对应的路由是 `/routing-basics` 及其子页面。
> 进入 `demo/` 执行 `npm install && npm run dev`，
> 再打开 `http://localhost:3000/routing-basics` 就能逐个点开验证。
> 各页面的详细说明见 `demo/README.md`。

### 1. 核心规则：一个文件夹就是一个路由

在 Next.js App Router 中，路由规则非常简单：

```
app/
├── page.tsx              →  /
├── about/
│   └── page.tsx          →  /about
├── blog/
│   └── page.tsx          →  /blog
└── blog/
    └── first-post/
        └── page.tsx      →  /blog/first-post
```

每一个**文件夹**代表一个 URL 段（route segment），每一层嵌套对应 URL 中的一级路径。直到某个文件夹里有 `page.tsx` 文件，这条路径才算真正「有页面」。

> **关键点：**没有 `page.tsx` 的文件夹对外不可访问。比如 `app/components/` 里即使放了文件，
> 因为没有 `page.tsx`，浏览器访问 `/components` 会返回 404。这让你可以把组件、工具函数安心放在 `app/` 下面。

### 2. page.tsx：唯一的页面入口

`page.tsx` 是一个特殊的保留文件名。它默认导出一个 React 组件，这个组件就代表该路由的完整页面。

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>关于我们</h1>
      <p>这是 /about 路由的页面内容。</p>
    </main>
  )
}
```

上面这个文件放在 `app/about/` 目录下，Next.js 会自动让它响应 `/about` 的请求。

几个重要规则：
- `page.tsx` 必须是**默认导出**（`export default`），不能是命名导出。
- 一个路由段（文件夹）内**只能有一个** `page.tsx`。
- `page.tsx` 默认是**服务端组件**（Server Component），可以在函数体内直接写 `async` 获取数据。

### 3. 路由与文件夹的完整映射

把上面两个规则合并，就能理解任意 URL 是怎么对到文件的：

```
app/
├── page.tsx                         →  /
├── about/
│   └── page.tsx                     →  /about
├── products/
│   ├── page.tsx                     →  /products
│   ├── [id]/
│   │   └── page.tsx                 →  /products/1, /products/abc ...
│   └── categories/
│       └── page.tsx                 →  /products/categories
└── dashboard/
    ├── layout.tsx
    ├── page.tsx                     →  /dashboard
    └── settings/
        └── page.tsx                 →  /dashboard/settings
```

URL 的每一段（用 `/` 分隔）都是文件系统的一个层级。这是一种**零配置路由**——不需要写 `routes.ts`，不需要注册路由表，新建文件夹就是新建路由。

### 4. 理解「保留文件」

Next.js 在 `app/` 目录下定义了一组**特殊文件名**，各自承担不同的职责：

| 文件名 | 作用 | 说明 |
|---|---|---|
| `page.tsx` | 页面内容 | 路由可访问的唯一入口 |
| `layout.tsx` | 共享布局 | 包裹子页面的外壳，切换路由时不销毁 |
| `loading.tsx` | 加载状态 | 页面数据加载过程中显示的 UI |
| `error.tsx` | 错误边界 | 捕获子组件渲染错误 |
| `not-found.tsx` | 404 页面 | 该路由段下资源不存在时的 UI |
| `route.ts` | API 端点 | 处理 HTTP 请求（GET/POST 等），不能与 page.tsx 共存 |

这些文件都跟路由相关，我们会陆续讲到。这一章的重点是：**只要在你需要的文件夹里放一个 `page.tsx`，你就多了一个页面**。

### 5. 路由组：不影响 URL 的文件夹

如果想把几个相关页面归到一个文件夹里管理，但不希望这个文件夹出现在 URL 中，可以用**路由组（Route Group）**：把文件夹名用小括号包起来。

```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx       →  /about （注意：不是 /marketing/about）
│   └── contact/
│       └── page.tsx      →  /contact
└── (shop)/
    ├── products/
    │   └── page.tsx      →  /products
    └── cart/
        └── page.tsx         →  /cart
```

`(marketing)` 和 `(shop)` 纯粹是组织代码用的，**对 URL 完全透明**。你可以给不同的路由组配不同的 `layout.tsx`——这是它的最大价值（下一章会讲到）。

### 6. 示例代码

以下是本章的代码示例，展示了最基本的页面创建方式。这些示例在 demo 项目里都有可运行版本：

> **本章示例与 demo 文件的对应关系**
> - `demo/app/routing-basics/page.tsx` → `/routing-basics`
> - `demo/app/routing-basics/about/page.tsx` → `/routing-basics/about`
> - `demo/app/routing-basics/blog/page.tsx` → `/routing-basics/blog`
> - `demo/app/routing-basics/blog/first-post/page.tsx` → `/routing-basics/blog/first-post`
> - `demo/app/routing-basics/(marketing)/pricing/page.tsx` → `/routing-basics/pricing`
>
> 说明：demo 是「一个项目装下所有章节」的结构，所以比孤立示例多了一层
> `routing-basics/` 前缀，用来把本章的代码归在一起。路由规则本身完全一样。
> 下面的代码片段是精简示意，完整版以上述文件为准。

#### 示例 A：根路由 + 一级子路由

```tsx
// demo/app/routing-basics/page.tsx — 访问 /routing-basics
export default function HomePage() {
  return <h1>欢迎来到我的网站</h1>
}
```

```tsx
// demo/app/routing-basics/about/page.tsx — 访问 /routing-basics/about
export default function AboutPage() {
  return (
    <article>
      <h1>关于我们</h1>
      <p>这是一段公司介绍。</p>
    </article>
  )
}
```

#### 示例 B：二级嵌套路由

```tsx
// demo/app/routing-basics/blog/page.tsx — 访问 /routing-basics/blog
import Link from "next/link"

export default function BlogIndex() {
  return (
    <div>
      <h1>博客</h1>
      <Link href="/routing-basics/blog/first-post">我的第一篇博客</Link>
    </div>
  )
}
```

```tsx
// demo/app/routing-basics/blog/first-post/page.tsx — 访问 /routing-basics/blog/first-post
export default function FirstPost() {
  return (
    <article>
      <h1>我的第一篇博客</h1>
      <time dateTime="2026-09-12">2026 年 9 月 12 日</time>
      <p>Hello, Next.js!</p>
    </article>
  )
}
```

#### 示例 C：路由组

```tsx
// demo/app/routing-basics/(marketing)/pricing/page.tsx — 访问 /routing-basics/pricing（注意没有 marketing）
export default function PricingPage() {
  return (
    <div>
      <h1>价格方案</h1>
      <ul>
        <li>免费版 — ¥0/月</li>
        <li>专业版 — ¥99/月</li>
      </ul>
    </div>
  )
}
```

> **动手验证：**打开 `demo/`，在 `demo/app/routing-basics/` 下新建一个文件夹、
> 放进一个 `page.tsx`，然后访问对应 URL——你会看到零编译、零重启，页面直接生效
> （这得益于 Turbopack 的热更新）。验证完删掉即可，不影响其它章节。

<a id="ch-03"></a>

## 第 3 章 · 布局系统

如果路由告诉你「哪个页面」，布局系统就告诉你「页面长什么样」。
`layout.tsx` 是 Next.js 最强大的特性之一：它是一个包裹组件，在路由切换时**保持不销毁**（persistent），让导航体验极其流畅。

> **配套可运行代码：**本章示例位于 `demo/` 项目，路由前缀是
> `/layouts`。其中 `/layouts/nested` 用来验证「布局不销毁」，
> `/layouts/template-demo` 用来对比 template 的重挂载行为。
> 在 `demo/` 下执行 `npm install && npm run dev`，
> 再访问 `http://localhost:3000/layouts`。详细说明见 `demo/README.md`。

### 1. 什么是 Layout？

Layout 就是一个包装器（wrapper）。它接收 `children` prop，把当前路由的页面内容渲染在指定位置。

类比如下：如果你有一个网站，所有页面都有相同的顶部导航栏和底部版权栏，你不想在每个 `page.tsx` 里都复制一遍——用 `layout.tsx` 包住它们就行了。

```tsx
// app/layout.tsx — 根布局（Root Layout）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <nav style={{ borderBottom: "1px solid #e0e0e0", padding: "12px 24px" }}>
          <a href="/">首页</a>  |  
          <a href="/about">关于</a>  |  
          <a href="/blog">博客</a>
        </nav>

        {/* 页面内容就渲染在这里 */}
        {children}

        <footer style={{ borderTop: "1px solid #e0e0e0", padding: "12px 24px", marginTop: 48 }}>
          <p>© 2026 我的网站</p>
        </footer>
      </body>
    </html>
  )
}
```

> **关键规则：**`app/layout.tsx` 是**必选的**。每个 Next.js 项目必须有根布局，并且它必须包含 `<html>` 和 `<body>` 标签。
> 这是唯一的强制要求——没有根布局，项目无法启动。

### 2. 布局的核心特性：不会重新挂载

这是 Layout 与普通组件**最本质的区别**。

当你在 `/about` 和 `/blog` 之间切换时，如果这两个页面共享同一个 layout，那么 layout 组件**不会销毁再重建**（不会触发 useEffect 的 cleanup，不会丢失内部 state）。只有 `{children}` 区域会更新。

```
从 /about 切换到 /blog 时：

导航栏
← 只有这部分更新
底部版权

导航栏和底部版权保持不变，不重新渲染也不重置状态
```

这意味着：
- **导航栏里的搜索框输入的文字不会丢失**——因为组件没有被销毁。
- **侧边栏的展开/折叠状态会被保留**。
- **视频/音频继续播放**，不会被路由切换打断。

### 3. 嵌套布局：逐层包裹

Layout 可以嵌套。每个文件夹都可以定义自己的 `layout.tsx`，它们从外到内一层层包裹：

```
app/
├── layout.tsx                ← 根布局（最外层）
├── page.tsx
├── about/
│   └── page.tsx
├── blog/
│   ├── layout.tsx            ← /blog 自己的布局
│   ├── page.tsx
│   └── first-post/
│       └── page.tsx
└── dashboard/
    ├── layout.tsx            ← /dashboard 自己的布局
    ├── page.tsx
    └── settings/
        └── page.tsx
```

当用户访问 `/blog/first-post` 时，渲染的嵌套结构为：

```
根布局（app/layout.tsx）
  └─
博客布局（app/blog/layout.tsx）
      └─
first-post/page.tsx 内容
```

#### 代码示例：仪表盘嵌套布局

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <aside style={{ width: 200, padding: 20, borderRight: "1px solid #e0e0e0" }}>
        <h3>仪表盘</h3>
        <nav>
          <a href="/dashboard">概览</a>
          <a href="/dashboard/settings">设置</a>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>
        {children}
      </main>
    </div>
  )
}
```

效果：访问 `/dashboard` 和 `/dashboard/settings` 时，左侧栏保持不变。只有右侧的 `{children}` 会切换。

### 4. 根布局的特殊规则

| 规则 | 说明 |
|---|---|
| 必须存在 | `app/layout.tsx` 不可或缺，项目启动的前提 |
| 必须包含 `<html>` 和 `<body>` | 这是生成有效 HTML 文档的必要标签，子布局**不加**这两个标签 |
| 可以在这里引入全局样式 | 比如 `import "./globals.css"`，这是引入全局 CSS 的唯一位置 |
| 在这里设置 metadata | 网站的标题、描述等元数据（第 10 章会展开讲） |
| 是服务端组件 | 根布局永远是 Server Component，不能加 `"use client"` |

### 5. 路由组 + 不同布局

还记得上一章的路由组（`(groupName)`）吗？它的核心价值在这里体现：**你可以给不同的路由组套上不同的 layout**。

```
app/
├── (marketing)/
│   ├── layout.tsx          ← 营销页面专用布局（简约、大图风格）
│   ├── about/
│   │   └── page.tsx
│   └── pricing/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx          ← 后台专用布局（侧边栏 + 顶栏）
│   ├── analytics/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
└── layout.tsx              ← 根布局（两个分组共享）
```

这样，`/about` 和 `/pricing` 共享营销风格的布局，`/analytics` 和 `/settings` 共享后台风格的布局——**而 URL 里完全看不到 `(marketing)` 或 `(dashboard)`**。

### 6. Template vs Layout

Next.js 还提供了一个 `template.tsx` 文件，用法和 `layout.tsx` 几乎一样——唯一的区别是：

| | layout.tsx | template.tsx |
|---|---|---|
| 路由切换行为 | **保持挂载**（不销毁） | **重新挂载**（每次销毁再建） |
| state 保留？ | ✅ 保留 | ❌ 重置 |
| useEffect cleanup 执行？ | ❌ 不执行 | ✅ 执行 |
| 适用场景 | 导航栏、侧边栏、页脚 | 页面入场动画、页面浏览统计 |

> **怎么选？**90% 的情况用 `layout.tsx`。只有当你**需要在每次路由切换时触发动画或重置状态**时，才用 `template.tsx`。
> 两者可以同时存在——template 在 layout 的内层。

### 7. 示例代码

以下示例对应本章各知识点，都是精简示意；完整可运行版本都在 demo 项目里：

> **知识点与 demo 文件的对应关系**
> - 根布局 → `demo/app/layout.tsx`（全站生效）
> - 子布局 → `demo/app/layouts/layout.tsx`（作用于 `/layouts/*`）
> - 嵌套布局 + 状态保持 → `demo/app/layouts/nested/layout.tsx`（`/layouts/nested`）
> - 路由组独立布局 → `demo/app/layouts/(marketing)/layout.tsx`（`/layouts/pricing`）
> - template 对比 → `demo/app/layouts/template-demo/template.tsx`（`/layouts/template-demo`）

#### 示例 A：根布局

```tsx
// demo/app/layout.tsx
import "./globals.css"   // 全局样式只在这里引入

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">          // 只有根布局写 <html> / <body>
      <body>
        <header className="site-header">
          <a href="/">MySite</a>
        </header>
        <main>{children}</main>       // 页面内容注入在这里
        <footer>© 2026 MySite</footer>
      </body>
    </html>
  )
}
```

#### 示例 B：子布局

```tsx
// demo/app/layouts/layout.tsx — 只作用于 /layouts 及其子路由
import Link from "next/link"

export default function LayoutsChapterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* 这条导航在 /layouts 下的页面间切换时不会重新挂载 */}
      <nav>
        <Link href="/layouts/nested">嵌套布局</Link>
        <Link href="/layouts/pricing">路由组布局</Link>
      </nav>
      {children}
    </div>
  )
}
```

#### 示例 C：嵌套布局（侧边栏 + 内容区）

```tsx
// demo/app/layouts/nested/layout.tsx
import NestedSidebar from "./sidebar"

export default function NestedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex" }}>
      <NestedSidebar />   {/* 属于布局，切换子页面时保持挂载 */}
      <div style={{ flex: 1 }}>{children}</div>  {/* 只有这里会更新 */}
    </div>
  )
}
```

侧边栏内部有一个输入框和一个计数器。在三个子页面之间来回切换，
它们的状态会保留下来——这就是「布局不被销毁」最直观的证明。
代码见 `demo/app/layouts/nested/sidebar.tsx`。

#### 示例 D：路由组 + 独立布局

```tsx
// demo/app/layouts/(marketing)/layout.tsx
// (marketing) 不出现在 URL 里，但组内页面都会套上这个布局

export default function MarketingGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      {children}
    </div>
  )
}
```

打开 `/layouts/pricing` 观察一下：外面的虚线框导航来自祖先布局，
里面那个白底居中卡片来自这个分组布局。**两层布局是叠加生效的**。

#### 示例 E：template 的写法

```tsx
// demo/app/layouts/template-demo/template.tsx
"use client"   // 下一章会讲，这里先照写

export default function TemplateDemo({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>
}
```

写法跟 layout 一模一样，行为却相反：它每次导航都会重新挂载。
demo 里的这个 template 放了一个计数器，切一下页面就归零。

> **小结：**Layout 的持久化特性是 Next.js 导航体验的核心。它让你用组件化的方式管理页面壳层，不需要引入状态管理库，也不需要手写路由守卫——框架帮你做好了。

<a id="ch-04"></a>

## 第 4 章 · 服务端组件 vs 客户端组件

这一章要解决的疑问是：**我写的这段组件代码，到底跑在哪里？**
答案决定了你能不能用 `useState`、能不能安全地读数据库、
以及这段代码会不会被下载到用户的手机上。

> **配套可运行代码：**本章在 demo 的 `/server-client` 路由下，
> 共四个页面。执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/server-client`。详细说明见 `demo/README.md`。

### 1. 一条规则：默认全在服务端

在 App Router 里，判断标准简单到只有一句话：

```
文件顶部有 "use client" 吗？
   ├── 没有  →  服务端组件（Server Component）   ← 默认
   └── 有    →  客户端组件（Client Component）
```

注意「默认」这两个字。你在第一到第三章写的所有 `page.tsx`、
`layout.tsx`，全都是服务端组件——哪怕你没意识到。
它们没有 `useState`，没有事件监听，只是在服务器上把 JSX
变成 HTML 发出去，然后就结束了。

> **这个默认值和很多人直觉相反。**如果你写过纯 React 单页应用，
> 默认是「一切都在浏览器里跑」。Next.js 把这个默认值反过来了：
> 先在服务器上渲染，只有你明确要求，才把代码发到浏览器。

### 2. 对比表

| 对比项 | 服务端组件（默认） | 客户端组件（"use client"） |
|---|---|---|
| **能用 useState / onClick 吗** | 不能，会直接报错 | 能 |
| **能直接 await 取数据吗** | 能，组件本身可以是 async | 不能，得用 useEffect 或 use() |
| **代码会发给浏览器吗** | 不会，只发渲染结果 | 会，整份代码都在 JS 包里 |
| **能读数据库 / 密钥吗** | 能，很安全 | 不能，等同于公开发布 |
| **能渲染对方吗** | 能渲染客户端组件 | 不能 import 服务端组件 |
| **能用浏览器 API 吗** | 不能（没有 window） | 能 |

### 3. 服务端组件能做什么

一个服务端组件最大的本事，是它可以是一个 `async` 函数，
里面直接 `await`：

```tsx
// app/server-client/server-demo/page.tsx
// 没有 "use client" —— 所以它是服务端组件

import { getDashboardData } from "../server-data"

export default async function ServerDemoPage() {
  const data = await getDashboardData()   // 直接 await，不需要 useEffect

  return <p>渲染时间：{data.generatedAt}</p>
}
```

对比一下客户端组件的写法：要先 `useState` 存数据、再
`useEffect` 里发请求、还要处理「加载中」和「出错」两种状态。
服务端组件把这些都省掉了——数据在渲染之前就已经拿到了。

#### 更重要的：敏感代码天然不外泄

服务端组件的代码**不会**出现在浏览器的 JS 包里。
这意味着你可以放心地在里面写数据库查询、使用 API 密钥：

```ts
// app/server-client/server-data.ts —— 只有服务端会执行这个文件
const INTERNAL_TOKEN = "srv_9f3a91c4"   // 相当于数据库密码

export async function getDashboardData() {
  await new Promise((r) => setTimeout(r, 120))  // 模拟数据库查询
  return { token: INTERNAL_TOKEN, ... }
}
```

> **如果这段代码写在客户端组件里，会怎样？**
> 整个文件会被打包进 JS，任何人打开开发者工具都能看到
> `INTERNAL_TOKEN` 的字面值。密钥就公开了。
>
> 这是初学者最容易犯、后果最严重的错误之一。**凡是涉及密钥、
> 数据库、内部接口的代码，都必须留在服务端组件里。**

### 4. 客户端组件什么时候必须用

只有三类场景需要 `"use client"`：

1. **需要状态或事件**：`useState`、`useReducer`、
      `onClick`、`onChange`；
2. **需要浏览器 API**：`window`、`localStorage`、
      `IntersectionObserver`、`navigator`；
3. **需要依赖这些的第三方库**：大多数动画库、图表库、UI 组件库。

```tsx
// app/server-client/counter.tsx
"use client"   // 这一行把它变成客户端组件

import { useState } from "react"

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>点了 {count} 次</button>
}
```

### 5. "use client" 划的是边界，不是标签

这是最容易理解错的一点。`"use client"` 不是给某个组件贴个标签，
而是**划出一条边界**：

```
"use client" 所在的文件
   ↓ 它 import 的所有模块
   ↓    ↓ 那些模块 import 的模块
   ↓    ↓    ↓ ...
   └────┴────┴──► 全部都是客户端代码，全部会被打包进浏览器
```

也就是说，一旦某个文件加了 `"use client"`，它导入的
整个依赖树都会跟着变成客户端代码。所以：

> **实践原则：把 `"use client"` 尽量往下放。**
> 不要图省事在根布局或页面顶层加——那样整个页面连同它引用的所有组件、
> 样式、工具函数都会被打包进 JS，白白增加体积。
> 正确做法是把需要交互的那一小块抽出来，只给它加这行。

### 6. 一个被广泛误解的点

> **「客户端组件」不等于「只在客户端渲染」。**
>
> 客户端组件同样会先在服务器上渲染成 HTML（Next.js 会做「预渲染」），
> 然后再把 JS 发到浏览器，让它在那边「激活」（hydrate）一次——
> 之后点击、输入才有反应。
>
> 所以：刷新页面时，客户端组件的内容**一开始就在 HTML 里**，
> 不是先空白再出现。真正「先空白再出现」的是第一章讲的 CSR 模式
> （数据在浏览器里才去取）。

这两件事经常被混为一谈：

| | 含义 |
|---|---|
| **"use client"** | 组件**代码**要发到浏览器去执行。首次 HTML 仍然由服务器生成。 |
| **CSR（第一章）** | 页面**内容**要等浏览器里的 JS 跑完才出现。 |

### 7. 两者怎么配合

真实项目里的典型结构是：**外层服务端组件负责取数据和排版，
内层客户端组件负责交互**。

```tsx
// app/server-client/client-demo/page.tsx —— 外层是服务端组件
import Counter from "../counter"   // 内层是客户端组件

export default function ClientDemoPage() {
  return (
    <main>
      <h1>客户端组件</h1>
      <Counter />   // 只有这一小块是客户端代码
    </main>
  )
}
```

#### 传参规则：必须可序列化

服务端组件往客户端组件传的 props，要能跨网络传输，所以必须可序列化：

- ✅ 可以传：字符串、数字、布尔、数组、普通对象、`Date`、`null`
- ❌ 不能传：函数、类实例、`Symbol`

```tsx
// ✅ 可以：传普通数据
<Counter initial={42} />

// ❌ 不行：函数无法序列化
<Counter onDone={() => console.log("完成")} />
```

#### children 插槽：让客户端组件包住服务端内容

客户端组件不能 `import` 服务端组件，但可以通过 `children`
接收已经渲染好的服务端内容：

```tsx
// 外层是可交互的客户端组件（比如一个折叠面板）
<Collapsible>
  {/* 里面放的却是服务端组件——它在服务端渲染好，
      作为 children 传进去，不需要变成客户端代码 */}
  <ServerRenderedChart />
</Collapsible>
```

这个模式非常有用：一个交互容器（客户端）可以装任意多个重量级的
服务端内容，而后者的代码一行都不会进入浏览器的 JS 包。

### 8. 代码示例与 demo 对照

> **本章 demo 路由：**`/server-client`
> - 总览 → `demo/app/server-client/page.tsx`
> - 服务端组件 → `demo/app/server-client/server-demo/page.tsx`
> - 客户端组件 → `demo/app/server-client/counter.tsx`
> - 组合使用 → `demo/app/server-client/composition/page.tsx`
> - 只跑在服务端的模块 → `demo/app/server-client/server-data.ts`

> **动手验证：**打开 `/server-client/server-demo`，
> 按 `Ctrl+U` 查看网页源代码，搜索 `srv_`——
> 你能找到那个 token，因为它被渲染进了 HTML。但打开开发者工具的
> Sources 面板搜同一个字符串，在 JS 文件里却搜不到它的定义，
> 因为 `server-data.ts` 根本没有被发给浏览器。

### 9. 小结

- **默认全是服务端组件**，加 `"use client"` 才变成客户端组件。
- 服务端组件能 `async/await`、能读密钥、代码不进 JS 包；但不能用 hooks 和事件。
- 客户端组件能交互、能用浏览器 API；但代码会全部打包发到浏览器。
- `"use client"` 划的是**边界**，会沿着 import 树向下传染，
      所以要尽量往叶子节点放。
- 客户端组件**也会**被服务端预渲染——它跟第一章的 CSR 不是一回事。
- 服务端往客户端传的 props 必须可序列化。
- 用 `children` 插槽可以让客户端组件包住服务端内容。

下一章讲怎么在服务端组件里取数据，以及「取到的数据要不要缓存」。

<a id="ch-05"></a>

## 第 5 章 · 服务端数据获取

上一章讲了服务端组件可以 `await`。这一章就专门讲怎么 `await`：
数据从哪来、要不要缓存、怎么避免把接口调用写成一条慢吞吞的流水线。

> **配套可运行代码：**本章在 demo 的 `/data-fetching` 路由下，
> 另有一个模拟的第三方接口 `/api/weather`。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/data-fetching`。

### 1. 最自然的写法：组件直接 await

先把「应该怎么写」和「以前怎么写」放在一起对比，差别一目了然。

#### 以前（客户端组件）：三套状态要自己管

```tsx
"use client"
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  fetch("/api/weather")
    .then((r) => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false))
}, [])

if (loading) return <p>加载中…</p>
if (error) return <p>出错了</p>
```

#### 现在（服务端组件）：一行

```tsx
// app/data-fetching/page.tsx
export default async function Page() {
  const res = await fetch(url, { cache: "no-store" })
  const weather = await res.json()

  return <p>{weather.city}：{weather.temp}°C</p>
}
```

三件事同时消失了：不需要 `useState`、不需要 `useEffect`、
**也不需要「加载中」这个状态**。

> **为什么没有「加载中」？**
> 因为取数发生在渲染之前。数据没到手，HTML 就还没开始生成。
> 浏览器拿到的是已经带着数据的完整页面，自然不会经历「先空后满」。
> 
> 那如果取数很慢、用户要干等怎么办？那是第七章
> `loading.tsx` 要解决的问题——它管的是「服务器忙的时候先给用户看点东西」，
> 和「页面渲染出来之后再去补数据」是两码事。

### 2. 数据可以从哪来

| 来源 | 写法 | 说明 |
|---|---|---|
| **自己的数据库** | `const posts = await db.post.findMany()` | 最常见。服务端组件里直接调用，不需要 API 层 |
| **外部接口** | `await fetch("https://api.xxx.com/...")` | 直接写绝对地址 |
| **自己的 API 路由** | ``await fetch(`${base}/api/xxx`)`` | 多数情况下**不需要**这样做，绕了一圈还多一次网络开销 |

第二种是本节的 demo 用的方式——因为 demo 需要一个「外部数据源」，
而这个数据源恰好就实现在同一个项目里。

> **一个值得记住的建议：**如果你在用 App Router，
> 通常**不需要**为了给自己的页面取数而专门写 API 接口。
> 服务端组件的代码本来就不会发到浏览器，直接在里面查数据库既安全又少一跳网络。
> API 接口（第九章）更适合给「外部调用」或「客户端组件」用。

### 3. 缓存：三种 fetch 选项

取到的数据要不要缓存、缓存多久，是靠 `fetch` 的第二个参数控制的。

| 写法 | 行为 | 适用 |
|---|---|---|
| `{ cache: "no-store" }` | 不缓存，每次请求都真的去调 | 实时数据 |
| `{ next: { revalidate: 10 } }` | 缓存 10 秒，期间复用 | 允许略有延迟的数据 |
| `{ cache: "force-cache" }` | 永久缓存，直到构建/手动失效 | 几乎不变的数据 |
| 什么都不写 | 等同于 `no-store` | — |

> **最后一行是这一章最容易踩的坑。**
> 如果你看过一些旧教程，可能会记得「Next.js 默认缓存 fetch」。那是
> **Next.js 14 及以前**的行为。
> 
> 从 **Next.js 15 开始，默认值反过来了：不写就等于不缓存。**
> 想启用缓存必须显式写出 `next: { revalidate: N }`。
> 这个变化让很多照着旧文章写的代码「变快了但变旧了」，值得记一下。

#### 缓存带来的一个副作用

注意一个连带效果：一旦页面里出现了 `no-store`，
**整个页面就变成动态渲染**（第一章讲的 SSR）——因为每次请求结果都可能不同，
没法在构建时算出来。反过来，如果所有 fetch 都是缓存的，
这个页面就能被静态化。

> **如果数据不是 fetch 来的呢？**
> 比如直接查数据库，那 `fetch` 的选项就管不着了。两个办法：
> 
> - 用 `unstable_cache` 把任意函数包起来缓存；
> - 用路由段配置 `export const revalidate = 10` 控制整个页面的再生周期
>   （第一章讲 ISR 时用过）。

### 4. 别把请求写成流水线

这是实际项目里最容易忽视的性能问题。多个 `await` 排成一排时，
它们是**一个等一个**的：

```
【串行】总耗时 = 三次相加

  ├── 请求 A (300ms) ──┤
                        ├── 请求 B (300ms) ──┤
                                              ├── 请求 C (300ms) ──┤
  总耗时 ≈ 900ms

【并行】总耗时 = 最慢的那一个

  ├── 请求 A (300ms) ──┤
  ├── 请求 B (300ms) ──┤
  ├── 请求 C (300ms) ──┤
  总耗时 ≈ 300ms
```

```tsx
// ❌ 串行：等完第一个才开始第二个
const a = await getWeather(url)
const b = await getWeather(url)
const c = await getWeather(url)

// ✅ 并行：三个同时发出
const [a, b, c] = await Promise.all([
  getWeather(url),
  getWeather(url),
  getWeather(url),
])
```

> **什么时候不能并行？**当后一个请求依赖前一个的结果时。
> 例如先查用户 id、再拿 id 查订单，就只能串行。
> 判断标准很简单：**这几次请求之间有没有依赖关系**。

#### 更隐蔽的一种串行：嵌套组件

除了写在同一个函数里的 `await`，还有一种瀑布流来自于组件嵌套：

```
<Parent>  await 取数据（300ms）
   └── <Child>  再 await 取数据（300ms）

父组件要等自己的数据到手，才开始渲染子组件；
子组件再发起自己的请求。总耗时 600ms。
```

解决办法是在中间插入 `<Suspense>` 边界，
让子组件的数据请求先发出去、稍后再把结果填进来。这就是「流式渲染」，
第八章讲导航与加载时会展开。

### 5. 与第一章的关系

回头看第一章的那张表，现在应该能对上了：

| 页面里的取数方式 | 等价于第一章的 |
|---|---|
| 所有 fetch 都带缓存（revalidate / force-cache） | **SSG** 或 **ISR** |
| 任意一个 fetch 是 no-store | **SSR**（动态渲染） |
| 数据在客户端组件里用 useEffect 取 | **CSR** |

也就是说，「渲染策略」不是另外学的一套东西，它就是取数方式的自然结果。
你不用刻意去选，写完之后怎么取数，就决定了它是什么。

### 6. 代码示例与 demo 对照

> **本章 demo 路由：**`/data-fetching`
> 
> - 直接取数据 → `demo/app/data-fetching/page.tsx`
> - 缓存控制 → `demo/app/data-fetching/caching/page.tsx`
> - 串行 vs 并行 → `demo/app/data-fetching/parallel/page.tsx`
> - 模拟的第三方接口 → `demo/app/api/weather/route.ts`
> - 绝对地址辅助函数 → `demo/app/data-fetching/api-url.ts`

> **动手验证：**
> 
> 1. 打开 `/data-fetching/caching`，连续快速刷新。
>    你会看到 `no-store` 和「什么都不写」两张卡片的时间戳一直在变，
>    而 `revalidate: 10` 那张 10 秒内纹丝不动。
> 2. 打开 `/data-fetching/parallel`，
>    对比页面上打出的两个耗时数字——一个约 900ms，一个约 300ms。

### 7. 小结

- 服务端组件里**直接 await** 取数，不需要 useState / useEffect。
- 取数在渲染之前完成，所以**不存在「加载中」状态**。
- 给自己的页面取数通常**不需要**写 API 接口，直接调数据模块。
- 缓存由 fetch 选项控制：`no-store` / `revalidate` / `force-cache`。
- **Next.js 15 起 fetch 默认不缓存**，要缓存必须显式声明。
- 没有依赖关系的请求要用 `Promise.all` 并行，避免瀑布流。
- 取数方式决定了渲染策略：全缓存 → SSG/ISR，有 no-store → SSR。

下一章讲动态路由——让一个 `page.tsx` 接住成千上万个不同的 URL。

<a id="ch-06"></a>

## 第 6 章 · 动态路由

第二章讲的路由是「一个文件夹 = 一个固定 URL」。但如果有一万篇文章，
总不能建一万个文件夹。动态路由就是来解决这个问题的：
**用一个文件夹接住一整类 URL**。

> **配套可运行代码：**本章在 demo 的 `/dynamic-routes` 路由下。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/dynamic-routes`。

### 1. 方括号表示「这一段是变化的」

把文件夹名用方括号包起来，它就变成一个占位符：

```
app/dynamic-routes/blog/[slug]/page.tsx

  匹配：
    /dynamic-routes/blog/hello-nextjs   →  slug = "hello-nextjs"
    /dynamic-routes/blog/abc            →  slug = "abc"
    /dynamic-routes/blog/任意东西        →  slug = "任意东西"
```

无论这一层是什么值，都会交给同一个 `page.tsx` 处理。
页面里通过 `params` 把这个值读出来，再去查对应的数据。

> **方括号里的名字是随意的。**`[slug]`、`[id]`、
> `[name]`、`[category]` 效果完全一样——它只是你稍后
> 读取这个值时用的变量名。有意义的命名是为了让代码好读，
> 框架本身不关心你叫什么。

### 2. 三种动态段写法

| 写法 | 匹配 | 拿到的值 |
|---|---|---|
| `[slug]` | 恰好一段 | 字符串，如 `"hello"` |
| `[...slug]` | 一段或多段 | 数组，如 `["数码", "耳机"]` |
| `[[...slug]]` | 零段或多段 | 数组，或 `undefined`（零段时） |

照例对比一下文件夹和 URL：

```
app/dynamic-routes/shop/[...slug]/page.tsx

  /dynamic-routes/shop/数码               → slug = ["数码"]
  /dynamic-routes/shop/数码/耳机          → slug = ["数码", "耳机"]
  /dynamic-routes/shop/数码/耳机/降噪     → slug = ["数码", "耳机", "降噪"]
  /dynamic-routes/shop                   → 404（因为至少要有一段）
```

把 `[...slug]` 改成 `[[...slug]]`，最后一行就不会 404 了，
此时 `slug` 的值是 `undefined`。这叫**可选 catch-all**。

### 3. 读取参数：params 现在是 Promise

> **这是 Next.js 15 的一个破坏性变化，很多旧教程还是老写法。**
> 
> 以前：`params.slug` 可以直接用。
> 现在：`params` 是一个 **Promise**，必须先 `await`。
> 直接取属性会报错。

```tsx
// app/dynamic-routes/blog/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>   // 类型就是 Promise
}) {
  const { slug } = await params          // 必须 await

  const post = getPost(slug)
  if (!post) notFound()                 // 查不到就 404

  return <h1>{post.title}</h1>
}
```

同样的变化也发生在 `searchParams`、`cookies()`、
`headers()` 上——它们现在都是异步的。这不是为了让代码变啰嗦，
而是为了让框架能够更精确地判断哪些页面必须动态渲染（因为它们依赖了「本次请求」的信息）。

#### 查不到数据怎么办：notFound()

```tsx
import { notFound } from "next/navigation"

const post = getPost(slug)
if (!post) {
  notFound()   // 中断渲染，返回 404 页面
}
```

它和「返回一个写着 404 的页面」不同：`notFound()` 会真正把
HTTP 状态码设成 404，并且渲染最近的 `not-found.tsx`
（这个文件在第七章细讲）。对搜索引擎和监控系统来说，这个区别很重要。

### 4. generateStaticParams：把动态路由静态化

动态路由默认是「按需渲染」的——用户第一次访问某个 slug 时，
服务器才去渲染。但如果你事先知道所有可能的 slug，
可以在构建时就把它们全部预生成成静态 HTML：

```tsx
// app/dynamic-routes/blog/[slug]/page.tsx
export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }))
  // 返回 [{ slug: "hello-nextjs" }, { slug: "file-based-routing" }, ...]
}
```

它的作用可以这样理解：**把「一个动态路由」在构建时展开成
「一批静态页面」**。这正是第二章 build 输出里看到的
`○ (Static)` 是怎么来的——如果一个动态路由提供了
`generateStaticParams`，它的那些具体路径都会变成静态页面。

|  | 不写 generateStaticParams | 写了 |
|---|---|---|
| **构建产物** | 只有一个动态路由 | 每个 slug 一个静态 HTML |
| **首次访问速度** | 需要现场渲染 | 直接返回现成文件，最快 |
| **适合** | 内容太多或经常新增 | 内容有限且可枚举（文章、商品） |

#### 没预生成的 slug 会怎样？

默认情况下（`dynamicParams` 为 `true`），
用户访问一个没在 `generateStaticParams` 里列出的 slug 时，
Next.js 会**当场渲染**它，而不是返回 404。
也就是说「预生成的那批走静态，剩下的一律按需渲染」——两全其美。

如果你希望只有预生成的 slug 才能访问，其他一律 404，就加上：

```tsx
export const dynamicParams = false
```

#### 和 ISR 配合

两者可以叠加。这样一个「内容很多、但偶尔会变」的站点就成立了：

```tsx
// 构建时预生成最热门的 100 篇；其余按需渲染
export function generateStaticParams() {
  return topPosts.map((p) => ({ slug: p.slug }))
}

// 每个页面缓存 1 小时，过期后后台再生（第一章的 ISR）
export const revalidate = 3600
```

### 5. 路由优先级

当静态路由和动态路由都能匹配同一个 URL 时，Next.js 优先选更具体的那个：

```
app/dynamic-routes/blog/[slug]/page.tsx
app/dynamic-routes/blog/new/page.tsx        ← 手写的具体页面

访问 /dynamic-routes/blog/new
   → 命中 blog/new/page.tsx（静态优先于动态）
```

这条规则很实用：你可以用动态路由兜住绝大多数情况，
再为少数几个特殊页面单独写静态路由，不必在动态页面里写一堆 if 分支。

### 6. 代码示例与 demo 对照

> **本章 demo 路由：**`/dynamic-routes`
> 
> - 总览 → `demo/app/dynamic-routes/page.tsx`
> - 单段动态路由 → `demo/app/dynamic-routes/blog/[slug]/page.tsx`
> - 多段 catch-all → `demo/app/dynamic-routes/shop/[...slug]/page.tsx`
> - 模拟数据 → `demo/app/dynamic-routes/data.ts`

> **动手验证：**
> 
> 1. 打开 `/dynamic-routes/blog/hello-nextjs`，
>    页面上会打印出它从 URL 里拿到的 `params.slug`。
> 2. 把 slug 改成不存在的内容，会得到 404——`notFound()` 生效了。
> 3. 打开 `/dynamic-routes/shop/数码/耳机/降噪`，
>    再手动在地址栏后面继续加层级，看「共 N 段」怎么变。

### 7. 小结

- `[slug]` 单段动态路由，`[...slug]` 多段 catch-all，
  `[[...slug]]` 可选 catch-all。
- 方括号里的名字随便取，只是变量名。
- **`params` 现在是 Promise，必须 `await`**
  （Next.js 15 起；`searchParams`、`cookies()`、
  `headers()` 同理）。
- 数据查不到时用 `notFound()` 返回真正的 404。
- `generateStaticParams` 把动态路由在构建时展开成一批静态页面。
- 没预生成的 slug 默认按需渲染；加 `dynamicParams = false`
  可让它们直接 404。
- 静态路由优先于动态路由。

下一章讲页面加载和出错时该给用户看什么——`loading.tsx`、
`error.tsx`、`not-found.tsx`。

<a id="ch-07"></a>

## 第 7 章 · 加载状态与错误处理

第五章说过：服务端组件取数据时没有「加载中」状态。这省了事，
但用户等待的那几秒、数据出错的那一刻、页面找不到的时候，总得给点交代。
这一章讲的就是这三个「总得」——三个约定文件搞定。

> **配套可运行代码：**本章在 demo 的 `/loading-and-error` 路由下。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/loading-and-error`。

### 1. 三个文件，各管一件事

| 文件 | 什么时候出现 | 本质 |
|---|---|---|
| `loading.tsx` | 页面还在服务器上渲染时 | 自动套上的 `<Suspense>` 边界 |
| `error.tsx` | 渲染过程中抛出错误时 | React 的错误边界 |
| `not-found.tsx` | 调用了 `notFound()`，或 URL 匹配不上 | 404 页面 |

它们的作用范围和 `layout.tsx` 完全一致——**放在哪一层，
就管哪一层及以下**。所以「全站统一的 404」放在 `app/not-found.tsx`，
而文档专区自己的 404 放在 `app/docs/not-found.tsx`。

##### 渲染时的嵌套顺序

```
app/layout.tsx                  ← 最外层
 └─ loading.tsx    (Suspense)   ← 页面没渲染好时，先显示它
     └─ error.tsx  (ErrorBoundary)
         └─ page.tsx             ← 真正的内容

如果某一层出错，错误会向上找最近的 error.tsx；
如果某一层卡住，用户会先看到最近的 loading.tsx。
```

### 2. loading.tsx：等待时看什么

只要文件夹里存在 `loading.tsx`，Next.js 就自动把页面包进
`<Suspense>`：

```tsx
// Next.js 内部做的等价操作
<Suspense fallback={<Loading />}>
  <Page />   {/* 还在等数据的那个页面 */}
</Suspense>
```

页面渲染完成后，骨架屏会被真正的内容替换掉。整个过程是**流式**的：
服务器不需要等整页都准备好才发送，而是先把外层和骨架屏发过去，
数据到了再把内容补进去。

#### 放骨架屏，别放转圈图标

这个文件里通常放**骨架屏（skeleton）**——结构和真实内容相似，
但内容是灰色占位块。它比一个居中转圈图标好，因为用户能提前知道
「内容大概会出现在哪、有多少」，等待时的焦虑感明显更低。

```tsx
// app/loading-and-error/slow/loading.tsx
export default function Loading() {
  return (
    <div>
      <h1>慢页面</h1>
      {/* 三块灰色占位，模拟数据卡片 */}
      <div className="grid">
        {[0, 1, 2].map((i) => <div key={i} className="skeleton" />)}
      </div>
    </div>
  )
}
```

> **为什么你的 loading.tsx 好像没生效？**最常见的原因是
> **这个页面被静态化了**。
> 
> 静态页面在构建时就生成好了，运行时根本不需要等待，
> 自然也就没有「加载中」这个阶段可显示。
> 
> `loading.tsx` 只在**页面需要现场渲染**
> （也就是第一章说的动态渲染 / SSR）时才有意义。
> 在 demo 里我们给慢页面加了 `export const dynamic = "force-dynamic"`
> 就是为了保证这一点。

### 3. error.tsx：出错时看什么

> **两条硬性要求，少一条就不生效：**
> 
> 1. 文件顶部必须写 `"use client"`；
> 2. 必须接收 `error` 和 `reset` 两个 props。

```tsx
// app/loading-and-error/error-demo/error.tsx
"use client"                    // 必须是客户端组件

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void                // 点一下「重试」用的函数
}) {
  return (
    <div>
      <h2>出错了</h2>
      <p>{error.message}</p>
      <button onClick={reset}>重试</button>
    </div>
  )
}
```

#### 它能抓到什么样的错误？

> **只有渲染期间抛出的错误。**
> 如果你在 `onClick` 或 `setTimeout` 的回调里
> `throw`，错误边界是抓不到的——React 的错误边界不处理
> 事件回调里的异常。
> 
> 所以 demo 里那个按钮的做法是：点击 → 改变 state →
> **在一次新的渲染中**抛错 → 被捕获。

#### 出错的范围有多小？

由于 `error.tsx` 只替换它所在的那一段，布局和兄弟节点不受影响。
demo 里可以清楚看到：出错之后，本章的导航栏还在，只有内容区变成了错误提示。
这就是把它放在「合适的层级」的价值——你肯定不希望「侧边栏里一个小组件崩了，
整个页面全白」。

#### 根布局自己出错怎么办

`app/error.tsx` 抓不到 `app/layout.tsx` 自身的错误
（因为错误边界不能捕获它外层的组件）。这种情况要用
`app/global-error.tsx`——它必须自己渲染
`<html>` 和 `<body>`，
毕竟此时根布局已经失效了。

### 4. not-found.tsx：找不到时看什么

两种触发方式：

1. 页面里**主动调用** `notFound()`——数据查不到了，
   与其渲染一个空页面，不如明确告诉用户「没有」；
2. 用户访问了一个**根本没有对应文件夹**的 URL。

```tsx
import { notFound } from "next/navigation"

export default async function PostPage({ params }) {
  const post = getPost(slug)
  if (!post) {
    notFound()   // 中断渲染，找最近的 not-found.tsx
  }
  ...
}
```

> **别把 404 写成「返回一个说找不到的页面」。**
> 
> `return <p>找不到</p>` 会返回 HTTP **200**
> ——意思是「一切正常，这就是内容」。搜索引擎会把这个不存在的页面
> 当成正常内容收录，监控系统也不会报错，问题被悄悄掩盖。
> 
> 而 `notFound()` 会真正返回 **404** 状态码。
> 这是本章最值得记住的一个细节。

### 5. 放在哪一层，是个设计决定

三个文件都遵循「就近原则」：出错或等待时，向上找**最近的**那一份。
这给了你按区域定制的空间：

```
app/
├── not-found.tsx                全站 404（通用文案）
├── error.tsx                    全站兜底错误页
│
├── docs/
│   ├── not-found.tsx            文档区 404（带搜索框和目录索引）
│   └── [slug]/
│       ├── loading.tsx          文章页的阅读骨架
│       └── page.tsx
│
└── admin/
    └── error.tsx                后台专用错误页（带联系运维的按钮）
```

> **一条实践建议：**不要只在根目录放一份了事。
> 电商的「商品不存在」和后台的「订单不存在」，用户该看到的提示完全不同。
> 按业务分区各放一份，比在一个全局页面里写一堆判断要好维护得多。

### 6. 代码示例与 demo 对照

> **本章 demo 路由：**`/loading-and-error`
> 
> - 慢页面（2 秒）→ `demo/app/loading-and-error/slow/page.tsx`
> - 骨架屏 → `demo/app/loading-and-error/slow/loading.tsx`
> - 错误演示页 → `demo/app/loading-and-error/error-demo/page.tsx`
> - 会抛错的组件 → `demo/app/loading-and-error/error-demo/broken.tsx`
> - 错误边界 → `demo/app/loading-and-error/error-demo/error.tsx`
> - 404 页面 → `demo/app/loading-and-error/not-found.tsx`

> **动手验证：**
> 
> 1. 打开 `/loading-and-error/slow`——先看到灰色骨架屏，2 秒后变成真实内容。
> 2. 打开 `/loading-and-error/error-demo`，点那个红色按钮——
>    内容区被替换成错误提示，但上方导航还在。点「重试」即可恢复。
> 3. 打开 `/loading-and-error/not-found-demo`，点页面里的链接触发 404。
>    打开开发者工具的 Network 面板，确认这个请求的状态码是 **404**，
>    而不是 200。

### 7. 小结

- `loading.tsx` 是自动套上的 Suspense 边界，
  **只在页面需要现场渲染时才有效**——静态页面用不上它。
- 加载状态放骨架屏，别放转圈图标。
- `error.tsx` 必须是客户端组件，接收 `error`
  和 `reset`；只捕获**渲染期**错误。
- 根布局自身的错误要用 `global-error.tsx`。
- 用 `notFound()` 而不是自己渲染一个「找不到」的页面，
  这样才能返回真正的 404 状态码。
- 三个文件都可以分层放置，按业务区域定制提示内容。

下一章讲导航——`<Link>`、`useRouter`、
以及怎么知道「我现在在哪个路由上」。

<a id="ch-08"></a>

## 第 8 章 · 导航与路由感知

页面之间怎么跳、跳的时候怎么不丢状态、以及「怎么知道我现在在哪个路由上」。
这三件事在 Next.js 里都有专门的工具，而且都来自同一个模块：
`next/navigation`。

> **配套可运行代码：**本章在 demo 的 `/navigation` 路由下。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/navigation`。

### 1. 为什么不能用 \<a\>

原生 `<a href>` 会让浏览器做一次**整页刷新**：
重新请求 HTML、重新下载 JS、重新挂载所有组件、清空所有状态。

```
用 <a href="/other"> 跳转
   → 浏览器丢弃整个页面
   → 重新下载 HTML + JS
   → 所有组件重新挂载，useState 全部归零
   → 滚动位置丢失

用 <Link href="/other"> 跳转
   → 只替换变化的那部分（第三章讲的「布局不销毁」）
   → 布局和共享状态原封不动
   → 切过去几乎瞬间完成
```

> **规则很简单：在 App Router 里，页面之间的跳转一律用
> `<Link>`，见到 `<a>` 就换掉。**
> 
> 唯一的例外是跳到站外（`https://...`）或下载文件——
> 那种情况本来就该用 `<a>`。

### 2. \<Link\> 的三种常用选项

```tsx
import Link from "next/link"

// ① 最普通
<Link href="/about">关于</Link>

// ② replace：不新增历史记录，后退回不来
<Link href="/dashboard" replace>进入后台</Link>

// ③ scroll=false：跳转后不自动滚到顶部
<Link href="/list?page=2" scroll={false}>下一页</Link>
```

| 选项 | 什么时候用 |
|---|---|
| `replace` | 不希望用户后退回来：登录成功后跳转、表单提交后跳结果页 |
| `scroll={false}` | 分页、锚点跳转——不想让页面滚回顶部 |
| `prefetch={false}` | 关掉预加载。默认是开的，一般不需要关 |

#### 关于「预加载」

> **这是 `<Link>` 最值钱的地方。**
> 在生产环境里，只要一个链接进入视口，Next.js 就会悄悄把目标路由的
> 代码和数据提前取回来。用户真正点下去的时候，页面几乎是瞬间出现的。
> 
> 所以有时候你会觉得「本地开发时跳转有点慢，线上却很快」——
> 因为**开发模式关闭了预加载**，为的是保证热更新及时。
> 看到这种差异不用担心，是正常的。

### 3. 三种跳转方式，别用错

| 方式 | 发生在哪 | 典型场景 |
|---|---|---|
| `<Link>` | 浏览器，用户点击时 | 导航菜单、文章列表、任何「用户主动点」的跳转 |
| `router.push()` | 浏览器，代码触发时 | 「提交成功后跳走」「点击按钮跳转」 |
| `redirect()` | **服务器** | 权限校验、旧地址迁移。页面根本不会渲染 |

#### useRouter：代码里主动跳转

```tsx
"use client"   // useRouter 是客户端 Hook
import { useRouter } from "next/navigation"

const router = useRouter()

router.push("/dashboard")     // 跳转，新增一条历史记录
router.replace("/dashboard")  // 跳转，替换当前历史记录
router.back()                  // 后退一步
router.refresh()               // 不跳转，重新向服务器取当前页的数据
```

`refresh()` 比较特别：它不改变 URL，只是让服务端组件重新执行一遍。
用在「列表里新增了一条数据，想让它立刻出现」这种场景。

#### redirect：服务器直接改地址

```tsx
// 服务端组件里——注意没有 "use client"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")   // 服务器返回 307，页面内容一帧都不渲染
  }

  return <div>管理后台</div>
}
```

> **权限校验必须用 `redirect()`，不能用 `router.push()`。**
> 
> 因为 `router.push()` 发生在浏览器里——那时候页面**已经渲染出来了**，
> 用户可能已经瞥见了一眼受保护的内容。而 `redirect()` 在服务器上就切断了，
> 浏览器压根拿不到那个页面的 HTML。

### 4. 路由感知：我在哪？

四个 Hook 回答「当前路由是什么」，全部来自 `next/navigation`，
且都是客户端 Hook（必须在 `"use client"` 组件里用）：

| Hook | 回答什么问题 |
|---|---|
| `usePathname()` | 当前路径是什么？→ 常用于导航高亮 |
| `useParams()` | 动态路由的参数是什么？（第六章的 `[slug]`） |
| `useSearchParams()` | 查询参数是什么？`?page=2` |
| `useRouter()` | 我要跳转 / 刷新 |

#### 典型用途：高亮当前页

```tsx
"use client"
import { usePathname } from "next/navigation"

export default function Nav() {
  const pathname = usePathname()

  return items.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      style={{ color: pathname === item.href ? "#0070f3" : "#333" }}
    >
      {item.label}
    </Link>
  ))
}
```

> **一个会直接导致构建失败的坑：**用了{" "}
> `useSearchParams()` 的组件，必须被 `<Suspense>` 包住，
> 否则 `npm run build` 会报错。
> 
> 原因：查询参数是「每次请求才有的信息」，而静态页面在构建时压根不知道它是什么。
> 加一层 Suspense，等于告诉框架「这部分等到了浏览器再渲染」。

```tsx
// ✅ 正确写法
<Suspense fallback={<p>加载中…</p>}>
  <RouterClient />   {/* 内部用了 useSearchParams */}
</Suspense>
```

### 5. 最大的一个坑：next/router 还是 next/navigation

> **App Router 里所有路由 Hook 都来自 `next/navigation`。**
> 
> `next/router` 是旧版 Pages Router 的入口，在 App Router 中使用
> 会得到 `undefined` 或直接报错。
> 
> 你搜到的大部分中文教程如果写的是{" "}
> `import { useRouter } from "next/router"`，
> 那说明它是 Pages Router 时代的——对 App Router 不适用。

```tsx
// ❌ App Router 里错误
import { useRouter } from "next/router"

// ✅ 正确
import { useRouter, usePathname, useParams, useSearchParams } from "next/navigation"
```

### 6. 代码示例与 demo 对照

> **本章 demo 路由：**`/navigation`
> 
> - Link 的四种用法 → `demo/app/navigation/links/page.tsx`
> - 导航高亮 → `demo/app/navigation/links/active-nav.tsx`
> - useRouter → `demo/app/navigation/router/router-client.tsx`
> - redirect() → `demo/app/navigation/redirect/page.tsx`
> - 被重定向到的页面 → `demo/app/navigation/redirected/page.tsx`

> **动手验证：**
> 
> 1. 打开 `/navigation/links`，点「用 replace 跳过去」，
>    然后按浏览器后退键——回不到 Link 那一页了。
> 2. 打开 `/navigation/router`，依次点 push 和 replace 按钮再后退，
>    感受两者在历史记录上的差别。
> 3. 打开 `/navigation/redirect`，点触发链接，
>    在 Network 面板里确认那个请求返回的是 **307**。

### 7. 小结

- 页面跳转用 `<Link>`，不要用 `<a>`。
- `<Link>` 在生产环境会预加载，开发模式关闭（所以本地感觉慢是正常的）。
- 常用选项：`replace`（不留历史）、`scroll={false}`（不滚顶部）。
- `useRouter()` 用于代码主动跳转：push / replace / back / refresh。
- `redirect()` 在服务端执行，页面完全不渲染——权限校验必须用它。
- 路由感知用 `usePathname` / `useParams` / `useSearchParams`。
- 用 `useSearchParams()` 的组件必须包在 `<Suspense>` 里。
- 所有路由 Hook 都来自 `next/navigation`，**不是** `next/router`。

下一章讲怎么给外部系统（或者客户端组件）提供数据接口——`route.ts`。

<a id="ch-09"></a>

## 第 9 章 · API 路由：route.ts

前面几章的取数都发生在服务端组件内部。但如果调用方是**外部系统**或者**浏览器里的客户端组件**，就需要一个真正的 HTTP 接口。App Router 用它自己的方式提供这件事：一个叫 `route.ts` 的文件。

> **配套可运行代码：**本章在 demo 的 `/route-handlers` 路由下，接口实现在 `/api/todos`。执行 `npm install && npm run dev` 后访问 `http://localhost:3000/route-handlers`。

### 1. 文件和 URL 的对应关系没变

定位接口用的还是那套文件夹规则，只是文件名换成了 `route.ts`：

```
app/api/todos/route.ts          →  /api/todos
app/api/todos/[id]/route.ts     →  /api/todos/1、/api/todos/2 ...

app/route-handlers/page.tsx     →  /route-handlers（这是页面）
```

区别在于**导出什么**：

| 文件 | 默认导出 / 具名导出 | 得到 |
|---|---|---|
| `page.tsx` | 默认导出一个 React 组件 | 一个网页 |
| `route.ts` | 导出 `GET` / `POST` / `PUT` / `DELETE` / `PATCH` 等函数 | 一个 HTTP 接口 |

> **一条硬性规则：同一个文件夹里，`route.ts` 和 `page.tsx` 不能共存。**因为它们会争抢同一个 URL——Next.js 不知道该给你一个网页还是一个接口，构建时会直接报错。

### 2. 一个最小的接口

```ts
// app/api/todos/route.ts
import { NextResponse } from "next/server"
import { listTodos } from "./store"

// GET /api/todos
export async function GET() {
  return NextResponse.json({ todos: listTodos() })
}

// POST /api/todos
export async function POST(request: Request) {
  const body = await request.json()      // 读请求体

  if (!body.title) {
    return NextResponse.json({ error: "title 不能为空" }, { status: 400 })
  }

  return NextResponse.json({ todo: createTodo(body.title) }, { status: 201 })
}
```

几个要点：

- 函数名就是 HTTP 方法名，**必须大写**。没导出的方法会自动返回 405。
- 返回一个 `Response` 对象。`NextResponse.json()` 是最常用的帮手。
- 状态码通过第二个参数指定：`{ status: 201 }`。
- 函数是 `async` 的，因为读请求体、查数据库都是异步操作。

#### 动态参数也是 Promise

```ts
// app/api/todos/[id]/route.ts
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },   // 同样是 Promise
) {
  const { id } = await params
  ...
}
```

和第六章页面里的变化完全一致——Next.js 15 起，所有「跟本次请求绑定的东西」都变成了异步的。

### 3. 读请求、写响应

#### 读

| 要读什么 | 怎么写 |
|---|---|
| 请求体（JSON） | `const body = await request.json()` |
| 查询参数 | `new URL(request.url).searchParams.get("q")` |
| 请求头 | `request.headers.get("authorization")` |
| 动态路径参数 | `const { id } = await params` |
| Cookie | `(await cookies()).get("token")` |

#### 写

```ts
// 返回 JSON（最常用）
return NextResponse.json({ ok: true })

// 带状态码
return NextResponse.json({ error: "没找到" }, { status: 404 })

// 什么都不返回（比如删除成功）
return new NextResponse(null, { status: 204 })

// 返回纯文本
return new Response("hello")
```

> **状态码不是装饰。**调用方（可能是另一个服务、也可能是手机 App）完全依赖状态码来决定下一步：400 说明参数写错了、不要重试；404 说明资源不在了；500 说明服务端出问题、可以稍后重试。全都返回 200 再在 body 里写 `{ success: false }` 是常见的反面教材，会让所有调用方都难写。

### 4. 缓存：这次默认值也变了

> **Next.js 15 之前**，`route.ts` 里的 GET 默认会被静态化——也就是说你在构建时算出一个结果，之后所有人拿到的都是这一份。对于「增删改查」的接口来说这显然不合理，所以**从 15 开始，GET 默认改为动态，不再缓存。**

如果你确实希望某个 GET 接口被缓存，可以显式声明：

```ts
// 明确要缓存，每 60 秒再生
export const revalidate = 60

// 或者明确不缓存（现在这是默认值，写出来更清楚）
export const dynamic = "force-dynamic"
```

demo 里的接口都写了 `force-dynamic`，倒不是为了改变行为，而是让意图一目了然——一个会改数据的接口，读者一眼就该知道它不会被缓存。

### 5. 什么时候该写接口

这一章最容易犯的错，是「明明不需要接口却写了一个」。对照一下：

| 场景 | 该用什么 |
|---|---|
| 自己的页面要展示数据 | 服务端组件直接取（第五章）——**不要**写接口 |
| 表单提交、按钮触发写操作 | Server Actions（第十章）——通常比接口更省事 |
| 浏览器里的客户端组件要取数据 | 接口或 Server Actions 都行 |
| 外部系统要调用你的服务 | **必须用 `route.ts`** |
| 接收 Webhook、提供公开 API | **必须用 `route.ts`** |

> **一句话判断标准：调用方是不是「这个 Next.js 应用自己」？**
> 是 → 优先考虑服务端组件或 Server Actions，少一层网络开销。
> 不是（外部服务、第三方、手机端）→ 那就得有 `route.ts`。

### 6. 代码示例与 demo 对照

> **本章 demo 路径：**
> - 接口说明页 → `demo/app/route-handlers/page.tsx`
> - 调用接口的客户端组件 → `demo/app/route-handlers/todo-client.tsx`
> - 集合接口（GET / POST）→ `demo/app/api/todos/route.ts`
> - 单条接口（GET / PUT / DELETE）→ `demo/app/api/todos/[id]/route.ts`
> - 内存数据 → `demo/app/api/todos/store.ts`

> **动手验证：**
> 1. 在浏览器里打开 `/api/todos`——地址栏发的是 GET，直接看到 JSON。
> 2. 打开 `/route-handlers`，新建几条待办、勾选、删除，注意页面上「最近一次请求」那一行的状态码。
> 3. 在终端里试一个不合法请求，观察 400：
>    `curl -i -X POST localhost:3000/api/todos -H "Content-Type: application/json" -d '{}'`

### 7. 小结

- `route.ts` 用文件夹定位，导出以 HTTP 方法命名的函数。
- 同一个文件夹里 `route.ts` 和 `page.tsx` 不能共存。
- 动态参数 `params` 是 Promise，要 `await`。
- 用 `NextResponse.json()` 返回 JSON，用第二个参数指定状态码。
- **Next.js 15 起 GET 默认不缓存**（和 fetch 的变化同步）。
- 优先用服务端组件或 Server Actions；只有「外部调用方」才真的需要接口。

下一章讲 Server Actions——它让你不用写接口，就能直接在表单里执行服务端逻辑。

<a id="ch-10"></a>

## 第 10 章 · Server Actions

上一章写了接口、客户端组件、fetch、useState、手动刷新——就为了「提交一句话，列表更新」。Server Actions 把这套流程压成一个函数加一个 `<form>`。

> **配套可运行代码：**本章在 demo 的 `/server-actions` 路由下。执行 `npm install && npm run dev` 后访问 `http://localhost:3000/server-actions`。

### 1. 先看「不用它」有多麻烦

假设要做一个「提交留言」的功能。用第九章的接口方式，你需要：

1. 写一个 `POST /api/notes` 接口；
2. 把表单做成客户端组件，用 `useState` 管理输入框的值；
3. 写 `onSubmit`，在里面对接口发 `fetch`；
4. 设置 `Content-Type`、`JSON.stringify` 请求体；
5. 管理 loading 状态和错误状态；
6. 提交成功后，再手动发一次请求把列表刷新出来。

Server Actions 把这些全部收进一个函数里：

```tsx
// 服务端函数
"use server"

export async function addNoteAction(formData: FormData) {
  addNote(String(formData.get("text")))
  revalidatePath("/notes")
}

// 服务端组件里直接用
<form action={addNoteAction}>
  <input name="text" />
  <button>提交</button>
</form>
```

没有接口、没有客户端组件、没有 useState、没有 fetch。而且**连 JavaScript 都不需要**——它就是一个普通的 HTML 表单提交。

### 2. "use server" 写在哪儿

两种写法，按复用需求选：

#### ① 独立的 action 文件（推荐，可复用）

```ts
// app/server-actions/actions.ts
"use server"   // 文件顶部的这一行，让所有导出都变成服务端函数

export async function addNoteAction(formData: FormData) { ... }
export async function deleteNoteAction(formData: FormData) { ... }
```

#### ② 内联在组件里（适合只用一次）

```tsx
export default function Page() {
  async function addNoteInline(formData: FormData) {
    "use server"   // 写在函数体第一行
    ...
  }

  return <form action={addNoteInline}>...</form>
}
```

> **内联的 action 不能写在客户端组件里。**客户端组件要用 action，只能 import 一个已经定义好的服务端函数（也就是说，只能在 `"use server"` 文件里定义好了再引进来）。

### 3. 关键一步：revalidatePath

> **漏掉这一行，是初学 Server Actions 最常见的挫折。**
>
>
> 数据明明改成功了，页面却纹丝不动。原因是服务端组件的渲染结果被缓存了，数据库变了它并不知道。你得明确告诉它「这块数据过期了」。

```ts
import { revalidatePath } from "next/cache"

export async function deleteNoteAction(formData: FormData) {
  deleteNote(String(formData.get("id")))

  revalidatePath("/server-actions")   // 让这个路径重新取数据
}
```

还有一种更精确的写法，按标签失效：

```ts
// 取数据时打标签
const notes = await fetch(url, { next: { tags: ["notes"] } })

// 修改时只失效这个标签
revalidateTag("notes")
```

路径失效是「把这一页整个重算」，标签失效是「把用了这个标签的数据重算」。页面多、数据交叉复用时，标签更精准。

### 4. 需要校验和提交状态时：useActionState

纯表单提交不需要客户端组件。但只要涉及「校验失败要显示提示」或者「提交时按钮要转圈」，就需要 `useActionState`：

```ts
// 服务端：action 的签名变成 (上一次的结果, formData)
"use server"
export async function addNoteAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const text = String(formData.get("text") ?? "").trim()

  if (!text) return { error: "内容不能为空" }   // 校验失败，返回错误

  addNote(text)
  revalidatePath("/server-actions")
  return { ok: true }
}
```

```tsx
// 客户端
"use client"
import { useActionState } from "react"   // React 19 起来自 react

const [state, formAction, isPending] = useActionState(addNoteAction, {})

return (
  <form action={formAction}>
    <input name="text" disabled={isPending} />
    <button disabled={isPending}>
      {isPending ? "提交中…" : "发布"}
    </button>
    {state.error ? <p>{state.error}</p> : null}
  </form>
)
```

`useActionState` 返回三样东西，刚好解决三个问题：

| 返回值 | 用途 |
|---|---|
| `state` | 上一次 action 的返回值 → 显示「校验失败」或「成功」 |
| `formAction` | 绑到 `<form action={...}>` 上 |
| `isPending` | 是否正在提交 → 禁用按钮、显示「提交中…」 |

> **顺带解决了一个老问题。**第五章说过「服务端组件取数据没有加载状态」。而提交表单这类操作，执行的正是服务端代码——`isPending` 就是补上的那个加载状态。

### 5. 安全：几个必须知道的边界

> **Server Action 本质上是「公有的 HTTP 接口」。**虽然你写的是普通函数，但 Next.js 会为它生成一个可被调用的端点。任何人都能像调用接口一样调用它——包括伪造参数。
>
>
> 所以：**所有校验都必须在 action 内部做**，不能相信任何来自客户端的数据，也不能依赖客户端做了校验就跳过服务端校验。

几条实践建议：

- 在 action 里**先鉴权**，再操作数据：`const session = await getSession(); if (!session) throw new Error("未登录")`；
- 永远不要假设 `formData` 里的值合法，哪怕是隐藏字段；
- 不要返回敏感信息——返回值会传回浏览器；
- 只有**被导出**的函数才会变成可调用的端点，内部辅助函数不要导出。

### 6. Server Action 还是 route.ts？

|  | Server Action | route.ts |
|---|---|---|
| **调用方** | 自己的页面、自己的组件 | 任何外部系统 |
| **写法** | 一个函数，直接绑到表单 | 手写 HTTP 方法、状态码、请求体解析 |
| **需要写客户端代码吗** | 通常不需要 | 调用方要自己写 fetch |
| **典型场景** | 表单提交、点赞、删除、开关 | 公开 API、Webhook、给手机端用 |

> **判断标准：调用方是不是「你自己写的前端」？**
> 是 → 优先 Server Actions，代码少、还自带重新验证数据的机制。
> 不是 → 老老实实写 `route.ts`。

### 7. 代码示例与 demo 对照

> **本章 demo 路由：**`/server-actions`
> - 列表 + 删除（服务端组件的表单）→ `demo/app/server-actions/page.tsx`
> - 内联 action → `demo/app/server-actions/simple/page.tsx`
> - 带校验的表单（客户端）→ `demo/app/server-actions/validated/note-form.tsx`
> - 所有 action → `demo/app/server-actions/actions.ts`
> - 内存数据 → `demo/app/server-actions/store.ts`

> **动手验证：**
> 1. 打开 `/server-actions`，点某条留言的「删除」——列表立刻更新，因为 action 里调用了 `revalidatePath`。
> 2. 去 `/server-actions/validated`，分别试「空内容」和「超过 40 字」，看错误提示怎么出现。
> 3. 提交时留意按钮变成「提交中…」——那是 `isPending` 在起作用。

### 8. 小结

- `"use server"` 写在文件顶部（所有导出都变服务端函数）或函数体第一行（内联）。
- 服务端组件的 `<form action={fn}>` 不需要任何客户端 JS。
- 内联 action 不能定义在客户端组件里。
- **改完数据必须 `revalidatePath` / `revalidateTag`**，否则页面不会更新。
- 要校验提示和提交状态就用 `useActionState`，它返回 `state` / `formAction` / `isPending`。
- Server Action 是公开端点，**所有校验和鉴权都必须在 action 内部完成**。
- 给自己的前端用 → Server Actions；给外部用 → `route.ts`。

下一章讲怎么让页面在搜索引擎和社交平台上有正确的标题、描述和分享卡片。

<a id="ch-11"></a>

## 第 11 章 · SEO 与元数据

元数据是「关于页面的数据」——它不出现在页面上，但浏览器标签页、搜索结果、分享到微信时的卡片全靠它。这一章讲怎么在 Next.js 里配置它。

> **配套可运行代码：**本章在 demo 的 `/metadata` 路由下。执行 `npm install && npm run dev` 后访问 `http://localhost:3000/metadata`。

### 1. 静态元数据：导出一个对象

在 `page.tsx` 或 `layout.tsx` 里导出一个叫 `metadata` 的常量：

```tsx
// app/metadata/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SEO 与元数据",
  description: "演示 Next.js 的元数据配置……",
  openGraph: {
    title: "SEO 与元数据",
    type: "website",
  },
}

export default function Page() { ... }
```

Next.js 会把它渲染成 HTML 里的 `<title>` 和一堆 `<meta>` 标签。你不需要自己写 `<head>`。

#### 常用字段

| 字段 | 出现在哪 | 建议 |
|---|---|---|
| `title` | 浏览器标签页、搜索结果标题 | 50～60 字以内，把关键词放前面 |
| `description` | 搜索结果里的摘要 | 150～160 字，直接影响点击率 |
| `openGraph` | 社交平台分享卡片 | 微信、Slack、Twitter 都读它 |
| `robots` | 是否允许收录 | 后台页面设 `noindex` |
| `metadataBase` | 其他字段里相对路径的基准 | 在根布局设置一次 |

### 2. title 模板：全站统一后缀

如果每个页面标题都想带「| 我的网站」后缀，不用一页页手写：

```ts
// app/layout.tsx —— 根布局里配置一次
export const metadata: Metadata = {
  title: {
    default: "我的网站",              // 没设置 title 的页面用这个
    template: "%s | 我的网站",        // %s 被子页面标题替换
  },
}

// 子页面只需要写自己那部分
export const metadata: Metadata = { title: "关于我们" }
// → 最终渲染为 "关于我们 | 我的网站"
```

### 3. 一个必须记住的限制

> **`metadata` 只能从服务端组件里导出。**
>
>
> 如果你在 `"use client"` 文件里写 `export const metadata`，构建会直接报错。
>
>
> 为什么？因为元数据要写进 HTML 的 `<head>`，而这部分内容必须在服务端就确定好，不能等到浏览器里再算。

客户端组件要影响元数据，只能通过它的父级服务端组件。也就是说：把需要元数据的部分包在一个服务端组件里，由它来导出 `metadata`。

### 4. 分层与覆盖（有个坑）

`metadata` 和 `layout.tsx` 一样是就近生效的：根布局定义默认值，子布局可以覆盖，页面优先级最高。

```
app/layout.tsx            title: "我的网站"（含模板）
 └ app/blog/layout.tsx    title: "博客"
     └ app/blog/page.tsx  title: "最新文章"
                            → 最终用页面自己的
```

> **坑在这里：`metadata` 是整体替换，不是逐字段合并。**
>
>
> 假设根布局写了：
> `openGraph: { siteName: "我的网站", type: "website" }`
>
>
> 子页面只写了：
> `openGraph: { title: "文章标题" }`
>
>
> 那么子页面的 `siteName` 和 `type` **都会消失**，而不是继承下来。要保留就得重新写一遍。

### 5. 动态元数据：generateMetadata

当标题需要根据 URL 或数据变化时，导出一个异步函数：

```tsx
// app/metadata/dynamic/[slug]/page.tsx
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params          // params 依然是 Promise
  const article = getArticle(slug)

  if (!article) {
    // 找不到就别让搜索引擎收录
    return { title: "文章不存在", robots: { index: false } }
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
  }
}
```

几个要点：

- 它和页面组件是「兄弟」，接收**同样的参数**。
- `params` 是 Promise，要 `await`（和页面里一样）。
- 它在服务端执行，可以放心查数据库。
- 页面里为了省一次查询，通常会把结果缓存起来复用（React 的 `cache()` 就是干这个的）。

> **什么时候用静态、什么时候用动态？**一句话：**标题会随 URL 变化吗？**不会（首页、关于页）→ 静态 `metadata`；会（文章详情、商品页）→ `generateMetadata`。

### 6. 分享卡片：Open Graph

把链接发到微信、Slack、Twitter 时显示的那张卡片，读的就是 Open Graph 标签：

```ts
export const metadata: Metadata = {
  openGraph: {
    title: "文章标题",
    description: "一句话摘要",
    url: "https://example.com/article",
    siteName: "我的网站",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "zh_CN",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
  },
}
```

> **图片尺寸建议 1200×630。**这是各家平台通用的比例，太小会被裁切、太大加载慢。没有图片的话，大多数平台会退而求其次用页面里的第一张图，效果往往不可控——最好显式指定。

#### 特殊文件约定：连函数都不用写

除了导出对象，Next.js 还认一批**特殊的文件名**。把文件放进目录，元数据就自动生效：

| 文件名 | 作用 |
|---|---|
| `favicon.ico` | 浏览器标签页的小图标 |
| `icon.png` | App 图标（自动生成多个尺寸） |
| `opengraph-image.png` | 分享卡片默认图片 |
| `sitemap.ts` | 导出函数自动生成 `/sitemap.xml` |
| `robots.ts` | 导出函数自动生成 `/robots.txt` |

其中 `sitemap.ts` 和 `robots.ts` 很值得一用——它们是代码，所以可以动态列出所有文章 URL：

```ts
// app/sitemap.ts
export default function sitemap() {
  return articles.map((a) => ({
    url: `https://example.com/blog/${a.slug}`,
    lastModified: a.publishedAt,
  }))
}
// 于是自动有了 /sitemap.xml
```

### 7. 怎么验证元数据写对了

1. **查看网页源代码**（Ctrl+U），看 `<head>` 里的 `<title>` 和 `<meta>`——最直接。
2. **开发者工具的 Elements 面板**——注意这里看到的是「运行时」的结果，和源代码可能有差异（有些标签是 JS 加上去的）。
3. **社交平台官方的调试工具**——分享卡片最终长什么样，以它们为准。它们会缓存，改完记得让工具重新抓取一次。

> **一个容易被忽略的点：**元数据必须出现在**服务端渲染的 HTML 里**才有 SEO 价值。如果是靠客户端 JS 事后插入的，很多爬虫根本看不到。这也正是「`metadata` 只能从服务端组件导出」这条限制背后的原因。

### 8. 代码示例与 demo 对照

> **本章 demo 路由：**`/metadata`
> - 静态元数据 → `demo/app/metadata/page.tsx`
> - 文章列表 → `demo/app/metadata/dynamic/page.tsx`
> - 动态元数据 → `demo/app/metadata/dynamic/[slug]/page.tsx`
> - 模拟数据 → `demo/app/metadata/data.ts`
> - 全站标题模板 → `demo/app/layout.tsx`

> **动手验证：**
> 1. 打开 `/metadata`，`Ctrl+U` 找 `<title>`，确认后缀「· Next.js 教程 Demo」来自根布局的模板。
> 2. 打开 `/metadata/dynamic/metadata-basics` 和另一篇文章，对比两者的 `<title>` 与 `description`——都不一样，这就是 `generateMetadata` 的效果。
> 3. 访问一个不存在的 slug，看返回的标题是不是「文章不存在」。

### 9. 小结

- 导出 `metadata` 对象即可生成 `<title>` 和 `<meta>`。
- 根布局可以用 `title.template` 统一加后缀。
- **`metadata` 只能从服务端组件导出**，客户端组件不行。
- 分层生效，但**整体替换而非逐字段合并**——这是个坑。
- 标题随 URL 变化时用 `generateMetadata`，参数同样是 Promise。
- 分享卡片靠 `openGraph`，图片建议 1200×630。
- `sitemap.ts` / `robots.ts` / `opengraph-image.png` 等特殊文件名可以省掉手写配置。
- 元数据必须在服务端渲染的 HTML 里才有效。

下一章讲样式——CSS Modules、全局样式，以及条件类名怎么写。

<a id="ch-12"></a>

## 第 12 章 · 样式方案

Next.js 对样式没有强制主张——CSS Modules、Tailwind、全局 CSS、
CSS-in-JS 都能用。这一章讲清楚每种方案的定位，以及两个具体问题：
**全局样式为什么只能从根布局引入**，
和**条件类名该怎么拼**。

> **配套可运行代码：**本章在 demo 的 `/styling` 路由下。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/styling`。

### 1. 四种方案

| 方案 | 作用域 | 适合 |
|---|---|---|
| **全局 CSS** | 全站 | 主题变量、基础排版、重置样式 |
| **CSS Modules** | 单个文件 | 组件样式。需要写真实 CSS（伪类、动画、媒体查询）时 |
| **Tailwind CSS** | 全站（原子类） | 快速迭代、团队统一设计规范 |
| **CSS-in-JS** | 组件 | 已有技术积累的团队。在 App Router 里需要额外配置 |

> **本 demo 只用了前两种。**
> 不是因为另外两种不好，而是这个教程想让读者分清楚
> 「哪些是 Next.js 的规则、哪些是某个库的用法」。
> Tailwind 的类名会把这两件事搅在一起，所以没有引入。
>
>
> 但你在真实项目里完全可以自由选择——本章最后一节说 Tailwind 怎么接入。

### 2. 全局 CSS：只能从根布局引入

> **这是一条容易困惑的规则：全局 CSS 只能在
> `app/layout.tsx` 里引入。**
>
>
> 在别的文件里 `import "./styles.css"` 会报错。
> 原因很实际：Next.js 需要在渲染开始之前就知道全部全局样式，
> 才能在 HTML 的 `<head>` 里按正确的顺序插入它们。
> 如果允许任何组件随时引入，样式顺序就变得不可预测了。

```tsx
// app/layout.tsx —— 全局样式只能在这里引入
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
```

#### 全局 CSS 里放什么

```css
/* app/globals.css */
:root {
  --accent: #0070f3;      /* 主题变量，全站复用 */
  --border: #e5e5e5;
}

/* 基础排版 */
body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.7;
}

/* 少量通用类。本 demo 的 .card / .note 就定义在这里 */
.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 10px;
}
```

注意 `:root` 里的 CSS 变量——这是全局 CSS 最有价值的用法之一。
用 `var(--accent)` 引用主题色，改一处就能全站生效。

> **不要把组件样式都塞进全局 CSS。**
> 全局类名没有作用域，两个开发者很容易起出同名的 `.card`，
> 后定义的那个会静默地覆盖前一个。全局 CSS 里只该放
> 「全站通用的东西」：变量、重置、排版、极少数工具类。

### 3. CSS Modules：局部作用域

文件名以 `.module.css` 结尾，就自动变成局部作用域：

```css
/* app/styling/css-modules/card.module.css */
.card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
}
.highlight {
  border-color: #0070f3;
  box-shadow: 0 0 0 3px #eaf3ff;
}
```

```tsx
// app/styling/css-modules/page.tsx
import styles from "./card.module.css"   // 当成对象导入

export default function Page() {
  return (
    <div className={styles.card}>普通卡片</div>
  )
}
```

它到底做了什么？**把类名改了。**
构建后 `.card` 会变成类似 `.card_a1b2c3` 的名字，
所以这里的 `.card` 和别处的 `.card` 永远不会冲突。

> **怎么亲眼看到？**打开 demo 的
> `/styling/css-modules`，用开发者工具的 Elements 面板看那些 div
> 的 `class` 属性——你会看到带随机后缀的名字。
>
>
> 好处随之而来：你不需要再发明 BEM 那种
> `.block__element--modifier` 的长命名来避免冲突了。

#### CSS Modules 不做的事

它只解决**作用域隔离**，不解决**样式复用**。
想在多个模块之间共享值，用 CSS 变量：

```css
/* globals.css 定义一次 */
:root { --accent: #0070f3; }

/* 任何模块里都能用 */
.button { background: var(--accent); }
.link   { color: var(--accent); }
```

### 4. Tailwind CSS 的取舍

接入很简单——创建项目时 `create-next-app` 会问你要不要用。
用起来是这样：

```tsx
<div className="rounded-lg border border-gray-200 bg-white p-5">
  <h3 className="text-lg font-semibold">卡片标题</h3>
</div>
```

| 好处 | 代价 |
|---|---|
| 不用想类名，写的时候不用在文件和 CSS 之间来回跳 | JSX 变得很长，复杂组件里结构不清晰 |
| 自带设计约束（间距、字号都是固定的一档一档） | 需要花时间记类名，否则要一直查文档 |
| 不会产生「没用的 CSS 越积越多」 | 代码审查时很难一眼看出样式改了什么 |

> **一个常见的误解：**「Tailwind 会把样式写在 HTML 里，所以体积大」。
> 恰恰相反——Tailwind 只输出你**实际用到**的类，
> 最终 CSS 通常比手写的小。真正的问题是可读性，不是体积。

### 5. 条件类名：三种写法

「加载中橙色、成功绿色」这类需求，本质是「根据状态拼出一个字符串」。

#### ① 模板字符串

```ts
const className = `${styles.badge} ${styles[status]}`
```

简单直接。但类名一多就难读，而且没法优雅地处理「可选类名」。

#### ② 数组 + filter + join（不加库时最实用）

```ts
const className = [
  styles.badge,
  styles[status],
  isActive && styles.active,   // 条件为假时这里是 false
]
  .filter(Boolean)             // 把 false 剔掉
  .join(" ")
```

#### ③ 用 clsx 之类的库

```ts
import clsx from "clsx"

const className = clsx(styles.badge, styles[status], {
  [styles.active]: isActive,
})
```

> **别直接拼 `&&`。**
> `` `badge ${isActive && "active"}` ``
> 在条件为假时会拼出字面量 `"false"`，变成
> `class="badge false"`。多数情况下不影响显示，
> 但很脏，也容易掩盖真正的 bug。

### 6. 内联 style 该不该用

React 的 `style={{...}}` 在 Next.js 里当然能用，
本 demo 的不少页面就用了它。但要清楚它的边界：

- **能用**：一次性的微调、需要根据计算动态决定的值
  （比如进度条宽度）、写文档 demo 时不想引入 CSS 文件。
- **不该用**：伪类（`:hover`）、媒体查询、
  动画——内联样式根本表达不了这些。
- **性能**：内联样式会在每次渲染时创建新对象，
  在频繁重渲染的大列表里不如类名。

### 7. 代码示例与 demo 对照

> **本章 demo 路由：**`/styling`
> - 全局样式 → `demo/app/globals.css`（由 `demo/app/layout.tsx` 引入）
> - CSS Modules 样式 → `demo/app/styling/css-modules/card.module.css`
> - CSS Modules 用法 → `demo/app/styling/css-modules/page.tsx`
> - 条件类名演示 → `demo/app/styling/conditional/status-demo.tsx`

> **动手验证：**
> 1. 打开 `/styling/css-modules`，用 Elements 面板看那两个卡片的
>    `class` 属性，确认类名被加了哈希后缀。
> 2. 打开 `/styling/conditional`，切换三个状态看颜色变化；
>    切到「已完成」时第二个徽章会多出蓝色描边（那是可选类名生效了）。
> 3. 试着在 `demo/app/styling/page.tsx` 里
>    `import "./globals.css"`，然后构建，看报错信息。

### 8. 小结

- 四种方案：全局 CSS、CSS Modules、Tailwind、CSS-in-JS，
  **选一到两种并保持一致**。
- 全局 CSS **只能在根布局引入**，里面主要放变量、重置和少量工具类。
- CSS Modules 用 `.module.css` 命名，自动做作用域隔离，不解决复用。
- 跨模块共享值用 CSS 变量（`var(--x)`）。
- 条件类名推荐「数组 + filter + join」，别直接拼 `&&`。
- 内联 style 表达不了伪类、媒体查询和动画，只适合一次性微调。

下一章讲图片和字体的优化——这两个直接影响首屏体验。

<a id="ch-13"></a>

## 第 13 章 · 图片与字体优化

一个页面的体积，大头往往就是图片和字体。它们也最容易造成
两种让人恼火的体验：内容突然往下跳、文字半天不出现。
Next.js 各提供了一个封装好的工具来解决。

> **配套可运行代码：**本章在 demo 的 `/images-fonts` 路由下。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/images-fonts`。

### 1. 先搞清楚要解决什么

两个会被搜索引擎计入排名的体验指标：

| 指标 | 全称 | 通俗说 |
|---|---|---|
| **LCP** | Largest Contentful Paint | 首屏最大的那块内容（通常是一张大图）多久才显示出来 |
| **CLS** | Cumulative Layout Shift | 页面内容有没有突然跳动、把你要点的按钮挤走 |

> **图片和字体正好是这两个指标的主要来源。**
>
> 图片没写宽高 → 加载完成后把下面的内容顶下去 → CLS 变差。
>
> 字体从外部域名加载 → 文字要么延迟出现、要么中途换字体 → LCP 变差、还会闪。

### 2. next/image 做的四件事

| 能力 | 说明 |
|---|---|
| **预留空间** | 强制要求宽高（或 `fill`），图片没到之前就占好位置，杜绝跳动 |
| **懒加载** | 视口外的图片不下载，滚动到附近才开始加载 |
| **自动转格式** | PNG/JPEG 会按浏览器支持转成 WebP/AVIF，体积小很多 |
| **按尺寸出多个版本** | 生成 srcset，让浏览器自己挑合适的大小——手机上不会下载桌面大图 |

#### 两种引用方式

```tsx
// ① 静态导入：宽高和模糊占位全自动
import photo from "@/public/photo.png"

<Image src={photo} alt="..." placeholder="blur" />

// ② 路径引用：要自己写宽高
<Image src="/photo.png" alt="..." width={960} height={540} />
```

> **为什么非要写宽高？**
> 因为浏览器需要在图片下载完成**之前**就知道它占多大地方。
> 不写的话，图片加载完会把下方内容「顶下去」——用户刚好要点某个按钮，
> 按钮却被挤走了，这就是 CLS。
>
>
> 注意：这个宽高**不是用来决定显示尺寸**的，
> 而是用来算宽高比的。显示多大由 CSS 决定，通常写
> `style={{ width: "100%", height: "auto" }}`。

#### fill：铺满容器

```tsx
<div style={{ position: "relative", aspectRatio: "16 / 9" }}>
  <Image src="/photo.png" alt="..." fill style={{ objectFit: "cover" }} />
</div>
```

> **`fill` 的父元素必须有定位。**
> 如果父元素没有 `position: relative`（或 absolute / fixed），
> 图片会铺满**整个页面**——这个错很常见，看起来像是图片「炸了」。

#### priority：只给首屏那张大图

```tsx
{/* 首屏封面：优先加载 */}
<Image src={cover} alt="..." priority />

{/* 页面下方：保持默认懒加载 */}
<Image src={photo} alt="..." />
```

> **别给所有图片都加 priority。**
> 它会让浏览器提前抢带宽。如果每张图都加，等于取消了懒加载，
> 而且它们会互相争抢，顺序变得不可控。一个页面通常只给一两张图加。

#### 外部图片域名要显式允许

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "example.com" }],
  },
}
```

不配置直接引用外部图片会报错。这是刻意的安全设计——
否则任何人都能拿你的服务器当免费的图片转换服务。

### 3. next/font 解决什么

传统做法是在 CSS 里写 `@font-face` 指向一个字体文件，问题有两个：

- **多一次连接**：字体文件常常放在别的域名（CDN、Google），
  浏览器要先跟它握手，慢；
- **字体闪烁**：字体没下载完时，文字要么不可见（FOIT），
  要么先显示后备字体、加载完突然换掉（FOUT），观感很差。

`next/font` 的做法是：**构建时**就把字体文件下载好、
放进你自己的产物里，顺便生成 `@font-face`。

```tsx
// app/images-fonts/font/page.tsx
import localFont from "next/font/local"

const geist = localFont({
  src: "./geist-latin.woff2",   // 相对当前文件
  display: "swap",              // 先用后备字体显示，避免文字长时间不可见
  variable: "--font-geist",     // 同时暴露成 CSS 变量
})

// 用法一：给某一处加 className
<h2 className={geist.className}>Hello</h2>

// 用法二：外层挂 variable，内层用 CSS 变量
<div className={geist.variable}>
  <p style={{ fontFamily: "var(--font-geist)" }}>Hello</p>
</div>
```

#### 它比手写 @font-face 好在哪里

除了省掉外部请求，`next/font` 还会自动计算
字体的 **度量指标**（`size-adjust` 等），
让后备字体和自定义字体的行高尽量接近。

```
手写 @font-face：
  后备字体行高 20px → 真实字体行高 24px
  切换的一瞬间，整页文字位置都会挪一下

用 next/font：
  自动调整后备字体的度量，让它接近 24px
  切换时几乎看不出变化
```

#### local 还是 google？

|  | next/font/local | next/font/google |
|---|---|---|
| **字体来源** | 你仓库里的文件 | 构建时从 Google 下载 |
| **需要外网吗** | 完全不需要 | 构建时需要能访问 Google |
| **适合** | 国内项目、公司自有字体、需要精确控制 | 能访问 Google 的构建环境 |

> **国内项目的实际建议：用 `next/font/local`。**
>
>
> `next/font/google` 是在**构建时**去 Google 服务器取字体的。
> 如果构建环境访问不了 Google，`npm run build` 会失败或者长时间卡住——
> 而且这个问题在本地开发时可能不出现，等到 CI 上才炸。
>
>
> 本 demo 就选择了 `local`，字体文件放在
> `app/images-fonts/font/geist-latin.woff2`。

#### 中文字体的特殊之处

> **中文字体的体积是另一个量级。**
> 一套完整的中文字体动辄 3～10 MB，整份引入等于让用户下载一张大图。
> 常见做法有三种：
> - **子集化**：只打包页面实际用到的字，工具会生成一个很小的文件；
> - **用系统字体**：macOS / Windows / 手机都有不错的中文字体，
>   直接写字体栈 `PingFang SC, Microsoft YaHei, sans-serif`；
> - **按字符集分片**：把字体切成很多小文件，浏览器只下载用到的那几片。
>
> 本 demo 的中文部分就走的第二条路——Geist 只覆盖拉丁字符，中文自动回退到系统字体。

### 4. 怎么验证

#### 图片

1. 开发者工具的 Network 面板，过滤 `Img`；
2. 往下滚动页面，观察图片是**滚动到附近才开始加载**的；
3. 请求地址是 `/_next/image?url=...&w=...`，说明经过了转换；
4. 看返回的文件类型——原始 PNG 通常会被转成 WebP，体积小很多。

#### 字体

1. Network 面板过滤 `Font`；
2. 请求地址应该是**你自己的域名**（比如 `/_next/static/media/...`），
   而不是 `fonts.gstatic.com`——说明字体已经内联进产物了。

### 5. 代码示例与 demo 对照

> **本章 demo 路由：**`/images-fonts`
> - next/image 四种用法 → `demo/app/images-fonts/image/page.tsx`
> - next/font/local → `demo/app/images-fonts/font/page.tsx`
> - 字体文件 → `demo/app/images-fonts/font/geist-latin.woff2`
> - 示例图片 → `demo/public/photo.png`

> **动手验证：**
> 1. 打开 `/images-fonts/image`，在 Network 面板里盯着图片请求，
>    慢慢往下滚动——能看到懒加载在起作用。
> 2. 看那几个图片请求的地址，确认都走了 `/_next/image`。
> 3. 打开 `/images-fonts/font`，在 Network 面板过滤 Font，
>    确认字体请求来自你自己的域名，不是 Google。

### 6. 小结

- 图片和字体是 LCP 与 CLS 两个体验指标的主要来源。
- `next/image`：预留空间、懒加载、自动转格式、按尺寸生成多个版本。
- **宽高必须写**（或用 `fill`），它是用来算宽高比防跳动的。
- `fill` 的父元素必须有 `position: relative`。
- `priority` 只给首屏那一两张图加。
- 外部图片域名要在 `images.remotePatterns` 里声明。
- `next/font` 构建时内联字体，消除外部请求和字体闪烁，还会对齐度量。
- **国内项目优先用 `next/font/local`**，避免构建时访问 Google。
- 中文字体体积大，优先考虑系统字体栈或子集化。

最后一章讲中间件——在所有请求到达页面之前拦截它们。

<a id="ch-14"></a>

## 第 14 章 · 中间件（proxy.ts）

前面十三章讲的是「请求到达页面之后」发生的事。中间件给你一个机会，
在**请求还没到页面之前**就做出决定：放行、改写、还是直接送走。

> **配套可运行代码：**本章在 demo 的 `/middleware` 路由下，
> 中间件本体是 `demo/proxy.ts`。
> 执行 `npm install && npm run dev` 后访问
> `http://localhost:3000/middleware`。

> **先说明一个命名变化，否则你会以为走错了章节。**
>
>
> Next.js 16 把这个约定文件从 `middleware.ts` 改名成了
> `proxy.ts`，导出的函数也从 `middleware` 改成了
> `proxy`。功能完全一样，官方只是认为 "proxy"（代理）
> 更能准确表达它的本质。
> - Next.js 15 及以前：文件 `middleware.ts`，
>   函数 `export function middleware()`
> - Next.js 16 起：文件 `proxy.ts`，
>   函数 `export function proxy()`
>
> 旧项目里的 `middleware.ts` 和新项目里的 `proxy.ts`
> 是同一个东西，社区里仍然普遍称它为「中间件」。
> 本 demo 用的是 Next.js 16，所以文件是 `proxy.ts`。
> 官方也提供了自动迁移命令：`npx @next/codemod@canary middleware-to-proxy .`

### 1. 它在哪里执行

```
浏览器请求
   │
   ▼
┌──────────────────┐
│   proxy.ts       │  ← 在这里。页面还没开始渲染
└──────────────────┘
   │
   ├─ 返回 redirect  → 浏览器直接改地址，页面完全不执行
   ├─ 返回 rewrite   → 内部换成另一个页面，URL 不变
   ├─ 返回响应       → 直接结束，不发页面
   └─ NextResponse.next() → 放行，继续走正常流程
                             │
                             ▼
                      layout → page → 渲染
```

文件位置有讲究：**必须放在项目根目录**
（本 demo 是 `demo/proxy.ts`），
**不是**放在 `app/` 里面。因为它管的是「整个应用」这一层。

### 2. 三个最常见的场景

#### ① 旧地址迁移

```ts
import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/old-path") {
    return NextResponse.redirect(new URL("/new-path", request.url))
  }
}
```

网站改版、栏目改名之后，旧链接可能已被搜索引擎收录、被用户收藏。
在中间件里做一层映射，既保住流量，也不用为每个旧地址留一个页面文件。

#### ② 访问保护（鉴权初筛）

```ts
if (pathname.startsWith("/dashboard")) {
  const token = request.cookies.get("session")

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
```

这样「没登录就别进来」只写一处，而不是每个受保护页面都抄一遍判断。

#### ③ 注入请求头 / 响应头

```ts
const requestHeaders = new Headers(request.headers)
requestHeaders.set("x-user-region", region)

const response = NextResponse.next({
  request: { headers: requestHeaders },   // 传给后面的页面
})
response.headers.set("x-cache", "miss")   // 放进响应头
return response
```

> **这里有个很容易搞错的细节：请求头和响应头是两回事。**
>
>
> · 只有改 `request` 头，页面里的 `headers()` 才读得到。
>
> · 只改 `response` 头，页面读不到，但浏览器和网络面板能看到。
>
>
> 想让页面用上中间件传的值，必须走 `NextResponse.next({ request: ... })`。

### 3. matcher：一定要限定范围

> **不写 `matcher`，中间件会对每一个请求运行——包括图片、字体、JS 文件。**
>
>
> 这既拖慢性能，也容易出意外（比如把静态资源也重定向了，
> 结果 CSS 加载不出来、页面样式全乱）。

```ts
export const config = {
  matcher: ["/dashboard/:path*"],   // 只管这个范围
}
```

`:path*` 里的 `*` 表示「零段或多段」，所以这个 matcher
同时覆盖 `/dashboard` 和 `/dashboard/anything/deep`。

本 demo 就是靠它把中间件限制在 `/middleware/*`，
这样其它十三章的页面完全不受影响——你在学中间件的时候，
前面的例子不会突然开始跳转。

```ts
// 常见写法：排除静态资源
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

### 4. 两条必须知道的限制

#### 限制一：它跑在每个请求上

中间件是在页面渲染**之前**执行的，而且每个匹配到的请求都要跑一遍。
它慢 50ms，整个站点就慢 50ms。所以：

| 适合放这里 | 不适合放这里 |
|---|---|
| 重定向、改写 URL | 查数据库、调外部接口 |
| 「有没有 cookie」这种快速判断 | 「这个用户能不能编辑这篇文章」这种需要查数据的判断 |
| 加请求头 / 响应头 | 业务逻辑（应该在 Server Actions 或接口里） |
| A/B 分流、地区或语言跳转 | 任何耗时超过几十毫秒的操作 |

#### 限制二：运行在 Edge 运行时

> **中间件默认跑在 Edge 运行时，不是完整的 Node.js 环境。**
> 它启动快、离用户近，但很多 Node 专有模块（`fs`、
> 一些数据库驱动）用不了。
>
>
> 这也正是设计意图：逼着你保持中间件轻量。
> 需要完整 Node 能力的逻辑，应该放到页面、Server Actions 或接口里。

### 5. 鉴权该放中间件还是页面里？

一个常见的困惑。答案是**两处都要，但职责不同**：

| 位置 | 负责 | 例子 |
|---|---|---|
| **中间件** | 快速初筛：有没有凭证 | 没有 cookie → 直接跳登录页 |
| **页面 / 数据层** | 真正的授权判断 | 这个用户是不是这篇文章的作者？ |

> **不要在中间件里做完整的权限校验。**
> 那需要查数据库，而中间件在每个请求上都跑、又跑在 Edge 环境——
> 既慢又受限。
>
>
> 更重要的是：**中间件不能当作唯一的安全边界**。
> 真正的授权检查必须在数据操作的那一层做，
> 否则一个没被 matcher 覆盖到的路径就会绕过它。

### 6. 代码示例与 demo 对照

> **本章 demo 路径：**
> - 中间件本体 → `demo/proxy.ts`
> - 总览页（读中间件传的头）→ `demo/app/middleware/page.tsx`
> - 重定向目标 → `demo/app/middleware/new/page.tsx`
> - 受保护的页面 → `demo/app/middleware/protected/page.tsx`
> - 模拟登录接口 → `demo/app/middleware/auth/route.ts`

> **动手验证三步：**
> 1. 打开 `/middleware`，看到页面显示了
>    `x-demo-middleware` 这个头——证明中间件运行过。
>    再去 Network 面板确认响应头里也有它。
> 2. 点「旧地址」链接（`/middleware/old`），
>    你会落到 `/middleware/new`，而旧地址在项目里并不存在。
> 3. 先点「登录」，再访问受保护页面——能进。
>    然后在开发者工具里删掉 `demo-token` cookie 并刷新，
>    立刻被送回总览页。

### 7. 小结

- 约定文件放在**项目根目录**，在请求到达页面前执行。
  Next.js 16 起叫 `proxy.ts`（以前叫 `middleware.ts`）。
- 四种出口：放行（`next()`）、重定向、改写、直接返回响应。
- 常用场景：旧地址迁移、鉴权初筛、注入请求头、A/B 分流。
- **务必写 `matcher` 限定范围**，否则静态资源也会被处理。
- 改**请求头**才能让页面读到；改响应头只有浏览器能看到。
- 它跑在每个请求上，且运行在 Edge 运行时——**必须保持轻量**。
- 中间件只做快速初筛，真正的授权判断要放在数据层。

### 教程到这里就结束了

十四章走下来，你应该已经建立了这样一条线索：

- **第一章**确定了「HTML 在哪生成」这个地基——CSR / SSR / SSG / ISR；
- **第二、三章**讲清了页面是怎么被文件夹结构组织起来的；
- **第四到六章**解决了「代码跑在哪、数据从哪来、URL 怎么变化」；
- **第七、八章**补齐了用户体验：加载、出错、跳转；
- **第九到十一章**是数据写回、对外接口和搜索引擎可见性；
- **第十二到十四章**是工程化的收尾：样式、资源、全局拦截。

所有代码都在 `demo/` 项目里，每个页面都有可操作的验证步骤。
建议的学习顺序是：读一章 HTML，去 demo 里点一遍，
然后回到自己的项目里用一次。

