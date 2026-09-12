// ============================================================
// 组合使用 —— 路由 /server-client/composition
// ============================================================
// 文件位置：app/server-client/composition/page.tsx
//
// 服务端组件渲染客户端组件，这件事本身很平常。真正需要记住的是
// 「什么东西能从服务端传给客户端」。
//
// 从服务端组件传给客户端组件的 props 必须是可以序列化的：
//   可以传：字符串、数字、布尔、数组、普通对象、Date、null
//   不能传：函数、类实例、Symbol
//
// 为什么？因为服务端组件的渲染结果要经过序列化，跨越网络边界
// 传到浏览器。函数没法序列化，自然传不过去。
//
// 唯一的例外是 Server Actions——那是第十章的内容，
// 它们是被特殊处理过的函数，可以穿过这条边界。

import Counter from "../counter";

export default function CompositionPage() {
  // 这些值会在服务器上算出来，然后作为 props 交给客户端组件
  const initialCount = 42;
  const label = "从服务端传下来的初始值";

  return (
    <>
      <h1>组合使用</h1>
      <p className="lead">
        服务端组件负责取数据和排版，客户端组件负责交互——两者配合。
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>服务端传给客户端的 props</h3>
        <p className="path">
          initial = {initialCount}（服务端计算）
        </p>
        <p className="path">{label}</p>
      </div>

      {/* 这里把服务端算出来的 initialCount 传进客户端组件 */}
      <Counter initial={initialCount} />

      <div className="note warn">
        <strong>反例：</strong>如果你试着把函数传进去，比如给 Counter 加一个{" "}
        <code>onDone=&#123;() =&gt; console.log(&quot;完成&quot;)&#125;</code>，
        构建时会报错。因为函数无法序列化，跨不过服务端和客户端之间的那道边界。
        <br />
        想在客户端触发服务端逻辑？用第十章要讲的 Server Actions。
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>一个实用的判断习惯</h3>
        <p style={{ marginBottom: 0 }}>
          写组件时先问自己：「这个组件需要交互吗？」
          <br />
          不需要 → 保持默认（服务端组件），省钱又快。
          <br />
          需要 → 把那<strong>一小块</strong>交互部分单独抽成客户端组件，
          而不是把整个页面都变成客户端组件。
        </p>
      </div>
    </>
  );
}
