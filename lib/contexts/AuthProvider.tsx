"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Session, User } from "@supabase/supabase-js";

const AuthContext = createContext<{
  user: User | null;
  session: Session | null;
}>({ user: null, session: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (
          event === "SIGNED_IN" &&
          session?.user &&
          (pathname === "/auth/login" || pathname === "/auth/signup")
        ) {
          router.push("/my-polls");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  return (
    <AuthContext.Provider value={{ user, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
