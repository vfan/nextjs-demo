// ============================================================
// redirect() —— 路由 /navigation/redirect
// ============================================================
// 文件位置：app/navigation/redirect/page.tsx
//
// redirect() 用在服务端组件里，效果是「服务器直接返回一个 307 跳转」。
// 用户看不到这个页面本身，浏览器会立刻去请求新地址。
//
// 和 useRouter().push() 的关键区别：
//   redirect()      在服务端发生，页面根本不会渲染
//   router.push()   在浏览器里发生，页面已经渲染出来了才跳
//
// 所以「检查登录状态」这类事必须用 redirect()——不能在把页面发出去
// 之后再补救，那用户已经瞥见受保护的内容了。
//
// 为了让你能亲手触发，这一页读了一个查询参数：
//   正常访问        → 显示本页说明
//   访问 ?go=1      → 执行 redirect()，跳到 /navigation/redirected

import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ go?: string }>;
}) {
  const { go } = await searchParams;

  if (go) {
    // 执行到这里，浏览器会收到跳转指令，本页下方的内容不会渲染
    redirect("/navigation/redirected");
  }

  return (
    <>
      <h1>redirect()：服务端重定向</h1>
      <p className="lead">
        在服务端组件里直接让浏览器换个地址，用户看不到中间页面。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>触发一次重定向</h3>
        <p>
          <Link
            href={{
              pathname: "/navigation/redirect",
              query: { go: "1" },
            }}
          >
            点这里执行 redirect() →
          </Link>
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: 0 }}>
          注意看地址栏：它会变成 <code>/navigation/redirected</code>。
          打开开发者工具的 Network 面板，能看到那个请求返回的是{" "}
          <strong>307</strong> 状态码。
        </p>
      </div>

      <div className="note">
        <strong>redirect() 可以用在哪些地方？</strong>
        服务端组件、Server Actions、路由处理器（route.ts）里都可以。
        但<strong>不能</strong>用在客户端组件的事件回调里——
        那里没有「服务器返回响应」这个环节。客户端要跳转就用
        <code>useRouter().push()</code>。
      </div>

      <div className="note warn">
        <strong>一个实用场景：</strong>在受保护的页面开头写
        <code>if (!session) redirect(&quot;/login&quot;)</code>，
        未登录的用户压根不会拿到页面内容。
        这比「先渲染页面，再用 useEffect 检查然后跳走」安全得多。
      </div>
    </>
  );
}
