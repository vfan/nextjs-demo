// ============================================================
// 受保护的页面 —— 路由 /middleware/protected
// ============================================================
// 文件位置：app/middleware/protected/page.tsx
//
// 这个文件里没有任何权限判断代码——因为拦截发生在上一步（中间件）。
// 能渲染到这里，就说明中间件已经确认过凭证存在了。
//
// 这就是中间件做鉴权初筛的价值：把「没登录就别进来」这件事
// 集中在一个地方，而不是每个受保护的页面都抄一遍判断。

import Link from "next/link";
import { cookies } from "next/headers";

export default async function ProtectedPage() {
  // 读一下 cookie 显示出来，证明凭证真的存在
  const cookieStore = await cookies();
  const token = cookieStore.get("demo-token");

  return (
    <>
      <h1>受保护的页面</h1>
      <p className="lead">
        你能看到这一页，说明你带着有效凭证。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>当前凭证</h3>
        <p className="path" style={{ marginBottom: 0 }}>
          demo-token = &quot;{token?.value}&quot;
        </p>
      </div>

      <div className="note warn">
        <strong>试着把 cookie 删掉再刷新本页。</strong>
        浏览器开发者工具 → Application → Cookies，
        删掉 <code>demo-token</code>，然后刷新——你会立刻被中间件送回总览页。
        页面本身一行权限代码都没有，但它就是进不来了。
      </div>

      <div className="callout note">
        <strong>中间件鉴权只是第一道关。</strong>
        它适合做「有没有凭证」这种快速判断。真正的权限校验
        （比如「这个用户能不能编辑这篇文章」）需要查数据库，
        应该放在页面里或者数据层——因为中间件跑在 Edge 运行时，
        而且每个请求都要执行，不适合做重活。
      </div>

      <p>
        <Link href="/middleware/auth?action=logout">登出 →</Link>
        {"　"}
        <Link href="/middleware">← 回到总览</Link>
      </p>
    </>
  );
}
