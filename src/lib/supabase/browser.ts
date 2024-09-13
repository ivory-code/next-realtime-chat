import { Database } from "@/lib/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

export const supabaseBrowser = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)