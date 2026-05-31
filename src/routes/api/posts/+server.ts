import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ensureSeeded } from '$lib/server/seed';
import { listKeys, readJSON } from '$lib/server/blobs';
import type { Post } from '$lib/server/seed-data-posts';

export const GET: RequestHandler = async ({ url }) => {
  await ensureSeeded();
  const keys = await listKeys('posts', 'post:');
  const all: Post[] = [];
  for (const k of keys) {
    const p = await readJSON<Post>('posts', k);
    if (p) all.push(p);
  }
  all.sort((a, b) => (a.id < b.id ? -1 : 1));

  // Pagination
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 100), 200);
  const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0);
  const page = all.slice(offset, offset + limit);

  // Strip body for list view to keep it light
  const summaries = page.map(({ body, ...rest }) => ({ ...rest, excerpt: body.slice(0, 160).replace(/<[^>]+>/g, '') }));
  return json({ posts: summaries, total: all.length, limit, offset });
};
