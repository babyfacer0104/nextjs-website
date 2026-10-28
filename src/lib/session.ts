import "server-only";
import { io } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, encrypt, MAX_AGE, SESSION_COOKIE } from "./token";

export type { Session } from "./token";

export async function createSession(username: string) {
  const expiresAt = Date.now() + MAX_AGE * 1000;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encrypt({ username, expiresAt }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  await io(); // decrypt 内部用 Date.now() 判断过期，需声明为请求时数据
  return decrypt(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// 数据访问层：页面/操作里统一用它校验登录，未登录直接跳回首页
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/");
  return session;
}
