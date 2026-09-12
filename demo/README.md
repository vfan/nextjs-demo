# Next.js 教程 Demo

这是一个**可以直接运行**的 Next.js 项目，装着教程全部 14 章的示例代码。
教程用 HTML 讲概念，这里负责让你亲手验证——反复刷新看看时间戳变不变、
在侧边栏打个字再切页面看看会不会丢、删掉 cookie 看看会不会被拦。

- 技术栈：Next.js 16（App Router）· React 19 · TypeScript 5
- 特点：零额外依赖（没有 Tailwind、没有 UI 库），所有知识点都靠框架原生能力实现
- 目录约定：**一章对应一组路由**，章节与路由的对照见文末

---

## 快速开始

```bash
cd demo
npm install
npm run dev
```

然后打开 http://localhost:3000。

其它命令：

```bash
npm run build   # 生产构建，顺便做类型检查，并列出每个路由是静态还是动态
npm start       # 以生产模式启动（需先 build）
```

> **注意**：验证 SSG / ISR 时请务必用 `npm run build && npm start`。
> `npm run dev` 为了热更新会每次重新渲染，静态页面的时间戳也会变，看不出真实行为。

---

## 目录结构

```
demo/
├── proxy.ts                          ← 第十四章：中间件（Next 16 起叫 proxy）
├── app/
│   ├── layout.tsx                    ← 根布局（全站导航 + 页脚）
│   ├── page.tsx                      ← 首页：14 章索引
│   ├── globals.css                   ← 全局样式
│   │
│   ├── api/                          ← 接口实现（第五、九章用）
│   │   ├── weather/route.ts
│   │   └── todos/route.ts, [id]/route.ts, store.ts
│   │
│   ├── rendering-strategies/         ← 第 01 章
│   ├── routing-basics/               ← 第 02 章
│   ├── layouts/                      ← 第 03 章
│   ├── server-client/                ← 第 04 章
│   ├── data-fetching/                ← 第 05 章
│   ├── dynamic-routes/               ← 第 06 章
│   ├── loading-and-error/            ← 第 07 章
│   ├── navigation/                   ← 第 08 章
│   ├── route-handlers/               ← 第 09 章
│   ├── server-actions/               ← 第 10 章
│   ├── metadata/                     ← 第 11 章
│   ├── styling/                      ← 第 12 章
│   ├── images-fonts/                 ← 第 13 章
│   └── middleware/                   ← 第 14 章
├── public/photo.png                  ← 第十三章用的示例图片
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 全部页面

### 通用

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/` | `app/page.tsx` | 首页。14 章的完整索引。 |

### 01 · 渲染策略（`/rendering-strategies`）

四个页面代码几乎一样，区别只在文件顶部那一行配置。
每个页面都显示「本次 HTML 的生成时间」，**反复刷新就能看出差异**。

| URL | 源文件 | 刷新时的表现 |
| --- | --- | --- |
| `/rendering-strategies` | `page.tsx` | 总览：四种模式的横向对比表 |
| `/rendering-strategies/csr` | `csr/page.tsx` | 内容由浏览器生成，HTML 里搜不到时间戳 |
| `/rendering-strategies/ssr` | `ssr/page.tsx` | `dynamic = "force-dynamic"`，每次都变 |
| `/rendering-strategies/ssg` | `ssg/page.tsx` | 无配置，冻在构建那一刻 |
| `/rendering-strategies/isr` | `isr/page.tsx` | `revalidate = 10`，过期后第二次刷新才更新 |
| — | `mode-card.tsx` | 四个页面共用的卡片。非路由文件，没有 URL |

### 02 · 路由基础（`/routing-basics`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/routing-basics` | `page.tsx` | 章节首页，「源文件路径 → URL」对照表 |
| `/routing-basics/about` | `about/page.tsx` | 一级子路由 |
| `/routing-basics/blog` | `blog/page.tsx` | 父级列表页 |
| `/routing-basics/blog/first-post` | `blog/first-post/page.tsx` | 二级嵌套路由 |
| `/routing-basics/pricing` | `(marketing)/pricing/page.tsx` | 路由组，URL 里没有 `marketing` |
| `/routing-basics/features` | `(marketing)/features/page.tsx` | 同组另一页 |

### 03 · 布局系统（`/layouts`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/layouts` | `page.tsx` | 章节首页，顶部虚线框来自 `layouts/layout.tsx` |
| `/layouts/nested` | `nested/page.tsx` | **嵌套布局 + 状态保持** 的起点 |
| `/layouts/nested/analytics` | `nested/analytics/page.tsx` | 子页面。切回来时侧边栏输入的内容还在 |
| `/layouts/nested/settings` | `nested/settings/page.tsx` | 第三个子页面 |
| `/layouts/pricing` | `(marketing)/pricing/page.tsx` | 路由组 + 独立布局，两层布局叠加 |
| `/layouts/features` | `(marketing)/features/page.tsx` | 与 pricing 共用分组布局 |
| `/layouts/template-demo` | `template-demo/page.tsx` | **template 对比**，计数器会随导航重置 |
| `/layouts/template-demo/second` | `template-demo/second/page.tsx` | 兄弟页，来回切就能看到重新挂载 |
| — | `nested/sidebar.tsx` | 客户端组件，用输入框和计数器「看见」布局没被销毁 |
| — | `template-demo/template.tsx` | 模板文件，与 layout 写法相同但行为相反 |

