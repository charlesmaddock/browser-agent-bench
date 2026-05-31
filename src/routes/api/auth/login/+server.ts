import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findUserByEmail, verifyPassword, createSession, publicUser } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') throw error(400, 'Invalid JSON');
  const { email, password } = body as Record<string, string>;
  if (!email || !password) throw error(400, 'email and password are required');
  const user = await findUserByEmail(email);
  if (!user) throw error(401, 'Invalid credentials');
  const ok = await verifyPassword(user, password);
  if (!ok) throw error(401, 'Invalid credentials');
  await createSession(user.id, cookies);
  return json({ user: publicUser(user) });
};
