import type { Session } from "@supabase/supabase-js";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { authApi } from "@/api/authApi";
import { supabase } from "@/lib/supabase";

import { AuthContext, type AuthContextValue } from "./authCtx";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      signIn: async (email, password) => {
        await authApi.signIn({ email, password });
      },
      signUp: async (email, password) => {
        await authApi.signUp({ email, password });
      },
      signOut: async () => {
        await authApi.signOut();
      },
    }),
    [loading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};