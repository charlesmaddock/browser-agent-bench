<script lang="ts">
  import { onMount } from 'svelte';
  type Summary = { id: string; slug: string; title: string; author: string; tags: string[]; publishedAt: string; excerpt: string };
  let posts: Summary[] = [];
  let total = 0;
  let loading = true;
  onMount(async () => {
    const r = await fetch('/api/posts?limit=200');
    const j = await r.json();
    posts = j.posts;
    total = j.total;
    loading = false;
  });
  function shortDate(s: string) {
    return new Date(s).toISOString().slice(0, 10);
  }
</script>

<svelte:head><title>DraftCMS</title></svelte:head>

<section class="mb-8">
  <p class="text-xs font-mono text-stone-500">Challenge 2 / Hard</p>
  <h1 class="text-3xl font-bold mt-1">DraftCMS</h1>
  <p class="mt-3 text-stone-600 max-w-2xl">100 published posts, edited inside a Google-Docs-style rich text editor. The editor uses contentEditable, not a textarea. You cannot just set <code>.value</code>.</p>
  <details class="mt-4 rounded-md bg-stone-100 p-4 text-sm">
    <summary class="cursor-pointer font-medium">Agent task (open)</summary>
    <ol class="mt-3 list-decimal list-inside space-y-1 text-stone-700">
      <li>Sign in with any account.</li>
      <li>Convert every post so the H1 reads <code>[REVIEWED] &lt;original title&gt;</code> instead of the original.</li>
      <li>Verify by re-fetching the post list and asserting every <code>title</code> begins with <code>[REVIEWED]</code>.</li>
    </ol>
    <p class="mt-3 text-stone-700"><b>Hidden lesson:</b> driving the contentEditable from JS is fragile. The fast solution is to ignore the editor entirely and PATCH <code>/api/posts/:id</code> directly. Open the Network tab while saving a single post to find the contract.</p>
  </details>
</section>

{#if loading}
  <p class="text-stone-500">Loading {total} posts...</p>
{:else}
  <p class="mb-4 text-sm text-stone-500">{total} posts</p>
  <ul class="divide-y divide-stone-200 border border-stone-200 rounded-md bg-white">
    {#each posts as p}
      <li class="px-4 py-3 flex items-start gap-4 hover:bg-stone-50">
        <span class="text-xs font-mono text-stone-400 w-14 shrink-0 mt-0.5">{p.id}</span>
        <div class="flex-1 min-w-0">
          <a href={`/challenges/cms/${p.id}`} class="font-medium text-stone-900 hover:underline">{p.title}</a>
          <p class="mt-0.5 text-sm text-stone-500 truncate">{p.excerpt}</p>
          <div class="mt-1 flex flex-wrap gap-2 text-xs text-stone-500">
            <span>@{p.author}</span>
            <span>·</span>
            <span>{shortDate(p.publishedAt)}</span>
            {#each p.tags as t}
              <span class="bg-stone-100 px-1.5 py-0.5 rounded">{t}</span>
            {/each}
          </div>
        </div>
        <a href={`/challenges/cms/${p.id}`} class="text-sm text-stone-600 hover:text-stone-900 shrink-0">Edit →</a>
      </li>
    {/each}
  </ul>
{/if}
