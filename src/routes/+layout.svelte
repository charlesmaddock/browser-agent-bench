<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  let me: { username: string } | null = null;
  onMount(async () => {
    try {
      const r = await fetch('/api/auth/me');
      const j = await r.json();
      me = j.user;
    } catch {}
  });
  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    location.reload();
  }
</script>

<header class="border-b border-stone-200 bg-white">
  <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6">
    <a href="/" class="font-mono text-sm font-bold tracking-tight">browser-agent-bench</a>
    <nav class="flex items-center gap-4 text-sm text-stone-600">
      <a href="/challenges/homes" class="hover:text-stone-900">Nordic Homes</a>
      <a href="/challenges/cms" class="hover:text-stone-900">DraftCMS</a>
      <a href="/about" class="hover:text-stone-900">About</a>
    </nav>
    <div class="ml-auto text-sm">
      {#if me}
        <span class="text-stone-500">@{me.username}</span>
        <button on:click={logout} class="ml-3 text-stone-600 hover:text-stone-900 underline">Log out</button>
      {:else}
        <a href="/login" class="text-stone-600 hover:text-stone-900">Log in</a>
        <a href="/signup" class="ml-3 inline-block px-3 py-1 rounded-md bg-stone-900 text-white hover:bg-stone-700">Sign up</a>
      {/if}
    </div>
  </div>
</header>

<main class="max-w-5xl mx-auto px-4 py-10">
  <slot />
</main>

<footer class="border-t border-stone-200 mt-20 py-8 text-center text-xs text-stone-500">
  <p>browser-agent-bench is a sandbox for testing AI agents. Data resets periodically. <a class="underline" href="https://github.com/charlesmaddock/browser-agent-bench">Source on GitHub</a>.</p>
</footer>
