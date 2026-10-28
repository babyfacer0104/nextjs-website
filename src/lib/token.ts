import { createHmac, timingSafeEqual } from "node:crypto";

// 纯函数，不依赖 next/headers，可同时在 proxy 和服务端组件中使用
export const SESSION_COOKIE = "session";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 天

export type Session = { username: string; expiresAt: number };

function secret() {
  return process.env.SESSION_SECRET || "dev-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

// token 格式：base64url(JSON).签名
export function encrypt(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function decrypt(token: string | undefined): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}
