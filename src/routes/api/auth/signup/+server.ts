import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createUser, createSession, publicUser } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') throw error(400, 'Invalid JSON');
  const { email, username, password } = body as Record<string, string>;
  if (!email || !username || !password) throw error(400, 'email, username and password are required');
  if (password.length < 6) throw error(400, 'password must be at least 6 characters');
  try {
    const user = await createUser(email, username, password);
    await createSession(user.id, cookies);
    return json({ user: publicUser(user) }, { status: 201 });
  } catch (e: any) {
    throw error(409, e?.message || 'signup failed');
  }
};
