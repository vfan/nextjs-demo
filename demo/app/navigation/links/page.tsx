// ============================================================
// Link 组件 —— 路由 /navigation/links
// ============================================================
// 文件位置：app/navigation/links/page.tsx
//
// 为什么不用原生 <a>？因为 <a> 会让浏览器重新加载整个页面：
// 所有 JS 重新下载、所有布局重新挂载、状态全部丢失。
//
// <Link> 做的是「客户端导航」——它拦截点击，只替换变化的那部分，
// 布局和共享状态都留着。这就是第三章「布局不被销毁」能成立的前提。
//
// 在生产环境里，<Link> 还会<strong>预加载</strong>：
// 只要链接进入视口，Next.js 就悄悄把目标路由的代码取回来。
// 用户点下去的时候几乎是瞬间响应。开发模式下这个行为被关掉了，
// 所以本地测试时感觉不到预加载的威力。

import Link from "next/link";
import ActiveNav from "./active-nav";

export default function LinksPage() {
  return (
    <>
      <h1>Link 组件</h1>
      <p className="lead">
        Next.js 里的跳转都用它。下面四种写法，对应四种需求。
      </p>

      <h2>1. 最普通：预加载</h2>
      <div className="card">
        <p style={{ marginBottom: 8 }}>
          <Link href="/navigation/router">去 useRouter 页面</Link>
        </p>
        <p className="path" style={{ marginBottom: 0 }}>
          &lt;Link href=&quot;/navigation/router&quot;&gt;...&lt;/Link&gt;
        </p>
      </div>

      <h2>2. replace：不留下历史记录</h2>
      <div className="card">
        <p style={{ marginBottom: 8 }}>
          <Link href="/navigation/router" replace>
            用 replace 跳过去
          </Link>
        </p>
        <p className="path">
          &lt;Link href=&quot;...&quot; replace&gt;
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: 0 }}>
          <strong>验证方法：</strong>点一下这个链接，然后按浏览器的「后退」按钮。
          你会发现回不到本页——因为 replace 把当前这条历史记录<strong>替换</strong>掉了，
          而不是新增一条。适合「登录成功后跳转」这类不该后退回去的场景。
        </p>
      </div>

      <h2>3. scroll=&#123;false&#125;：不滚到顶部</h2>
      <div className="card">
        <p style={{ marginBottom: 8 }}>
          <Link href="/navigation/router" scroll={false}>
            用 scroll=false 跳过去
          </Link>
        </p>
        <p className="path" style={{ marginBottom: 0 }}>
          &lt;Link href=&quot;...&quot; scroll=&#123;false&#125;&gt;
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: 8, marginBottom: 0 }}>
          默认情况下，跳转后页面会滚到顶部（这是符合直觉的行为）。
          有些场景不希望这样——比如列表页的分页、带锚点的跳转。
        </p>
      </div>

      <h2>4. 高亮当前页</h2>
      <div className="card">
        <p style={{ marginBottom: 10 }}>
          <code>&lt;Link&gt;</code> 自己不知道「我是不是当前页」，
          这需要 <code>usePathname</code>——所以要用一个客户端组件：
        </p>
        <ActiveNav />
        <p className="path" style={{ marginTop: 12, marginBottom: 0 }}>
          代码：app/navigation/links/active-nav.tsx
        </p>
      </div>

      <div className="note warn">
        <strong>别用 <code>&lt;a&gt;</code> 混着写。</strong>
        如果你在 App Router 里写了一个原生 <code>&lt;a href="/xxx"&gt;</code>，
        它会触发整页刷新，上面说的所有好处（不丢状态、预加载、客户端导航）
        通通失效。见到 <code>&lt;a&gt;</code> 就换成 <code>&lt;Link&gt;</code>。
      </div>
    </>
  );
}
