export type Post = {
  id: string;
  slug: string;
  title: string;
  author: string;
  body: string; // HTML
  tags: string[];
  publishedAt: string;
};

const TOPICS = [
  'browsers', 'agents', 'web standards', 'reverse engineering', 'rich text editors',
  'http caching', 'cookies and sessions', 'service workers', 'web components',
  'rendering pipelines', 'devtools', 'progressive enhancement', 'oauth flows',
  'cors', 'csp headers', 'streaming responses', 'edge functions',
  'static site generation', 'web sockets', 'webrtc'
];

const ADJECTIVES = ['Practical', 'Hidden', 'Modern', 'Quiet', 'Forgotten', 'Pragmatic', 'Surprising', 'Elegant', 'Honest', 'Useful', 'Boring', 'Sharp', 'Sturdy'];
const VERBS = ['Notes on', 'A field guide to', 'Thinking about', 'Why we keep', 'How to stop', 'Rebuilding', 'Tracing', 'Inspecting', 'Auditing', 'Refactoring'];

const AUTHORS = ['ada.l', 'erik.s', 'maya.t', 'oskar.h', 'lin.k', 'noor.j', 'sara.v', 'jonas.p'];

const PARAGRAPHS = [
  'The browser is the most important piece of software most people interact with, and yet we treat it as an afterthought when designing for it. That changes the moment you try to instrument it from the outside.',
  'Most automation breaks not because the API is complicated but because the assumptions are wrong. A small selector change, a deferred render, a new layout shift, and a previously reliable flow goes silent.',
  'The fastest way to understand a black-box web app is to open the Network tab and watch what it actually does. The DOM is the surface; the requests are the truth.',
  'A good rule of thumb is that any UI a person can drive, an agent should be able to drive. The harder question is which of those UIs the agent should bother with.',
  'Cookies were designed for one thing and ended up doing several. The result is a security model that requires you to remember more state than the spec ever wanted you to.',
  'There is a tradition in this industry of building elaborate frameworks around problems that go away once you read the underlying RFC. The RFC is rarely as old or boring as you assumed.',
  'Rich text is hard in the same way that interpreting handwriting is hard. The data model exists in the writer\'s head and you only get fragments of it on the page.',
  'Caching is the second hardest problem in computer science but it is also the most rewarding to fix. A single Cache-Control header in the right place can pay rent on a server for years.',
  'When in doubt, do the boring thing twice and the clever thing never. Boring infrastructure compounds.',
  'It used to be acceptable to ship a 4 MB JavaScript bundle to a phone connected over 3G. Then mobile got faster, and somehow the bundles kept growing anyway.'
];

const LISTS = [
  ['observe network calls', 'find a stable id', 'replay the request', 'trim until it still works'],
  ['set the cookie', 'verify the cookie', 'refresh', 'apologize about cookies'],
  ['read the response', 'parse the response', 'cache the response', 'forget the response'],
  ['intent', 'consent', 'transport', 'storage'],
  ['draft', 'review', 'publish', 'forget'],
  ['hover', 'focus', 'click', 'wait']
];

const QUOTES = [
  'The truth is in the network, not the DOM.',
  'A schema is the cheapest documentation you will ever write.',
  'When in doubt, log the request.',
  'Reverse engineering is just careful reading.',
  'Forms are programs and you should treat them like programs.'
];

const CODE_BLOCKS = [
  'fetch("/api/listings", { credentials: "include" })\n  .then(r => r.json())\n  .then(console.log)',
  'document.cookie\n  .split("; ")\n  .find(c => c.startsWith("session="))',
  'const res = await fetch("/api/posts/42", {\n  method: "PATCH",\n  headers: { "content-type": "application/json" },\n  body: JSON.stringify({ body: "<h2>Updated</h2>" })\n})'
];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function pickSeeded<T>(arr: T[], seed: number, offset = 0): T {
  // Simple deterministic pick
  return arr[(seed * 31 + offset) % arr.length];
}

function makeTitle(i: number): string {
  if (i % 5 === 0) return `${pick(VERBS, i)} ${pick(TOPICS, i + 3)}`;
  if (i % 5 === 1) return `${pick(ADJECTIVES, i)} ${pick(TOPICS, i)}`;
  if (i % 5 === 2) return `On ${pick(TOPICS, i)} and ${pick(TOPICS, i + 7)}`;
  if (i % 5 === 3) return `${pick(VERBS, i + 2)} ${pick(TOPICS, i + 1)} from scratch`;
  return `What ${pick(TOPICS, i)} taught us about ${pick(TOPICS, i + 4)}`;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function makeBody(i: number): string {
  const parts: string[] = [];
  // Always start with an H1 (matches the editor render and gives agents a target)
  parts.push(`<h1>${makeTitle(i)}</h1>`);
  parts.push(`<p>${pickSeeded(PARAGRAPHS, i, 0)}</p>`);

  // Mix in formatting based on index
  if (i % 3 === 0) {
    parts.push(`<h2>${pick(ADJECTIVES, i)} notes</h2>`);
    parts.push(`<p>${pickSeeded(PARAGRAPHS, i, 1)} <em>${pickSeeded(QUOTES, i, 0)}</em></p>`);
  }

  if (i % 4 === 1) {
    const list = pickSeeded(LISTS, i, 0);
    parts.push(`<ol>${list.map((li) => `<li>${li}</li>`).join('')}</ol>`);
  } else if (i % 4 === 2) {
    const list = pickSeeded(LISTS, i, 1);
    parts.push(`<ul>${list.map((li) => `<li>${li}</li>`).join('')}</ul>`);
  }

  if (i % 7 === 0) {
    parts.push(`<blockquote>${pickSeeded(QUOTES, i, 2)}</blockquote>`);
  }

  if (i % 6 === 3) {
    parts.push(`<pre><code>${pickSeeded(CODE_BLOCKS, i, 0)}</code></pre>`);
  }

  parts.push(`<h3>Closing thought</h3>`);
  parts.push(`<p>${pickSeeded(PARAGRAPHS, i, 4)} <strong>${pick(ADJECTIVES, i)}</strong> work pays off.</p>`);

  return parts.join('\n');
}

function generate(): Post[] {
  const out: Post[] = [];
  const base = new Date('2026-01-01T09:00:00.000Z').getTime();
  for (let i = 1; i <= 100; i++) {
    const title = makeTitle(i);
    const slug = `${slugify(title)}-${i}`;
    const id = `p-${String(i).padStart(3, '0')}`;
    out.push({
      id,
      slug,
      title,
      author: pick(AUTHORS, i),
      body: makeBody(i),
      tags: [pick(TOPICS, i), pick(TOPICS, i + 5)],
      publishedAt: new Date(base + i * 86_400_000).toISOString()
    });
  }
  return out;
}

export const SEED_POSTS = generate();
