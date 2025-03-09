'use server'

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getUser = async () => {
  const auth = await getSupabaseAuth();
  const user = (await auth.getUser()).data.user;

  return user;
};

export const getSupabaseAuth = async() => {
  const cookieStore = cookies(); // no need to await here, cookies() is synchronous

  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options });
          } catch (error) {
            console.error("Failed to set cookie:", error);
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: "", ...options });
          } catch (error) {
            console.error("Failed to remove cookie:", error);
          }
        },
      },
    }
  );
  return supabaseClient.auth;
};