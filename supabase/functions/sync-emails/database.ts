
import { removeTrackingElements } from './content.ts';

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
    
    // Pre-process content to remove tracking elements before saving
    if (emailData.content) {
      emailData.content = removeTrackingElements(emailData.content);
      if (verbose) {
        console.log('Tracking elements removed from email content before storage');
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
