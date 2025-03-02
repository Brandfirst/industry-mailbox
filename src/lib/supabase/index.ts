
// Main entry point that re-exports everything
import { supabase } from "@/integrations/supabase/client";

// Re-export all types from types.ts
export * from "./types";

// Re-export functionality from sub-modules
export * from "./userProfile";
export * from "./newsletters";
export * from "./categories";
export * from "./adminStats";

// Re-export all email account functionality
// Using the index file that already handles re-exports properly
export * from "./emailAccounts";

// Export the supabase instance for components that need direct access
export { supabase };
