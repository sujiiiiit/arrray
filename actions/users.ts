"use server";

import { getSupabaseAuth } from "@/lib/auth";
import { Provider } from "@supabase/supabase-js";

export const loginAction = async (provider: Provider) => {
  try {
    const { data, error } = await (
      await getSupabaseAuth()
    ).signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth`,
      },
    });

    if (error) throw error;

    return { errorMessage: null, url: data.url };
  } catch (error) {
    return { errorMessage: "Error logging in" };
  }
};

export const signOutAction = async () => {
  try {
    const { error } = await (await getSupabaseAuth()).signOut();
    if (error) throw error;

    return { errorMessage: null };
  } catch (error) {
    return { errorMessage: "Error signing out" };
  }
};

export const auth = async () => {
  const { data, error } = await (await getSupabaseAuth()).getSession();
  if (error) throw error;
  return data.session;
};
