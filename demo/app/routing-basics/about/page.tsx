// ============================================================
// 关于页 —— 路由 /routing-basics/about
// ============================================================
// 文件位置：app/routing-basics/about/page.tsx
//
// 演示「一级子路由」：
// 在 app/routing-basics/ 下新建一个 about 文件夹，
// 再放进 page.tsx，URL 就多出了 /about 这一段。

export default function AboutPage() {
  return (
    <>
      <h1>关于本页</h1>
      <p className="lead">
        你正在访问 <code>/routing-basics/about</code>。
      </p>

      <div className="card">
        <h3>它是怎么出现的？</h3>
        <p>
          只是因为存在这一个文件：
        </p>
        <p className="path">app/routing-basics/about/page.tsx</p>
        <p style={{ marginTop: 12 }}>
          没有注册路由，没有配置路径。文件夹的名字 <code>about</code>{" "}
          直接成了 URL 的最后一段。
        </p>
      </div>

      <div className="note warn">
        <strong>反例：</strong>如果你在{" "}
        <code>app/routing-basics/about/</code> 里只放一个{" "}
        <code>helper.ts</code> 而<strong>不放</strong>{" "}
        <code>page.tsx</code>，那么这个文件夹对外完全不可访问，
        访问 <code>/routing-basics/about</code> 会得到 404。
        这正是你可以把私有组件、工具函数安心放在 <code>app/</code>{" "}
        下面的原因。
      </div>
    </>
  );
}
