// ============================================================
// CSS Modules —— 路由 /styling/css-modules
// ============================================================
// 文件位置：app/styling/css-modules/page.tsx
//
// 把 CSS 文件当成一个对象导入，类名通过属性访问。
// Next.js 会自动把类名改成「原名 + 哈希」，所以不会和别处冲突。
//
// 验证方法：打开开发者工具的 Elements 面板，
// 看下面那些 div 的 class 属性——你会发现不是 "card" 而是类似
// "card_a1b2c3" 这样的名字。

import styles from "./card.module.css";

export default function CssModulesPage() {
  // styles 就是一个对象：{ card: "card_xxx", highlight: "highlight_yyy", ... }
  // 类名带哈希后缀，这就是作用域隔离的实现方式。

  return (
    <>
      <h1>CSS Modules</h1>
      <p className="lead">
        局部作用域的 CSS：写得像普通 CSS，但类名不会互相打架。
      </p>

      <div className={styles.card}>
        <h3 className={styles.title}>普通的卡片</h3>
        <p className={styles.meta}>className=&#123;styles.card&#125;</p>
      </div>

      <div className={`${styles.card} ${styles.highlight}`}>
        <h3 className={styles.title}>高亮的卡片</h3>
        <p className={styles.meta}>
          className=&#123;`$&#123;styles.card&#125; $&#123;styles.highlight&#125;`&#125;
        </p>
      </div>

      <div className="note warn">
        <strong>打开 Elements 面板看看。</strong>
        上面两个 div 的 class 不是 <code>card</code> 和{" "}
        <code>card highlight</code>，而是带随机后缀的名字。
        这就是「局部作用域」的实现方式——同一份 CSS 用在两个组件里也不会冲突。
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>什么时候用 CSS Modules？</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>需要写真正的 CSS（伪类、媒体查询、动画）时；</li>
          <li>想要作用域隔离、又不想引入额外工具时；</li>
          <li>项目没有统一采用某种 CSS-in-JS 方案时。</li>
        </ul>
      </div>

      <div className="note">
        <strong>一个细节：</strong>CSS Modules 只做作用域隔离，
        <strong>不做样式复用</strong>。想在多个模块间共享变量，
        可以用 CSS 自定义属性（<code>var(--accent)</code>）——
        本 demo 的 <code>globals.css</code> 就是用这种方式定义主题色的。
      </div>
    </>
  );
}
