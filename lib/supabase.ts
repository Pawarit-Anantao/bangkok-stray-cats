import { createClient } from '@supabase/supabase-js';

// ดึงค่าจาก .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase URL or Anon Key is missing in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);