<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  type Listing = {
    id: string; title: string; city: string; neighborhood: string; priceSEK: number;
    bedrooms: number; bathrooms: number; livingAreaSqm: number; yearBuilt: number;
    description: string; imageUrl: string; listedBy: string; createdAt: string;
  };
  let listing: Listing | null = null;
  let loading = true;
  let error = '';
  onMount(async () => {
    const id = $page.params.id;
    const r = await fetch(`/api/listings/${id}`);
    if (!r.ok) { error = 'Not found'; loading = false; return; }
    const j = await r.json();
    listing = j.listing;
    loading = false;
  });
  const fmt = (n: number) => new Intl.NumberFormat('sv-SE').format(n);
</script>

<svelte:head><title>{listing?.title ?? 'Listing'}</title></svelte:head>

<a href="/challenges/homes" class="text-sm text-stone-500 hover:text-stone-900">← Back to listings</a>

{#if loading}
  <p class="mt-4 text-stone-500">Loading...</p>
{:else if error || !listing}
  <p class="mt-4 text-red-600">{error || 'Listing not found.'}</p>
{:else}
  <article class="mt-4">
    <div class="aspect-[16/9] bg-stone-100 rounded-lg overflow-hidden">
      <img src={listing.imageUrl} alt={listing.title} class="w-full h-full object-cover" />
    </div>
    <header class="mt-6">
      <h1 class="text-3xl font-bold">{listing.title}</h1>
      <p class="mt-1 text-stone-600">{listing.neighborhood}, {listing.city} · Built {listing.yearBuilt}</p>
    </header>
    <div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-700">
      <div><b>{fmt(listing.priceSEK)}</b> SEK</div>
      <div>{listing.livingAreaSqm}&nbsp;m²</div>
      <div>{listing.bedrooms} bedrooms</div>
      <div>{listing.bathrooms} bathrooms</div>
      <div>Listed by <span class="font-mono">@{listing.listedBy}</span></div>
    </div>
    <p class="mt-6 text-stone-800 leading-relaxed">{listing.description}</p>
  </article>
{/if}
