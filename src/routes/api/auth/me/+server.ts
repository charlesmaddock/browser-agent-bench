import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserFromCookies, publicUser } from '$lib/server/auth';

export const GET: RequestHandler = async ({ cookies }) => {
  const user = await getUserFromCookies(cookies);
  if (!user) return json({ user: null });
  return json({ user: publicUser(user) });
};
