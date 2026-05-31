import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ensureSeeded } from '$lib/server/seed';
import { readJSON } from '$lib/server/blobs';
import type { Listing } from '$lib/server/seed-data-listings';

export const GET: RequestHandler = async ({ params }) => {
  await ensureSeeded();
  const l = await readJSON<Listing>('listings', `listing:${params.id}`);
  if (!l) throw error(404, 'Listing not found');
  return json({ listing: l });
};
