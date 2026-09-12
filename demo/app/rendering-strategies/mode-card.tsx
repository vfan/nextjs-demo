// ============================================================
// 展示卡片（被四个模式页面共用）
// ============================================================
// 文件位置：app/rendering-strategies/mode-card.tsx
//
// 注意：这个文件没有对应的 URL。因为它叫 mode-card.tsx 而不是 page.tsx，
// Next.js 不会把它当作路由——这正好印证了第二章讲的「有没有 page.tsx
// 决定一个文件夹是否对外暴露」。
//
// 它被 csr / ssr / ssg / isr 四个页面共用，所以抽成独立组件，
// 避免四份几乎一样的卡片标记。

type Mode = "CSR" | "SSR" | "SSG" | "ISR";

// 四种模式对应四种配色，和教程 HTML 里的保持一致
const BADGE_CLASS: Record<Mode, string> = {
  CSR: "badge-csr",
  SSR: "badge-ssr",
  SSG: "badge-ssg",
  ISR: "badge-isr",
};

export default function ModeCard({
  mode,
  tagline,
  renderedAt,
  stampLabel = "本次 HTML 的生成时间",
  pending = false,
  children,
}: {
  mode: Mode;
  /** 一句话说明这个模式在做什么 */
  tagline: string;
  /** 要展示的时间戳 */
  renderedAt: string;
  /** 时间戳上方的说明文字 */
  stampLabel?: string;
  /** true 时把时间戳显示成灰色的「等待中」样式 */
  pending?: boolean;
  /** 「怎么观察」的补充说明 */
  children?: React.ReactNode;
}) {
  return (
    <div className="mode-card">
      <span className={`badge ${BADGE_CLASS[mode]}`}>{mode}</span>
      <p style={{ marginTop: 12, marginBottom: 0 }}>{tagline}</p>

      <p className="stamp-label">{stampLabel}</p>
      <p className={`stamp${pending ? " pending" : ""}`}>{renderedAt}</p>

      {children ? <div className="hint">{children}</div> : null}
    </div>
  );
}