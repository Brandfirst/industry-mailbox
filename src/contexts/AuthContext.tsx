
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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

  // Derive admin status from multiple sources:
  // 1. User metadata role
  // 2. Profile role from database
  // 3. Email in admin list (as a backup)
  const isPremium = user?.user_metadata?.premium === true;
  const isAdmin = 
    user?.user_metadata?.role === 'admin' || 
    profileRole === 'admin' ||
    (user?.email && ADMIN_EMAILS.includes(user.email));

  const fetchProfileRole = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no record is found
      
      if (error) {
        console.error("Error fetching profile role:", error);
        return null;
      }
      
      return profileData?.role || null;
    } catch (e) {
      console.error("Exception fetching profile role:", e);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
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
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Add a timeout to ensure we never get stuck in loading state
    const timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Authentication check timed out, forcing state to non-loading");
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session ? "session exists" : "no session");
      
      if (!mounted) return;

      // Set loading state for auth changes
      setIsLoading(true);
      
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
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  // Debug auth state
  useEffect(() => {
    console.log("Auth Debug:", {
      user,
      isAdmin,
      userMetadata: user?.user_metadata ? { message: "[Circular Reference to root.user.user_metadata]" } : undefined,
      role: profileRole,
      email: user?.email,
      isAdminByEmail: user?.email ? ADMIN_EMAILS.includes(user.email) : false
    });
  }, [user, isAdmin, profileRole]);

  // Make sure isAdmin state is set correctly each time user or profileRole changes
  useEffect(() => {
    const adminByEmail = user?.email && ADMIN_EMAILS.includes(user.email);
    console.log("Admin check:", {
      byUserMetadata: user?.user_metadata?.role === 'admin',
      byProfileRole: profileRole === 'admin',
      byEmail: adminByEmail,
      result: user?.user_metadata?.role === 'admin' || profileRole === 'admin' || adminByEmail
    });
  }, [user, profileRole]);

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
      
      // Clear local state first
      setUser(null);
      setSession(null);
      setProfileRole(null);
      
      // Safely clear localStorage items
      try {
        // Clear specific Supabase items to avoid the parsing error
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('professional');
        
        // Then clear everything else
        localStorage.clear();
      } catch (localStorageError) {
        console.error("Error clearing localStorage:", localStorageError);
      }
      
      // Call Supabase signOut
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during Supabase signOut:", error);
      }
      
      // Force a page reload to clear any remaining state
      window.location.href = '/';
      
    } catch (error) {
      console.error("Sign out error:", error);
      
      // Force clear everything even on error
      setUser(null);
      setSession(null);
      setProfileRole(null);
      
      try {
        localStorage.clear();
      } catch (e) {
        console.error("Error forcing localStorage clear:", e);
      }
      
      // Force redirect
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
