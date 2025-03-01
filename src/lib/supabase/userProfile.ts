
import { supabase } from "@/integrations/supabase/client";

// User profile functions
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data;
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return data;
}

// Get all user profiles (for admin use)
export async function getUserProfiles() {
  try {
    // First, get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error("Error fetching user profiles:", profilesError);
      throw profilesError;
    }

    // Then get email info from auth.users via admin API
    // In a production app, this would be done through a secure edge function
    // This is a simplified example that would need proper implementation
    
    // For now, we'll return the profiles with mock email data
    // In a real implementation, you would need to match users with their emails
    // through an admin function or edge function with proper permissions
    
    const enrichedProfiles = profiles.map(profile => ({
      ...profile,
      email: `user_${profile.id.substring(0, 6)}@example.com` // Placeholder email
    }));

    return enrichedProfiles;
  } catch (error) {
    console.error("Error in getUserProfiles:", error);
    throw error;
  }
}
