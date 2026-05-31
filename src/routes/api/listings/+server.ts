import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ensureSeeded } from '$lib/server/seed';
import { listKeys, readJSON, writeJSON } from '$lib/server/blobs';
import { getUserFromCookies } from '$lib/server/auth';
import type { Listing } from '$lib/server/seed-data-listings';

export const GET: RequestHandler = async ({ url }) => {
  await ensureSeeded();
  const keys = await listKeys('listings', 'listing:');
  const all: Listing[] = [];
  for (const k of keys) {
    const l = await readJSON<Listing>('listings', k);
    if (l) all.push(l);
  }

  // Optional filters
  const city = url.searchParams.get('city');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const minBeds = url.searchParams.get('minBeds');

  let results = all;
  if (city) results = results.filter((l) => l.city.toLowerCase() === city.toLowerCase());
  if (minPrice) results = results.filter((l) => l.priceSEK >= Number(minPrice));
  if (maxPrice) results = results.filter((l) => l.priceSEK <= Number(maxPrice));
  if (minBeds) results = results.filter((l) => l.bedrooms >= Number(minBeds));

  results.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return json({ listings: results, total: results.length });
};

function randomId(prefix: string): string {
  const arr = new Uint8Array(6);
  crypto.getRandomValues(arr);
  return `${prefix}-${Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  const user = await getUserFromCookies(cookies);
  if (!user) throw error(401, 'Sign in to post a listing');

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') throw error(400, 'Invalid JSON');

  const required = ['title', 'city', 'neighborhood', 'priceSEK', 'bedrooms', 'bathrooms', 'livingAreaSqm', 'yearBuilt', 'description', 'imageUrl'];
  for (const f of required) {
    if (!(f in body)) throw error(400, `Missing field: ${f}`);
  }

  const id = randomId('u');
  const listing: Listing = {
    id,
    title: String(body.title).slice(0, 200),
    city: String(body.city).slice(0, 80),
    neighborhood: String(body.neighborhood).slice(0, 80),
    priceSEK: Number(body.priceSEK),
    bedrooms: Number(body.bedrooms),
    bathrooms: Number(body.bathrooms),
    livingAreaSqm: Number(body.livingAreaSqm),
    yearBuilt: Number(body.yearBuilt),
    description: String(body.description).slice(0, 4000),
    imageUrl: String(body.imageUrl).slice(0, 500),
    listedBy: user.username,
    createdAt: new Date().toISOString()
  };

  await writeJSON('listings', `listing:${id}`, listing);
  return json({ listing }, { status: 201 });
};
