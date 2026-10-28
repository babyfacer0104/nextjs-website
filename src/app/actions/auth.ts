"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = { error?: string; username?: string } | undefined;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "请输入用户名和密码", username };
  }

  const validUser = process.env.ADMIN_USERNAME || "admin";
  const validPass = process.env.ADMIN_PASSWORD || "123456";
  if (username !== validUser || password !== validPass) {
    return { error: "用户名或密码错误", username };
  }

  await createSession(username);
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
