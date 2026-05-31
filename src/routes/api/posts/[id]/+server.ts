import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ensureSeeded } from '$lib/server/seed';
import { readJSON, writeJSON } from '$lib/server/blobs';
import { getUserFromCookies } from '$lib/server/auth';
import type { Post } from '$lib/server/seed-data-posts';

export const GET: RequestHandler = async ({ params }) => {
  await ensureSeeded();
  const p = await readJSON<Post>('posts', `post:${params.id}`);
  if (!p) throw error(404, 'Post not found');
  return json({ post: p });
};

export const PATCH: RequestHandler = async ({ params, request, cookies }) => {
  const user = await getUserFromCookies(cookies);
  if (!user) throw error(401, 'Sign in to edit posts');

  const existing = await readJSON<Post>('posts', `post:${params.id}`);
  if (!existing) throw error(404, 'Post not found');

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') throw error(400, 'Invalid JSON');

  const next: Post = {
    ...existing,
    title: typeof body.title === 'string' ? body.title.slice(0, 200) : existing.title,
    body: typeof body.body === 'string' ? body.body.slice(0, 50_000) : existing.body,
    tags: Array.isArray(body.tags) ? body.tags.slice(0, 8).map(String) : existing.tags
  };

  await writeJSON('posts', `post:${params.id}`, next);
  return json({ post: next });
};
