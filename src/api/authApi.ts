import { supabase } from "@/lib/supabase";
import type { AuthCredentials } from "@/types/types";

const getAuthErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Authentication failed";
};

const requestAuth = async (request: Promise<{ error: Error | null }>) => {
  try {
    const { error } = await request;

    if (error) {
      throw error;
    }
  } catch (error) {
    throw new Error(getAuthErrorMessage(error), { cause: error });
  }
};

export const authApi = {
  signIn: (credentials: AuthCredentials) =>
    requestAuth(supabase.auth.signInWithPassword(credentials)),
  signOut: () => requestAuth(supabase.auth.signOut()),
  signUp: (credentials: AuthCredentials) =>
    requestAuth(supabase.auth.signUp(credentials)),
};
