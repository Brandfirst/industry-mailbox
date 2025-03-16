
import { saveEmailToDatabase } from '../database.ts';

/**
 * Process and save emails to database
 * @param emails Array of email objects to process
 * @param accountId The account ID these emails belong to
 * @param supabase The Supabase client instance
 * @param verbose Whether to log detailed information
 * @returns Object containing sync results
 */
export async function processEmails(emails: any[], accountId: string, supabase: any, verbose: boolean) {
  const synced: any[] = [];
  const failed: any[] = [];
  const uniqueSenders = new Set<string>();
  let error = null;

  if (!emails || emails.length === 0) {
    if (verbose) {
      console.log('No emails to process - this is OK (empty inbox or all synced)');
    }
    // Return empty arrays but not an error - this is a successful sync with zero emails
    return { synced: [], failed: [], uniqueSenders: new Set(), error: null };
  }

  if (verbose) {
    console.log(`Processing ${emails.length} emails for account ${accountId}`);
  }

  try {
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
      } catch (emailError) {
        console.error(`Error processing email ${email.id}:`, emailError);
        failed.push({
          id: email.id,
          error: emailError.message || String(emailError),
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (processingError) {
    console.error('Error in batch email processing:', processingError);
    error = processingError;
  }
  
  return { synced, failed, uniqueSenders, error };
}
