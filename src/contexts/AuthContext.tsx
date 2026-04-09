import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: "admin" | "user" | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  profile: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const hasRestoredSessionRef = useRef(false);
  const activeRequestRef = useRef(0);

  const clearUserState = useCallback(() => {
    setRole(null);
    setProfile(null);
  }, []);

  const fetchUserData = useCallback(async (userId: string) => {
    const requestId = ++activeRequestRef.current;

    try {
      const [{ data: rolesData, error: rolesError }, { data: profileData, error: profileError }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.from("profiles").select("display_name, avatar_url, bio").eq("user_id", userId).maybeSingle(),
      ]);

      if (!isMountedRef.current || requestId !== activeRequestRef.current) {
        return;
      }

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
      }

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      }

      setRole(rolesData?.some((item) => item.role === "admin") ? "admin" : "user");
      setProfile(profileData ?? null);
    } catch (error) {
      if (!isMountedRef.current || requestId !== activeRequestRef.current) {
        return;
      }

      console.error("Error fetching user data:", error);
      setRole("user");
      setProfile(null);
    } finally {
      if (isMountedRef.current && hasRestoredSessionRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    const applySession = (nextSession: Session | null) => {
      if (!isMountedRef.current) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        activeRequestRef.current += 1;
        clearUserState();
        setLoading(false);
        return;
      }

      setLoading(true);
      window.setTimeout(() => {
        void fetchUserData(nextSession.user.id);
      }, 0);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!hasRestoredSessionRef.current) {
        return;
      }

      applySession(nextSession);
    });

    supabase.auth
      .getSession()
      .then(({ data: { session: restoredSession } }) => {
        hasRestoredSessionRef.current = true;
        applySession(restoredSession);
      })
      .catch((error) => {
        console.error("Error restoring session:", error);
        hasRestoredSessionRef.current = true;
        setSession(null);
        setUser(null);
        clearUserState();
        setLoading(false);
      });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [clearUserState, fetchUserData]);

  const signOut = useCallback(async () => {
    activeRequestRef.current += 1;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      if (isMountedRef.current) {
        setSession(null);
        setUser(null);
        clearUserState();
        setLoading(false);
      }
    }
  }, [clearUserState]);

  return (
    <AuthContext.Provider value={{ session, user, role, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
