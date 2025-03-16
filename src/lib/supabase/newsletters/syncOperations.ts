
import { supabase } from "@/integrations/supabase/client";

/**
 * Sync email account newsletters - function to bridge the Edge Function call
 */
export async function syncEmailAccountNewsletters(accountId: string) {
  try {
    if (!accountId) {
      return { success: false, error: "No account ID provided" };
    }

    console.log("Syncing newsletters for account:", accountId);
    
    // We'll use the existing syncEmailAccount function from emailAccounts
    const { syncEmailAccount } = await import("../emailAccounts");
    const result = await syncEmailAccount(accountId);
    
    // Format the response to match what our component expects
    return {
      success: result.success,
      count: result.count || 0,
      error: result.error || null,
      warnings: result.warning ? [result.warning] : [],
    };
  } catch (error) {
    console.error("Error in syncEmailAccountNewsletters:", error);
    return {
      success: false,
      count: 0,
      error: `Failed to sync newsletters: ${error.message || String(error)}`,
    };
  }
}
