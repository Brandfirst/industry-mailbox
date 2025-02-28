
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, formData: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

// Define a list of admin emails for testing/backup purposes
const ADMIN_EMAILS = ['christina@brandfirst.no'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Use refs to track state without causing re-renders
  const profileRoleFetchAttempted = useRef(false);
  const debugLogged = useRef(false);
  const sessionCheckAttempted = useRef(false);
  const authChangeHandlers = useRef<NodeJS.Timeout[]>([]);

  // Derive admin status from multiple sources
  const isPremium = user?.user_metadata?.premium === true;
  const isAdmin = 
    user?.user_metadata?.role === 'admin' || 
    profileRole === 'admin' ||
    (user?.email && ADMIN_EMAILS.includes(user.email));

  const fetchProfileRole = useCallback(async (userId: string) => {
    // If we've already attempted to fetch the profile role, don't try again
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

  // Clean up corrupted localStorage on startup
  useEffect(() => {
    try {
      // Clean up 'professional' item if it's corrupted
      try {
        const professionalItem = localStorage.getItem('professional');
        if (professionalItem !== null) {
          try {
            JSON.parse(professionalItem);
          } catch (e) {
            console.warn("Found corrupted 'professional' item in localStorage, removing it");
            localStorage.removeItem('professional');
          }
        }
      } catch (e) {
        console.error("Error checking 'professional' localStorage item:", e);
      }
      
      // Check other key localStorage items for corruption
      try {
        const keysToCheck = ['supabase.auth.token'];
        for (const key of keysToCheck) {
          const item = localStorage.getItem(key);
          if (item !== null) {
            try {
              JSON.parse(item);
            } catch (e) {
              console.warn(`Found corrupted '${key}' item in localStorage, removing it`);
              localStorage.removeItem(key);
            }
          }
        }
      } catch (e) {
        console.error("Error checking localStorage items:", e);
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
    }
  }, []);

  // Log auth state once and only when it actually changes
  useEffect(() => {
    // Skip repeated logs with same values
    const authStateSnapshot = JSON.stringify({
      userExists: !!user,
      isAdmin,
      email: user?.email,
      isLoading,
      authInitialized
    });
    
    if (!debugLogged.current) {
      console.log("Auth Debug (INITIAL):", {
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
    } else {
      // Limit debug logs to only once
      // console.log("Auth state updated");
    }
  }, [user, isAdmin, profileRole, isLoading, authInitialized]);

  useEffect(() => {
    let mounted = true;

    // Function to ensure loading state gets cleared
    const ensureLoadingCleared = () => {
      if (mounted && isLoading) {
        console.log("Ensuring loading state is cleared");
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };

    // Initial session check - only performed once
    const checkSession = async () => {
      if (sessionCheckAttempted.current) return;
      sessionCheckAttempted.current = true;
      
      try {
        setIsLoading(true);
        
        // Short timeout to prevent getting stuck in loading state (1.5 seconds)
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn("Initial session check timed out, forcing completion");
            ensureLoadingCleared();
          }
        }, 1500);
        
        // Ultra-safe backup timeout (3 seconds)
        const backupTimeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.warn("BACKUP TIMEOUT: Forcing auth loading to complete");
            ensureLoadingCleared();
          }
        }, 3000);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Clear timeout as we got a response
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
              // Don't wait for profile role to set loading to false
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
        
        // Always ensure loading is completed after getting session
        ensureLoadingCleared();
        clearTimeout(backupTimeoutId);
      } catch (error) {
        console.error("Error checking session:", error);
        ensureLoadingCleared();
      }
    };

    checkSession();

    // Listen for auth changes with major debouncing
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only log significant auth events
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        console.log("Auth state changed:", event, session ? "session exists" : "no session");
      }
      
      if (!mounted) return;
      
      // Clean up any pending timeouts
      authChangeHandlers.current.forEach(timeout => clearTimeout(timeout));
      
      // Use a single debounced handler
      const timeoutId = setTimeout(() => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !profileRoleFetchAttempted.current) {
          // Only fetch profile role if we haven't attempted it yet
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
        
        // Ensure auth is initialized and not loading
        if (!authInitialized) {
          setAuthInitialized(true);
        }
        
        // For sign-in events, ensure loading is cleared
        if (event === 'SIGNED_IN' && isLoading) {
          setIsLoading(false);
        }
      }, 500); // 500ms debounce
      
      authChangeHandlers.current.push(timeoutId);
    });

    // Extra safety measure: force isLoading to false after component mount
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

  const clearLocalStorage = useCallback(() => {
    try {
      // First try to selectively remove problematic items
      try {
        localStorage.removeItem('professional');
      } catch (e) {
        console.warn("Could not remove 'professional' item:", e);
      }
      
      // Remove all Supabase items
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('supabase.') || key === 'professional')) {
            keys.push(key);
          }
        }
        // Remove keys in a separate loop to avoid index shifting issues
        keys.forEach(key => localStorage.removeItem(key));
      } catch (e) {
        console.error("Error removing Supabase items from localStorage:", e);
      }
      
      console.log("Local storage cleared successfully");
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
  }, []);

  const signOut = async () => {
    try {
      console.log("Sign out initiated");
      
      // First clear our local state
      setUser(null);
      setSession(null);
      setProfileRole(null);
      
      // Clear localStorage before Supabase signOut
      clearLocalStorage();
      
      // Call Supabase signOut synchronously
      await supabase.auth.signOut();
      
      console.log("Sign out complete, redirecting...");
      
      // Force redirect to the home page immediately after signout completes
      window.location.href = '/';
      
    } catch (error) {
      console.error("Sign out error:", error);
      
      // Even on error, force clear state and redirect
      setUser(null);
      setSession(null);
      setProfileRole(null);
      clearLocalStorage();
      
      // Force redirect on error
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
