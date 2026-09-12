// ============================================================
// 总览 —— 路由 /loading-and-error
// ============================================================
// 文件位置：app/loading-and-error/page.tsx
//
// 服务端组件取数据时没有「加载中」状态，这很省事，
// 但用户等的那几秒总得看到点什么。这一章就是补上这三块：
//
//   loading.tsx    等的时候看什么
//   error.tsx      出错的时候看什么
//   not-found.tsx  找不到的时候看什么

import Link from "next/link";

export default function LoadingAndErrorPage() {
  return (
    <>
      <h1>第七章 · 加载状态与错误处理</h1>
      <p className="lead">
        三种「意外情况」各有一个约定文件名来兜底，不用自己写一堆 if。
      </p>

      <h2>三个约定文件</h2>
      <table className="route-table">
        <thead>
          <tr>
            <th>文件名</th>
            <th>什么时候出现</th>
            <th>本质是什么</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="path">loading.tsx</td>
            <td>页面还在服务器上渲染时</td>
            <td>自动套在页面外的 Suspense 边界</td>
          </tr>
          <tr>
            <td className="path">error.tsx</td>
            <td>页面渲染抛出错误时</td>
            <td>React 的错误边界（Error Boundary）</td>
          </tr>
          <tr>
            <td className="path">not-found.tsx</td>
            <td>
              调用了 <code>notFound()</code>，或 URL 完全匹配不上
            </td>
            <td>404 页面</td>
          </tr>
        </tbody>
      </table>

      <div className="note warn">
        <strong>它们的作用范围跟 layout 一样</strong>——放在哪个文件夹里，
        就管哪个文件夹及其子路由。所以「全站统一的 404」放在
        <code>app/not-found.tsx</code>，而某个专区自己的 404 放在专区文件夹里。
      </div>

      <h2>逐个试一下</h2>
      <div className="grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>loading.tsx</h3>
          <p className="path">app/loading-and-error/slow/loading.tsx</p>
          <p>
            页面故意慢 2 秒。点进去就能看到骨架屏，而不是一片空白。
          </p>
          <Link href="/loading-and-error/slow">看加载效果 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>error.tsx</h3>
          <p className="path">app/loading-and-error/error-demo/error.tsx</p>
          <p>点一个按钮就会抛错，然后落到错误边界上，还能重试。</p>
          <Link href="/loading-and-error/error-demo">试一试 →</Link>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>not-found.tsx</h3>
          <p className="path">app/loading-and-error/not-found.tsx</p>
          <p>页面主动调用 notFound()，渲染出这个专区自己的 404。</p>
          <Link href="/loading-and-error/not-found-demo">看一看 →</Link>
        </div>
      </div>
    </>
  );
}
