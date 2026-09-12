// ============================================================
// useRouter —— 用代码跳转
// ============================================================
// 文件位置：app/navigation/router/router-client.tsx
//
// <Link> 处理的是「用户点链接」，而 useRouter 处理的是
// 「代码里主动跳转」——比如表单提交成功后跳走、未登录时踢回首页。
//
// 三个 Hook 都从 next/navigation 引入：
//   useRouter      跳转、刷新
//   usePathname    当前路径
//   useSearchParams 当前查询参数

"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const btn: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid #d0d0d0",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
  fontSize: "0.9rem",
};

export default function RouterClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 读查询参数：?from=xxx
  const from = searchParams.get("from") ?? "（没有）";

  return (
    <div>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>当前路由信息</h3>
        <p className="path" style={{ marginBottom: 6 }}>
          usePathname() = &quot;{pathname}&quot;
        </p>
        <p className="path" style={{ marginBottom: 0 }}>
          useSearchParams().get(&quot;from&quot;) = &quot;{from}&quot;
        </p>
      </div>

      <p>
        点这个链接给 URL 加一个查询参数，上面的 &quot;from&quot; 就会变：
      </p>
      <p>
        <Link
          href={{
            pathname: "/navigation/router",
            query: { from: "link" },
          }}
        >
          带上 ?from=link →
        </Link>
      </p>

      <h3>用代码跳转</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button style={btn} onClick={() => router.push("/navigation/links")}>
          router.push(&quot;/navigation/links&quot;)
        </button>
        <button style={btn} onClick={() => router.replace("/navigation/links")}>
          router.replace(...)
        </button>
        <button style={btn} onClick={() => router.back()}>
          router.back()
        </button>
        <button style={btn} onClick={() => router.refresh()}>
          router.refresh()
        </button>
      </div>

      <div className="note warn" style={{ marginTop: 20 }}>
        <strong>push 和 replace 的区别：</strong>push 会新增一条历史记录
        （浏览器后退能回来），replace 会替换掉当前这条（后退回不来）。
        <br />
        点上面这两个按钮试试，然后按浏览器的后退键，就能感受到差别。
      </div>

      <div className="note">
        <strong>push 和 back 看起来一样，其实不同：</strong>
        <code>push</code> 是「往前走一步」，<code>back</code> 是「沿历史记录后退」。
        如果历史记录是空的（比如用户直接打开这个 URL），back 可能什么也不做。
      </div>

      <div className="note">
        <strong>router.refresh() 是个特殊的存在。</strong>
        它不会跳转，而是<strong>重新向服务器请求当前页面的数据</strong>，
        并尽量保留客户端状态。适合「列表新增一条后刷新数据」这类场景——
        你可以点一下它，观察需要重新取数的内容有没有变化。
      </div>
    </div>
  );
}
