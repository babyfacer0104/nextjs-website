import LoginForm from "./login-form";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-indigo-50 to-sky-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-900">欢迎回来</h1>
        <p className="mt-1 text-sm text-gray-500">登录后进入商品管理后台</p>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-gray-400">默认账号 admin / 123456</p>
      </div>
    </main>
  );
}
