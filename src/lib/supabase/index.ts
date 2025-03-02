
// Main entry point that re-exports everything
import { supabase } from "@/integrations/supabase/client";

// Re-export all types and functions from sub-modules
export * from "./types";
export * from "./userProfile";
export * from "./newsletters";
export * from "./emailAccounts/index";
export * from "./categories";
export * from "./adminStats";

// Export the supabase instance for components that need direct access
export { supabase };
