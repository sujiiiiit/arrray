"use server";

import { createSupabaseClient } from "@/supabase/server-client";
export const getUser = async () => {
  const auth = await getSupabaseAuth();
  const user = (await auth.getUser()).data.user;

  return user;
};

export const getSupabaseAuth = async () => {
  const supabase = await createSupabaseClient();

  return supabase.auth;
};
