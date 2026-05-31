import { createClient } from "@supabase/supabase-js";
import {
  SUPABASE_SECRET_KEY,
  SUPABASE_URL,
} from "astro:env/server";

// Server-only Supabase client. Uses the service-role key, so it bypasses RLS
// on the newsletter_subscribers table — all writes must happen on the server.
// `persistSession: false` ensures no auth cookies are set: this client is for
// privileged DB access, not for managing an end-user session.
export const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
