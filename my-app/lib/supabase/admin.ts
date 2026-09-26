import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

export function isAdminEmail(email: string | null | undefined) {
  const adminEmail = process.env.SUPABASE_ADMIN_EMAIL?.trim().toLowerCase();
  return Boolean(email && adminEmail && email.trim().toLowerCase() === adminEmail);
}

export function hasAdminApiConfig() {
  return Boolean(getSupabaseConfig() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createAdminClient() {
  const config = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!config || !serviceRoleKey) {
    return null;
  }

  return createSupabaseClient(config.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}