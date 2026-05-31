<script lang="ts">
  let email = '';
  let username = '';
  let password = '';
  let error = '';
  let loading = false;

  async function submit(e: Event) {
    e.preventDefault();
    loading = true;
    error = '';
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });
    loading = false;
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      error = j.message || 'Signup failed';
      return;
    }
    location.href = '/';
  }
</script>

<svelte:head><title>Sign up</title></svelte:head>
<div class="max-w-sm mx-auto">
  <h1 class="text-2xl font-bold">Create an account</h1>
  <p class="mt-2 text-sm text-stone-600">Used for posting listings and editing CMS posts. Data may reset.</p>
  <form on:submit={submit} class="mt-6 space-y-4">
    <div>
      <label class="block text-sm font-medium" for="email">Email</label>
      <input id="email" name="email" type="email" bind:value={email} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium" for="username">Username</label>
      <input id="username" name="username" type="text" minlength="2" maxlength="32" bind:value={username} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium" for="password">Password</label>
      <input id="password" name="password" type="password" minlength="6" bind:value={password} required class="mt-1 w-full rounded-md border border-stone-300 px-3 py-2" />
    </div>
    {#if error}<p class="text-sm text-red-600">{error}</p>{/if}
    <button type="submit" disabled={loading} class="w-full rounded-md bg-stone-900 text-white py-2 hover:bg-stone-700 disabled:opacity-50">
      {loading ? 'Creating...' : 'Sign up'}
    </button>
  </form>
  <p class="mt-4 text-sm text-stone-600">Already have an account? <a href="/login" class="underline">Log in</a></p>
</div>
