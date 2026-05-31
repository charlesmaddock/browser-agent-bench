<script lang="ts">
  let title = '';
  let city = '';
  let neighborhood = '';
  let priceSEK = 5_000_000;
  let bedrooms = 3;
  let bathrooms = 1;
  let livingAreaSqm = 120;
  let yearBuilt = 2020;
  let description = '';
  let imageUrl = '/images/houses/house-01.jpg';
  let error = '';
  let loading = false;
  let success = '';

  const presetImages = Array.from({ length: 10 }, (_, i) => `/images/houses/house-${String(i + 1).padStart(2, '0')}.jpg`);

  async function submit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    success = '';
    const res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, city, neighborhood, priceSEK, bedrooms, bathrooms, livingAreaSqm, yearBuilt, description, imageUrl })
    });
    loading = false;
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      error = j.message || 'Upload failed. Are you logged in?';
      return;
    }
    const j = await res.json();
    success = `Listing created: ${j.listing.id}`;
    title = ''; description = '';
  }
</script>

<svelte:head><title>List a property</title></svelte:head>

<a href="/challenges/homes" class="text-sm text-stone-500 hover:text-stone-900">← Back to listings</a>
<h1 class="text-3xl font-bold mt-2">List a property</h1>
<p class="mt-2 text-stone-600 text-sm">Posting requires a logged-in account. You can also POST directly to <code>/api/listings</code> with your session cookie.</p>

<form on:submit={submit} class="mt-6 grid gap-4 sm:grid-cols-2 max-w-2xl">
  <label class="sm:col-span-2 text-sm">
    Title
    <input bind:value={title} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm">
    City
    <input bind:value={city} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm">
    Neighborhood
    <input bind:value={neighborhood} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm">
    Price (SEK)
    <input type="number" min="0" bind:value={priceSEK} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm">
    Living area (m²)
    <input type="number" min="1" bind:value={livingAreaSqm} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm">
    Bedrooms
    <input type="number" min="0" bind:value={bedrooms} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm">
    Bathrooms
    <input type="number" min="0" bind:value={bathrooms} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm sm:col-span-2">
    Year built
    <input type="number" min="1700" max="2100" bind:value={yearBuilt} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
  </label>
  <label class="text-sm sm:col-span-2">
    Description
    <textarea bind:value={description} rows="4" required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2"></textarea>
  </label>
  <fieldset class="sm:col-span-2">
    <legend class="text-sm">Image</legend>
    <div class="mt-2 grid grid-cols-5 gap-2">
      {#each presetImages as src}
        <button type="button" on:click={() => (imageUrl = src)} class="aspect-[4/3] rounded-md overflow-hidden border-2 {imageUrl === src ? 'border-stone-900' : 'border-transparent'} hover:border-stone-400">
          <img {src} alt="" class="w-full h-full object-cover" />
        </button>
      {/each}
    </div>
    <p class="mt-2 text-xs text-stone-500">Or send any URL via the JSON API: <code>{`{ "imageUrl": "https://..." }`}</code></p>
  </fieldset>

  {#if error}<p class="sm:col-span-2 text-sm text-red-600">{error}</p>{/if}
  {#if success}<p class="sm:col-span-2 text-sm text-green-700">{success}</p>{/if}

  <div class="sm:col-span-2">
    <button type="submit" disabled={loading} class="rounded-md bg-stone-900 text-white px-4 py-2 hover:bg-stone-700 disabled:opacity-50">
      {loading ? 'Posting...' : 'Post listing'}
    </button>
  </div>
</form>
