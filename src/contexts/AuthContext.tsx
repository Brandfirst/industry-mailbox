
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
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

  // Derive admin status from multiple sources:
  // 1. User metadata role
  // 2. Profile role from database
  // 3. Email in admin list (as a backup)
  const isPremium = user?.user_metadata?.premium === true;
  const isAdmin = 
    user?.user_metadata?.role === 'admin' || 
    profileRole === 'admin' ||
    (user?.email && ADMIN_EMAILS.includes(user.email));

  const fetchProfileRole = useCallback(async (userId: string) => {
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

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Very important: Set a timeout to prevent getting stuck in loading state
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.warn("Initial session check timed out, forcing completion");
            setIsLoading(false);
            setAuthInitialized(true);
          }
        }, 2000);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Clear timeout as we got a response
        clearTimeout(timeoutId);
        
        if (!mounted) return;

        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          
          if (session.user) {
            try {
              const role = await fetchProfileRole(session.user.id);
              if (mounted) {
                setProfileRole(role);
                console.log("Initial session check - Profile role:", role);
              }
            } catch (profileError) {
              console.error("Error fetching profile role during session check:", profileError);
            }
          }
        }
        
        if (mounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (mounted) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "session exists" : "no session");
      
      if (!mounted) return;

      // We shouldn't set loading to true during these events as it causes flickering
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const role = await fetchProfileRole(session.user.id);
          if (mounted) {
            setProfileRole(role);
            console.log("Auth state changed - Profile role:", role);
          }
        } catch (profileError) {
          console.error("Error fetching profile role during auth state change:", profileError);
        }
      } else {
        setProfileRole(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileRole]);

  // Force isLoading to false if auth has been initialized for more than 3 seconds
  // This is a safety net to ensure we never get stuck in loading
  useEffect(() => {
    if (authInitialized && isLoading) {
      const timer = setTimeout(() => {
        console.warn('Auth has been initialized but is still loading after delay, forcing to false');
        setIsLoading(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [authInitialized, isLoading]);

  // Debug auth state
  useEffect(() => {
    console.log("Auth Debug:", {
      userExists: !!user,
      isAdmin,
      userMetadata: user?.user_metadata ? "[User metadata exists]" : undefined,
      role: profileRole,
      email: user?.email,
      isAdminByEmail: user?.email ? ADMIN_EMAILS.includes(user.email) : false,
      isLoading,
      authInitialized
    });
  }, [user, isAdmin, profileRole, isLoading, authInitialized]);

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
