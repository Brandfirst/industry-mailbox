
import { removeTrackingPixels } from './content.ts';

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
          
          // Track unique senders - make sure to log sender info for debugging
          if (email.sender_email) {
            uniqueSenders.add(email.sender_email);
            if (verbose) {
              console.log(`Added sender to unique senders: ${email.sender_email}`);
            }
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
    
    // Log the unique senders
    if (verbose || uniqueSenders.size > 0) {
      console.log(`Found ${uniqueSenders.size} unique senders:`, Array.from(uniqueSenders));
    }
    
  } catch (processingError) {
    console.error('Error in batch email processing:', processingError);
    error = processingError;
  }
  
  return { synced, failed, uniqueSenders, error };
}

// Function to save an email to the database
export async function saveEmailToDatabase(email, accountId, supabase, verbose = false) {
  try {
    // Check if email already exists to avoid duplicates
    if (verbose) {
      console.log(`Checking if email ${email.id} already exists...`);
    }
    
    const { data: existingData } = await supabase
      .from('newsletters')
      .select('id')
      .eq('email_id', accountId)
      .eq('gmail_message_id', email.id)
      .maybeSingle();
    
    if (existingData) {
      if (verbose) {
        console.log(`Email ${email.id} already exists, skipping`);
      }
      return null;
    }
    
    // Prepare email data for saving
    const emailData = {
      email_id: accountId,
      gmail_message_id: email.id,
      gmail_thread_id: email.threadId,
      title: email.subject,
      sender_email: email.sender_email,
      sender: email.sender,
      content: email.html || email.snippet || '',
      published_at: email.date,
      preview: email.snippet || '',
    };
    
    if (verbose) {
      console.log(`Inserting email:`, {
        id: email.id,
        title: emailData.title,
        sender: emailData.sender
      });
    }
    
    // Pre-process content to remove tracking elements but preserve legitimate images
    if (emailData.content) {
      emailData.content = removeTrackingPixels(emailData.content);
      
      // Convert all image URLs to HTTPS for security
      emailData.content = emailData.content.replace(
        /(<img[^>]*src=["'])http:\/\/([^"']+["'][^>]*>)/gi, 
        '$1https://$2'
      );
      
      // Fix base64 encoded images if present (ensure they have proper formatting)
      emailData.content = emailData.content.replace(
        /(<img[^>]*src=["'])data:image\/([^;]+);base64,\s*/gi,
        '$1data:image/$2;base64,'
      );
      
      if (verbose) {
        console.log('Content processed: removed tracking elements, preserved legitimate images');
        
        // Count images after processing
        const imgTagCount = (emailData.content.match(/<img[^>]*>/gi) || []).length;
        console.log(`Number of image tags after processing: ${imgTagCount}`);
      }
    }
    
    // Insert email into database
    const { data, error } = await supabase
      .from('newsletters')
      .insert(emailData)
      .select()
      .single();
    
    if (error) {
      console.error(`Error saving email ${email.id}:`, error);
      throw error;
    }
    
    if (verbose) {
      console.log(`Saved email: ${data.title}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error processing email ${email.id}:`, error);
    throw error;
  }
}
