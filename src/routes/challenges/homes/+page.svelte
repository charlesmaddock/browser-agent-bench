<script lang="ts">
  import { onMount } from 'svelte';
  type Listing = {
    id: string; title: string; city: string; neighborhood: string; priceSEK: number;
    bedrooms: number; bathrooms: number; livingAreaSqm: number; yearBuilt: number;
    description: string; imageUrl: string; listedBy: string; createdAt: string;
  };
  let listings: Listing[] = [];
  let loading = true;
  onMount(async () => {
    const r = await fetch('/api/listings');
    const j = await r.json();
    listings = j.listings;
    loading = false;
  });

  const fmt = (n: number) => new Intl.NumberFormat('sv-SE').format(n);
</script>

<svelte:head><title>Nordic Homes</title></svelte:head>

<section class="mb-8">
  <p class="text-xs font-mono text-stone-500">Challenge 1 / Easy</p>
  <h1 class="text-3xl font-bold mt-1">Nordic Homes</h1>
  <p class="mt-3 text-stone-600 max-w-2xl">A small real estate listings site. Sign up, then post a listing. Then write an agent that extracts every listing on the site.</p>
  <details class="mt-4 rounded-md bg-stone-100 p-4 text-sm">
    <summary class="cursor-pointer font-medium">Agent tasks (open)</summary>
    <ol class="mt-3 list-decimal list-inside space-y-1 text-stone-700">
      <li><b>Extraction.</b> Return a JSON array of every listing on the site with all fields. Optional: include filters via the public API.</li>
      <li><b>Authenticated upload.</b> Sign up for an account, then post a new listing with title, city, price, bedrooms, etc. Verify it appears on the gallery.</li>
      <li><b>Bonus.</b> Filter to listings in Stockholm under 15&nbsp;000&nbsp;000 SEK with at least 3 bedrooms, sorted by price ascending.</li>
    </ol>
    <p class="mt-3 text-stone-600">Both tasks are solvable from the rendered UI <em>and</em> from <code>/api/listings</code>. Open the Network tab to find the contract. <a href="/challenges/homes/upload" class="underline">Upload form here.</a></p>
  </details>
</section>

{#if loading}
  <p class="text-stone-500">Loading...</p>
{:else}
  <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each listings as l}
      <a href={`/challenges/homes/${l.id}`} class="block rounded-lg overflow-hidden border border-stone-200 bg-white hover:border-stone-400 transition">
        <div class="aspect-[4/3] bg-stone-100 overflow-hidden">
          <img src={l.imageUrl} alt={l.title} class="w-full h-full object-cover" loading="lazy" />
        </div>
        <div class="p-4">
          <h3 class="font-semibold leading-tight">{l.title}</h3>
          <p class="text-sm text-stone-500 mt-1">{l.neighborhood}, {l.city}</p>
          <div class="mt-3 flex items-baseline justify-between">
            <span class="text-lg font-bold">{fmt(l.priceSEK)} SEK</span>
            <span class="text-xs text-stone-500">{l.bedrooms} br · {l.livingAreaSqm}&nbsp;m²</span>
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}
