<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';

  type Post = { id: string; slug: string; title: string; author: string; body: string; tags: string[]; publishedAt: string };
  let post: Post | null = null;
  let loading = true;
  let saving = false;
  let savedAt = '';
  let error = '';
  let editor: HTMLDivElement;

  onMount(async () => {
    const id = $page.params.id;
    const r = await fetch(`/api/posts/${id}`);
    if (!r.ok) { error = 'Not found'; loading = false; return; }
    const j = await r.json();
    post = j.post;
    loading = false;
    await tick();
    if (editor && post) editor.innerHTML = post.body;
  });

  function format(cmd: string, value?: string) {
    // Yes, execCommand is deprecated. It's still the simplest way to demo a
    // legacy WYSIWYG and the whole point is that agents shouldn't drive this.
    document.execCommand(cmd, false, value);
    editor.focus();
  }
  function block(tag: string) {
    document.execCommand('formatBlock', false, tag);
    editor.focus();
  }

  async function save() {
    if (!post) return;
    saving = true;
    error = '';
    const body = editor.innerHTML;
    // Pull updated title from first h1 inside the body, falling back to existing
    const m = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = m ? m[1].replace(/<[^>]+>/g, '').trim() : post.title;
    const res = await fetch(`/api/posts/${post.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title, body })
    });
    saving = false;
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      error = j.message || 'Save failed. Are you logged in?';
      return;
    }
    const j = await res.json();
    post = j.post;
    savedAt = new Date().toLocaleTimeString();
  }
</script>

<svelte:head><title>{post?.title ?? 'Post'}</title></svelte:head>

<a href="/challenges/cms" class="text-sm text-stone-500 hover:text-stone-900">← All posts</a>

{#if loading}
  <p class="mt-4 text-stone-500">Loading...</p>
{:else if error && !post}
  <p class="mt-4 text-red-600">{error}</p>
{:else if post}
  <div class="mt-3 flex items-baseline justify-between">
    <p class="text-xs font-mono text-stone-500">{post.id} · @{post.author}</p>
    <div class="flex items-center gap-3 text-sm">
      {#if savedAt}<span class="text-green-700">Saved at {savedAt}</span>{/if}
      {#if error}<span class="text-red-600">{error}</span>{/if}
      <button on:click={save} disabled={saving} class="rounded-md bg-stone-900 text-white px-4 py-1.5 hover:bg-stone-700 disabled:opacity-50">
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  </div>

  <div class="mt-4 rounded-lg border border-stone-200 bg-white">
    <div class="flex flex-wrap items-center gap-1 border-b border-stone-200 px-2 py-1.5 text-sm">
      <button title="Heading 1" class="px-2 py-1 rounded hover:bg-stone-100 font-bold" on:click={() => block('h1')}>H1</button>
      <button title="Heading 2" class="px-2 py-1 rounded hover:bg-stone-100 font-bold" on:click={() => block('h2')}>H2</button>
      <button title="Heading 3" class="px-2 py-1 rounded hover:bg-stone-100 font-bold" on:click={() => block('h3')}>H3</button>
      <button title="Paragraph" class="px-2 py-1 rounded hover:bg-stone-100" on:click={() => block('p')}>P</button>
      <span class="mx-1 text-stone-300">|</span>
      <button title="Bold" class="px-2 py-1 rounded hover:bg-stone-100 font-bold" on:click={() => format('bold')}>B</button>
      <button title="Italic" class="px-2 py-1 rounded hover:bg-stone-100 italic" on:click={() => format('italic')}>I</button>
      <button title="Underline" class="px-2 py-1 rounded hover:bg-stone-100 underline" on:click={() => format('underline')}>U</button>
      <span class="mx-1 text-stone-300">|</span>
      <button title="Unordered list" class="px-2 py-1 rounded hover:bg-stone-100" on:click={() => format('insertUnorderedList')}>• List</button>
      <button title="Ordered list" class="px-2 py-1 rounded hover:bg-stone-100" on:click={() => format('insertOrderedList')}>1. List</button>
      <button title="Blockquote" class="px-2 py-1 rounded hover:bg-stone-100" on:click={() => block('blockquote')}>“ Quote</button>
      <button title="Code block" class="px-2 py-1 rounded hover:bg-stone-100 font-mono" on:click={() => block('pre')}>{`{ }`}</button>
    </div>
    <div bind:this={editor} contenteditable="true" class="cms-editor px-6 py-4 prose prose-stone max-w-none" data-testid="post-editor"></div>
  </div>

  <p class="mt-4 text-xs text-stone-500">Tip for agents: skip the editor. PATCH <code>/api/posts/{post.id}</code> with <code>{`{ title, body }`}</code> and your session cookie.</p>
{/if}
