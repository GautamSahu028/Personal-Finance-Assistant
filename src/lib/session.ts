import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { redis } from "@/lib/redis";

const SESSION_PREFIX = "session:";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const SESSION_COOKIE = "pfa_session";

export type SessionData = {
  userId: string;
  createdAt: number;
};

export async function createSession(userId: string): Promise<string> {
  const sessionId = randomBytes(24).toString("hex");
  const data: SessionData = { userId, createdAt: Date.now() };
  await redis.set(
    SESSION_PREFIX + sessionId,
    JSON.stringify(data),
    "EX",
    SESSION_TTL_SECONDS
  );
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return sessionId;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  const raw = await redis.get(SESSION_PREFIX + sessionId);
  if (!raw) return null;
  return JSON.parse(raw) as SessionData;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await redis.del(SESSION_PREFIX + sessionId);
  }
  cookieStore.delete(SESSION_COOKIE);
}
