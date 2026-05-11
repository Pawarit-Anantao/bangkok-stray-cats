import { createBrowserClient } from '@supabase/ssr'

// ดึงค่าจาก Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase URL or Anon Key is missing in .env.local");
}

// ✨ แก้ไขจุดสำคัญ: ใช้ createBrowserClient เพื่อให้ Client-side อ่าน Cookie ได้
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);