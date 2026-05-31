import { listKeys, readJSON, writeJSON } from './blobs';
import { SEED_LISTINGS } from './seed-data-listings';
import { SEED_POSTS } from './seed-data-posts';

let seeded = false;

export async function ensureSeeded() {
  if (seeded) return;
  seeded = true;

  // Seed listings if empty
  const listingKeys = await listKeys('listings', 'listing:');
  if (listingKeys.length === 0) {
    for (const l of SEED_LISTINGS) {
      await writeJSON('listings', `listing:${l.id}`, l);
    }
  }

  // Seed posts if empty
  const postKeys = await listKeys('posts', 'post:');
  if (postKeys.length === 0) {
    for (const p of SEED_POSTS) {
      await writeJSON('posts', `post:${p.id}`, p);
    }
  }
}

// Re-seed on every cold start (best effort, since blobs may already be populated;
// we just check empty).
