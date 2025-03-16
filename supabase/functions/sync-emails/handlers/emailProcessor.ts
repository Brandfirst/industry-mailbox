
import { saveEmailToDatabase } from '../database.ts';

/**
 * Process and save emails to database
 */
export async function processEmails(emails: any[], accountId: string, supabase: any, verbose: boolean) {
  const synced: any[] = [];
  const failed: any[] = [];
  const uniqueSenders = new Set<string>();

  for (const email of emails) {
    try {
      const savedEmail = await saveEmailToDatabase(email, accountId, supabase, verbose);
      if (savedEmail) {
        synced.push(savedEmail);
        
        // Track unique senders
        if (email.sender_email) {
          uniqueSenders.add(email.sender_email);
        }
      }
    } catch (error) {
      console.error(`Error processing email ${email.id}:`, error);
      failed.push({
        id: email.id,
        error: error.message
      });
    }
  }
  
  return { synced, failed, uniqueSenders };
}
