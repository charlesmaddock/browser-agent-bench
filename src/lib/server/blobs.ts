import { getStore, type Store } from '@netlify/blobs';

// In Netlify production, getStore() picks up credentials automatically.
// In SvelteKit dev (`vite dev`) we fall back to an in-memory store.
type AnyStore = {
  get: (k: string, opts?: { type?: 'json' | 'text' | 'arrayBuffer' }) => Promise<any>;
  set: (k: string, v: any) => Promise<void>;
  delete: (k: string) => Promise<void>;
  list: (opts?: { prefix?: string }) => Promise<{ blobs: { key: string }[] }>;
};

const memory: Record<string, Map<string, any>> = {};

function memoryStore(name: string): AnyStore {
  if (!memory[name]) memory[name] = new Map();
  const m = memory[name];
  return {
    async get(k, opts) {
      const v = m.get(k);
      if (v === undefined) return null;
      if (opts?.type === 'json') return typeof v === 'string' ? JSON.parse(v) : v;
      return v;
    },
    async set(k, v) {
      m.set(k, typeof v === 'string' ? v : JSON.stringify(v));
    },
    async delete(k) {
      m.delete(k);
    },
    async list(opts) {
      const prefix = opts?.prefix ?? '';
      return { blobs: [...m.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key })) };
    }
  };
}

export function store(name: string): AnyStore {
  try {
    // @netlify/blobs auto-detects context on Netlify. On local dev it throws.
    return getStore(name) as unknown as AnyStore;
  } catch {
    return memoryStore(name);
  }
}

export async function readJSON<T>(name: string, key: string): Promise<T | null> {
  const s = store(name);
  const v = await s.get(key, { type: 'json' });
  return (v as T) ?? null;
}

export async function writeJSON(name: string, key: string, value: unknown) {
  const s = store(name);
  await s.set(key, JSON.stringify(value));
}

export async function listKeys(name: string, prefix = ''): Promise<string[]> {
  const s = store(name);
  const r = await s.list({ prefix });
  return r.blobs.map((b) => b.key);
}

export async function deleteKey(name: string, key: string) {
  const s = store(name);
  await s.delete(key);
}
