<script lang="ts">
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function submit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    loading = false;
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      error = j.message || 'Login failed';
      return;
    }
    location.href = '/';
  }
</script>

<svelte:head><title>Log in</title></svelte:head>
<div class="max-w-sm mx-auto">
  <h1 class="text-2xl font-bold">Log in</h1>
  <form on:submit={submit} class="mt-6 space-y-4">
    <div>
      <label class="block text-sm font-medium" for="email">Email</label>
      <input id="email" name="email" type="email" bind:value={email} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium" for="password">Password</label>
      <input id="password" name="password" type="password" bind:value={password} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
    </div>
    {#if error}<p class="text-sm text-red-600">{error}</p>{/if}
    <button type="submit" disabled={loading} class="w-full rounded-md bg-stone-900 text-white py-2 hover:bg-stone-700 disabled:opacity-50">
      {loading ? 'Signing in...' : 'Log in'}
    </button>
  </form>
  <p class="mt-4 text-sm text-stone-600">No account? <a href="/signup" class="underline">Sign up</a></p>
</div>
