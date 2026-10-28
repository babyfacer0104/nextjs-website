import Link from "next/link";
import { Suspense } from "react";
import { logout } from "../actions/auth";
import { requireSession } from "@/lib/session";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold text-gray-900">
            商品管理后台
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Suspense>
              <Greeting />
            </Suspense>
            <form action={logout}>
              <button type="submit" className="text-indigo-600 hover:underline">
                退出登录
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Suspense fallback={<p className="text-sm text-gray-400">加载中…</p>}>{children}</Suspense>
      </main>
    </div>
  );
}

// 读取 Cookie 属于请求时数据，需放在 Suspense 内
async function Greeting() {
  const session = await requireSession();
  return <span className="text-gray-500">你好，{session.username}</span>;
}
