import { createContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { AuthContextType, ADMIN_EMAILS } from "./types";
import { cleanLocalStorage, checkLocalStorageCorruption } from "./utils";
import { debugLog } from "@/lib/utils/content-sanitization/debugUtils";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  const profileRoleFetchAttempted = useRef(false);
  const debugLogged = useRef(false);
  const sessionCheckAttempted = useRef(false);
  const authChangeHandlers = useRef<NodeJS.Timeout[]>([]);

  const isPremium = user?.user_metadata?.premium === true;
  const isAdmin = 
    user?.user_metadata?.role === 'admin' || 
    profileRole === 'admin' ||
    (user?.email && ADMIN_EMAILS.includes(user.email));

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('user_is_admin', 'true');
    } else {
      localStorage.removeItem('user_is_admin');
    }
  }, [isAdmin]);

  const fetchProfileRole = useCallback(async (userId: string) => {
    if (profileRoleFetchAttempted.current) {
      return null;
    }
    
    profileRoleFetchAttempted.current = true;
    
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching profile role:", error);
        return null;
      }
      
      return profileData?.role || null;
    } catch (e) {
      console.error("Exception fetching profile role:", e);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!debugLogged.current) {
      debugLog("Auth Debug (INITIAL):", {
        userExists: !!user,
        isAdmin,
        userMetadata: user?.user_metadata ? "[User metadata exists]" : undefined,
        role: profileRole,
        email: user?.email,
        isAdminByEmail: user?.email ? ADMIN_EMAILS.includes(user.email) : false,
        isLoading,
        authInitialized
      });
      debugLogged.current = true;
    }
  }, [user, isAdmin, profileRole, isLoading, authInitialized]);

  useEffect(() => {
    checkLocalStorageCorruption();
  }, []);

  useEffect(() => {
    let mounted = true;

    const ensureLoadingCleared = () => {
      if (mounted && isLoading) {
        debugLog("Ensuring loading state is cleared");
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    const checkSession = async () => {
      if (sessionCheckAttempted.current) return;
      sessionCheckAttempted.current = true;
      
      try {
        setIsLoading(true);
        
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn("Initial session check timed out, forcing completion");
            ensureLoadingCleared();
          }
        }, 1500);
        
        const backupTimeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.warn("BACKUP TIMEOUT: Forcing auth loading to complete");
            ensureLoadingCleared();
          }
        }, 3000);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (!mounted) {
          clearTimeout(backupTimeoutId);
          return;
        }

        if (error) {
          console.error("Error getting session:", error);
          ensureLoadingCleared();
          clearTimeout(backupTimeoutId);
          return;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          
          if (session.user) {
            try {
              fetchProfileRole(session.user.id).then(role => {
                if (mounted) {
                  setProfileRole(role);
                }
              }).catch(err => {
                console.error("Error in profile role fetch:", err);
              });
            } catch (profileError) {
              console.error("Exception in profile role fetch:", profileError);
            }
          }
        }
        
        ensureLoadingCleared();
        clearTimeout(backupTimeoutId);
      } catch (error) {
        console.error("Error checking session:", error);
        ensureLoadingCleared();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        console.log("Auth state changed:", event, session ? "session exists" : "no session");
      }
      
      if (!mounted) return;
      
      authChangeHandlers.current.forEach(timeout => clearTimeout(timeout));
      
      const timeoutId = setTimeout(() => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !profileRoleFetchAttempted.current) {
          fetchProfileRole(session.user.id).then(role => {
            if (mounted) {
              setProfileRole(role);
            }
          }).catch(err => {
            console.error("Error in profile role fetch during auth change:", err);
          });
        } else if (!session) {
          setProfileRole(null);
        }
        
        if (!authInitialized) {
          setAuthInitialized(true);
        }
        
        if (event === 'SIGNED_IN' && isLoading) {
          setIsLoading(false);
        }
      }, 500);
      
      authChangeHandlers.current.push(timeoutId);
    });

    const forceLoadingFalse = setTimeout(() => {
      if (isLoading) {
        console.warn('Forcing isLoading to false after 2s component mount');
        setIsLoading(false);
        setAuthInitialized(true);
      }
    }, 2000);

    return () => {
      mounted = false;
      authChangeHandlers.current.forEach(timeout => clearTimeout(timeout));
      authChangeHandlers.current = [];
      clearTimeout(forceLoadingFalse);
      subscription.unsubscribe();
    };
  }, [fetchProfileRole, isLoading, authInitialized]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    formData: Record<string, string>
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...formData,
            premium: false,
            role: 'user'
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Sign up error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log("Sign out initiated");
      
      cleanLocalStorage();
      
      setUser(null);
      setSession(null);
      setProfileRole(null);
      
      try {
        await supabase.auth.signOut();
        console.log("Sign out complete, redirecting...");
      } catch (signOutError) {
        console.error("Error during Supabase signOut:", signOutError);
      }
      
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      
      setUser(null);
      setSession(null);
      setProfileRole(null);
      cleanLocalStorage();
      
      window.location.href = '/';
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=resetPassword`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  };

  const resetPassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Reset password error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isPremium,
    isAdmin,
    signIn,
    signUp,
    signOut,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