### 04 · 服务端 / 客户端组件（`/server-client`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/server-client` | `page.tsx` | 对比表 + 三个示例入口 |
| `/server-client/server-demo` | `server-demo/page.tsx` | 服务端组件：`async` 直接取数，读只有服务器知道的变量 |
| `/server-client/client-demo` | `client-demo/page.tsx` | 渲染一个真正的客户端组件 |
| `/server-client/composition` | `composition/page.tsx` | 服务端往客户端传可序列化的 props |
| — | `counter.tsx` | 客户端组件本体（`"use client"`） |
| — | `server-data.ts` | 只被服务端导入的模块，代码不会进浏览器 |

### 05 · 服务端数据获取（`/data-fetching`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/data-fetching` | `page.tsx` | 直接 `await` 取数，注意没有「加载中」状态 |
| `/data-fetching/caching` | `caching/page.tsx` | 三种 fetch 缓存选项对比 |
| `/data-fetching/parallel` | `parallel/page.tsx` | 串行 vs 并行，页面上打出两个耗时 |
| `/api/weather` | `app/api/weather/route.ts` | 模拟的第三方接口，故意慢 300ms |
| — | `api-url.ts` | 从请求头拼出本应用的绝对地址 |

### 06 · 动态路由（`/dynamic-routes`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/dynamic-routes` | `page.tsx` | 两种写法对照表 |
| `/dynamic-routes/blog/[slug]` | `blog/[slug]/page.tsx` | 单段动态路由，含 `generateStaticParams` |
| `/dynamic-routes/shop/[...slug]` | `shop/[...slug]/page.tsx` | 多段 catch-all，面包屑用数组拼出来 |
| — | `data.ts` | 模拟文章数据 |

试试点开一篇文章后把 URL 改成不存在的 slug——会走 `notFound()`。

### 07 · 加载状态与错误处理（`/loading-and-error`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/loading-and-error` | `page.tsx` | 三个约定文件的说明 |
| `/loading-and-error/slow` | `slow/page.tsx` | 故意慢 2 秒，用来观察骨架屏 |
| — | `slow/loading.tsx` | 骨架屏本体 |
| `/loading-and-error/error-demo` | `error-demo/page.tsx` | 点按钮触发渲染期错误 |
| — | `error-demo/error.tsx` | 错误边界（客户端组件，含 `reset`） |
| — | `error-demo/broken.tsx` | 会抛错的组件 |
| `/loading-and-error/not-found-demo` | `not-found-demo/page.tsx` | 通过查询参数触发 `notFound()` |
| — | `not-found.tsx` | 本章专区自己的 404 页面 |

### 08 · 导航与路由感知（`/navigation`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/navigation` | `page.tsx` | 章节首页 |
| `/navigation/links` | `links/page.tsx` | Link 的四种用法（含 `replace`、`scroll`） |
| — | `links/active-nav.tsx` | 用 `usePathname` 高亮当前页 |
| `/navigation/router` | `router/page.tsx` | `useRouter` 的 push / replace / back / refresh |
| — | `router/router-client.tsx` | 客户端组件，含 `useSearchParams` |
| `/navigation/redirect` | `redirect/page.tsx` | 服务端 `redirect()`，返回 307 |
| `/navigation/redirected` | `redirected/page.tsx` | 被重定向到的页面 |

### 09 · API 路由（`/route-handlers`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/route-handlers` | `route-handlers/page.tsx` | 接口清单 + 可操作的待办演示 |
| — | `route-handlers/todo-client.tsx` | 调接口的客户端组件，会显示 HTTP 状态码 |
| `/api/todos` | `app/api/todos/route.ts` | `GET` 列表、`POST` 新建 |
| `/api/todos/[id]` | `app/api/todos/[id]/route.ts` | `GET` 单条、`PUT` 更新、`DELETE` 删除 |
| — | `app/api/todos/store.ts` | 内存里的假数据库 |

在浏览器地址栏直接打开 `/api/todos` 就能看到原始 JSON。

### 10 · Server Actions（`/server-actions`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/server-actions` | `page.tsx` | 留言列表 + 删除。表单不需要任何客户端 JS |
| `/server-actions/simple` | `simple/page.tsx` | 内联 Server Action |
| `/server-actions/validated` | `validated/page.tsx` | 带校验和提交状态的表单 |
| — | `validated/note-form.tsx` | 用 `useActionState` 的客户端组件 |
| — | `actions.ts` | 所有 Server Action（`"use server"`） |
| — | `store.ts` | 内存里的留言数据 |

