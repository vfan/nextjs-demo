// ============================================================
// 错误演示 —— 路由 /loading-and-error/error-demo
// ============================================================
// 文件位置：app/loading-and-error/error-demo/page.tsx
//
// 这一页本身没什么特别的，抛出错误的是它引用的 <Broken />。
// 错误会被同目录的 error.tsx 捕获。

import Broken from "./broken";

export default function ErrorDemoPage() {
  return (
    <>
      <h1>error.tsx 错误边界</h1>
      <p className="lead">
        下面这个按钮会让组件在渲染时抛出一个错误。
      </p>

      <Broken />

      <div className="note warn">
        <strong>注意一个关键细节：</strong>错误必须发生在
        <strong>渲染过程中</strong>才会被 error.tsx 捕获。
        如果只在 onClick 里 <code>throw</code>，而不改变状态触发重新渲染，
        错误边界是抓不到的——React 的错误边界只处理渲染期的错误，
        不管事件回调里的。
        <br />
        所以这个按钮的做法是：点击 → 改变 state → 重新渲染 → 渲染时抛错。
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>error.tsx 里的 reset 是什么？</h3>
        <p style={{ marginBottom: 0 }}>
          它是一个函数，调用后 Next.js 会尝试重新渲染这一段。
          对于「临时性错误」（比如网络抖动）很有用：用户点一下「重试」，
          不用手动刷新整个页面。
        </p>
      </div>
    </>
  );
}
