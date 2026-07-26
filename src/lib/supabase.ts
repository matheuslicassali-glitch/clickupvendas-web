import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = localStorage.getItem('clickup_supabase_url');
  const key = localStorage.getItem('clickup_supabase_key');
  if (!url || !key) return null;
  if (client && client.supabaseUrl === url) return client;
  client = createClient(url, key);
  return client;
}

export function setSupabaseConfig(url: string, key: string) {
  localStorage.setItem('clickup_supabase_url', url);
  localStorage.setItem('clickup_supabase_key', key);
  client = null;
}

export function clearSupabaseConfig() {
  localStorage.removeItem('clickup_supabase_url');
  localStorage.removeItem('clickup_supabase_key');
  client = null;
}

export function isSupabaseConfigured(): boolean {
  return !!localStorage.getItem('clickup_supabase_url') && !!localStorage.getItem('clickup_supabase_key');
}
