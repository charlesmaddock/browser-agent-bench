# browser-agent-bench

A small, deployable set of websites built specifically to test AI agents that drive a real browser.

Each challenge is a real, working web app with persistent state. Each one is solvable from the rendered UI **and** from a plain HTTP client with cookies. The point of the benchmark is to see whether your agent can find the API, not just click around.

Live site: https://browser-agent-bench.netlify.app *(once deployed)*

## Why this exists

Most browser benchmarks either:

- Test passive reading on canned HTML pages, or
- Hit production sites that are unstable, login-walled, or unethical to scrape at scale.

This repo is the third option: a public sandbox that an agent can sign up to, write to, and break things on. Reset periodically. Designed to be boring on the surface and instructive in the details.

## Challenges

### 1. Nordic Homes — Easy

A real estate listings site with image gallery, listing detail pages, signup, login, and authenticated uploads.

**Agent tasks:**

1. **Extract** every listing on the site as structured JSON.
2. **Sign up**, **log in**, and **POST** a new listing with title, city, price, bedrooms, image, etc.
3. **Filter** to listings matching specific criteria (city, price range, bedrooms).

**Lesson:** an agent that opens the Network tab will find `/api/listings` immediately and solve both tasks with `fetch()` instead of clicking through the UI.

### 2. DraftCMS — Hard

100 published blog posts edited inside a Google-Docs-style **contentEditable** rich text editor. There is no `<textarea>`. You cannot just set `.value`.

**Agent task:**

1. Sign in.
2. Rewrite every post so the H1 reads `[REVIEWED] <original title>`.
3. Verify by re-fetching the post list — every `title` must start with `[REVIEWED]`.

**Lesson:** driving the contentEditable from JS is fragile and slow. The fast solution is to PATCH `/api/posts/:id` directly. Open DevTools, save a post, watch the request, replay it 100 times.

## HTTP contract

```
GET   /api/listings                 → { listings, total }
GET   /api/listings?city=Stockholm&minPrice=5000000&maxPrice=20000000&minBeds=3
GET   /api/listings/:id             → { listing }
POST  /api/listings                 → { listing }       (auth required)

GET   /api/posts?limit=200&offset=0 → { posts, total }  (no body field — use /api/posts/:id for full)
GET   /api/posts/:id                → { post }          (includes body)
PATCH /api/posts/:id                → { post }          (auth required)

POST  /api/auth/signup              → { user }          { email, username, password }
POST  /api/auth/login               → { user }          { email, password }
POST  /api/auth/logout              → { ok }
GET   /api/auth/me                  → { user | null }
```

The session cookie is `bab_session`, HttpOnly, SameSite=Lax, Secure in production. Send it as a regular cookie — the browser does it automatically, and `curl --cookie-jar cookies.txt` or `fetch(..., { credentials: 'include' })` works fine.

## Stack

- [SvelteKit](https://kit.svelte.dev) + `@sveltejs/adapter-netlify`
- [Netlify Blobs](https://docs.netlify.com/blobs/overview/) for persistence
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing
- HttpOnly session cookies

## Run locally

```bash
npm install
npm run dev
```

The local dev server falls back to an in-memory blob store; data resets every restart. In production on Netlify, data persists in Netlify Blobs.

## Adding a challenge

1. Add a new folder under `src/routes/challenges/<slug>/`.
2. Add new API routes under `src/routes/api/<slug>/`.
3. Document the agent task in the page header and add a card on the home page.

## License

MIT.

---

Made by [@charlesmaddock](https://github.com/charlesmaddock) and his AI companion Herbert Pocket while stress-testing Strawberry Browser's agent sandbox. The whole repo took a few minutes.
