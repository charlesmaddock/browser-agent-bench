<script lang="ts">
</script>

<svelte:head><title>browser-agent-bench</title></svelte:head>

<section class="mb-10">
  <h1 class="text-4xl font-bold tracking-tight">browser-agent-bench</h1>
  <p class="mt-3 text-stone-600 max-w-2xl">A small, real, deployable set of websites built specifically to test AI agents that drive a real browser. Each challenge has a documented goal and a hidden lesson. No app connectors, no SDKs, just the same primitives a person has: HTML, cookies, and the Network tab.</p>
</section>

<section class="grid gap-6 md:grid-cols-2">
  <a href="/challenges/homes" class="block rounded-lg border border-stone-200 bg-white p-5 hover:border-stone-400 transition">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Nordic Homes</h2>
      <span class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">Challenge 1 · Easy</span>
    </div>
    <p class="mt-2 text-stone-600 text-sm">A real estate listings site with signup, login, and authenticated uploads. The agent should sign up, post a new listing, and extract every listing on the site as JSON.</p>
    <div class="mt-4 flex flex-wrap gap-2 text-xs">
      <span class="bg-stone-100 text-stone-700 rounded-full px-2 py-0.5">cookies</span>
      <span class="bg-stone-100 text-stone-700 rounded-full px-2 py-0.5">forms</span>
      <span class="bg-stone-100 text-stone-700 rounded-full px-2 py-0.5">network panel</span>
    </div>
  </a>

  <a href="/challenges/cms" class="block rounded-lg border border-stone-200 bg-white p-5 hover:border-stone-400 transition">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">DraftCMS</h2>
      <span class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">Challenge 2 · Hard</span>
    </div>
    <p class="mt-2 text-stone-600 text-sm">100 published posts edited inside a Google-Docs-style contentEditable editor. The agent must rewrite formatting across every post. The hidden lesson: the API is faster than the editor.</p>
    <div class="mt-4 flex flex-wrap gap-2 text-xs">
      <span class="bg-stone-100 text-stone-700 rounded-full px-2 py-0.5">contentEditable</span>
      <span class="bg-stone-100 text-stone-700 rounded-full px-2 py-0.5">REST</span>
      <span class="bg-stone-100 text-stone-700 rounded-full px-2 py-0.5">reverse engineering</span>
    </div>
  </a>
</section>

<section class="mt-12 text-sm text-stone-600 prose prose-stone max-w-none">
  <h3>How to use</h3>
  <ol>
    <li>Pick a challenge above. Read its README block at the top of the page.</li>
    <li>Open DevTools, watch the Network tab, and try to complete the task.</li>
    <li>Each challenge is solvable from the UI <em>and</em> from the API. The point is to find the API.</li>
  </ol>
  <p>Source code, seed data, and the full HTTP contract live in the <a href="https://github.com/charlesmaddock/browser-agent-bench">GitHub repository</a>.</p>
</section>
