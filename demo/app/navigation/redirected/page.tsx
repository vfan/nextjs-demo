// ============================================================
// 被重定向到的页面 —— 路由 /navigation/redirected
// ============================================================
// 文件位置：app/navigation/redirected/page.tsx
//
// 这个页面存在的唯一目的，是让 /navigation/redirect 的重定向
// 有一个可以落脚的地方。真实的页面设计里不会这样，
// 这里只是为了让 demo 能自证。

import Link from "next/link";

export default function RedirectedPage() {
  return (
    <>
      <h1>你被重定向过来了</h1>
      <p className="lead">
        这个页面是 <code>/navigation/redirected</code>。
      </p>

      <div className="note">
        你原本访问的是 <code>/navigation/redirect</code>。
        那个页面的代码里执行了{" "}
        <code>redirect(&quot;/navigation/redirected&quot;)</code>，
        于是服务器直接返回了一个跳转响应，浏览器就带你来到这里。
        <br />
        <br />
        整个过程里，<code>/navigation/redirect</code> 的页面内容
        <strong>一帧都没有渲染过</strong>——这正是它和{" "}
        <code>router.push()</code> 的本质区别。
      </div>

      <p>
        <Link href="/navigation/redirect">← 回到 redirect() 说明页</Link>
      </p>
    </>
  );
}
