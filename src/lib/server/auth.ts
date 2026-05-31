import bcrypt from 'bcryptjs';
import type { Cookies } from '@sveltejs/kit';
import { readJSON, writeJSON, listKeys } from './blobs';

export type User = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: string;
};

export type SessionRow = {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

const SESSION_COOKIE = 'bab_session';
const SESSION_DAYS = 14;

function randomToken(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const keys = await listKeys('users', 'user:');
  for (const k of keys) {
    const u = await readJSON<User>('users', k);
    if (u && u.email.toLowerCase() === email.toLowerCase()) return u;
  }
  return null;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error('Email already in use');
  const passwordHash = await bcrypt.hash(password, 10);
  const id = randomToken().slice(0, 16);
  const u: User = {
    id,
    email: email.toLowerCase(),
    username,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  await writeJSON('users', `user:${id}`, u);
  return u;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function createSession(userId: string, cookies: Cookies): Promise<string> {
  const token = randomToken();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 86_400_000);
  const sess: SessionRow = {
    token,
    userId,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString()
  };
  await writeJSON('sessions', `sess:${token}`, sess);
  cookies.set(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: SESSION_DAYS * 86_400
  });
  return token;
}

export async function destroySession(cookies: Cookies) {
  const token = cookies.get(SESSION_COOKIE);
  if (token) {
    // best-effort delete
    try {
      await writeJSON('sessions', `sess:${token}`, { deleted: true });
    } catch {}
  }
  cookies.delete(SESSION_COOKIE, { path: '/' });
}

export async function getUserFromCookies(cookies: Cookies): Promise<User | null> {
  const token = cookies.get(SESSION_COOKIE);
  if (!token) return null;
  const sess = await readJSON<SessionRow & { deleted?: boolean }>('sessions', `sess:${token}`);
  if (!sess || sess.deleted) return null;
  if (new Date(sess.expiresAt).getTime() < Date.now()) return null;
  const user = await readJSON<User>('users', `user:${sess.userId}`);
  return user;
}

export function publicUser(u: User) {
  return { id: u.id, email: u.email, username: u.username, createdAt: u.createdAt };
}