### 11 · SEO 与元数据（`/metadata`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/metadata` | `page.tsx` | 静态 `metadata`，含 title 模板的效果 |
| `/metadata/dynamic` | `dynamic/page.tsx` | 文章列表 |
| `/metadata/dynamic/[slug]` | `dynamic/[slug]/page.tsx` | `generateMetadata` 生成各自的标题描述 |
| — | `data.ts` | 模拟文章数据 |

打开任一篇后按 `Ctrl+U`，对比不同文章的 `<title>` 和 `description`。

### 12 · 样式方案（`/styling`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/styling` | `page.tsx` | 四种方案对比；全局样式只能从根布局引入 |
| `/styling/css-modules` | `css-modules/page.tsx` | 用 Elements 面板能看到类名带哈希 |
| — | `css-modules/card.module.css` | CSS Module 本体 |
| `/styling/conditional` | `conditional/page.tsx` | 条件类名的三种写法 |
| — | `conditional/status-demo.tsx` | 可点击的状态切换演示 |

### 13 · 图片与字体优化（`/images-fonts`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/images-fonts` | `page.tsx` | 章节首页 |
| `/images-fonts/image` | `image/page.tsx` | `next/image` 四种用法：静态导入、路径引用、`fill`、`priority` |
| `/images-fonts/font` | `font/page.tsx` | `next/font/local`，字体来自本地产物而非 Google |
| — | `font/geist-latin.woff2` | 字体文件（SIL OFL 授权，可自由分发） |
| — | `public/photo.png` | 示例图片 |

### 14 · 中间件（`/middleware`）

| URL | 源文件 | 说明 |
| --- | --- | --- |
| `/middleware` | `middleware/page.tsx` | 显示中间件传下来的请求头，验证它确实运行过 |
| `/middleware/old` | — | **项目里不存在这个页面**，被中间件重定向到 `/middleware/new` |
| `/middleware/new` | `middleware/new/page.tsx` | 重定向目标 |
| `/middleware/protected` | `middleware/protected/page.tsx` | 需要 cookie 才能进 |
| `/middleware/auth` | `middleware/auth/route.ts` | 模拟登录 / 登出，用于设置或清除 cookie |
| — | `proxy.ts` | 中间件本体（Next.js 16 起叫 `proxy.ts`） |

---

## 几个值得亲手做的实验

### 1. 四种渲染策略到底差在哪

用 `npm run build && npm start` 启动，依次打开这四个页面，每个都**连续刷新几次**：

| 页面 | 你会看到 |
| --- | --- |
| `/rendering-strategies/csr` | 刷新时有「加载中」一闪而过；`Ctrl+U` 看源代码，HTML 里搜不到时间 |
| `/rendering-strategies/ssr` | 每次刷新时间戳都不同 |
| `/rendering-strategies/ssg` | 怎么刷都不变 |
| `/rendering-strategies/isr` | 10 秒内不变；等 10 秒后第一次刷新仍是旧值，再刷一次才更新 |

最后一行的「第一次仍是旧值」是 ISR 的关键设计，不是 bug。

### 2. 布局不会被销毁

进入 `/layouts/nested`，在左侧输入框打字、点几下计数器，
然后切换到「数据分析」和「账户设置」再切回来。文字和计数都还在。
再去 `/layouts/template-demo` 做同样的操作——这次会重置。

### 3. 服务端组件的代码不进浏览器

进入 `/server-client/server-demo`，`Ctrl+U` 搜索 `srv_`，
你能在 HTML 里找到那个 token；但在开发者工具的 Sources 面板里搜同一串字符，
在 JS 文件中找不到它的定义——因为 `server-data.ts` 根本没有发给浏览器。

### 4. 中间件确实在拦截

打开 `/middleware`，页面会显示它从请求头里读到的值。
点「旧地址」链接会跳到 `/middleware/new`，而旧地址在项目里并不存在。
再依次点「登录」「访问受保护页面」，然后删掉 `demo-token` cookie 刷新——
立刻被送回总览页。

---

## 章节与 demo 路由对照

| 教程章节 | demo 路由前缀 |
| --- | --- |
| `../01-rendering-strategies/index.html` | `/rendering-strategies` |
| `../02-routing-basics/index.html` | `/routing-basics` |
| `../03-layouts/index.html` | `/layouts` |
| `../04-server-client-components/index.html` | `/server-client` |
| `../05-data-fetching/index.html` | `/data-fetching` |
| `../06-dynamic-routes/index.html` | `/dynamic-routes` |
| `../07-loading-and-error/index.html` | `/loading-and-error` |
| `../08-navigation/index.html` | `/navigation` |
| `../09-route-handlers/index.html` | `/route-handlers` + `/api/todos` |
| `../10-server-actions/index.html` | `/server-actions` |
| `../11-metadata-seo/index.html` | `/metadata` |
| `../12-styling/index.html` | `/styling` |
| `../13-images-and-fonts/index.html` | `/images-fonts` |
| `../14-middleware/index.html` | `/middleware`（本体是 `proxy.ts`） |

建议的顺序是：先读 HTML 讲解建立概念，再回到这个项目里点一点验证。
