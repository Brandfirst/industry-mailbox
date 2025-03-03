
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Newsletter } from '@/lib/supabase/types';
import { getNewsletterById } from '@/lib/supabase/newsletters/fetch';
import { ensureUtf8Encoding } from '@/lib/utils/sanitizeContent';

export const useNewsletterDetail = () => {
  const { id, sender, titleId } = useParams<{ id?: string; sender?: string; titleId?: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNewsletter = async () => {
      setLoading(true);
      
      try {
        let newsletterId: number | null = null;
        
        if (id) {
          newsletterId = parseInt(id, 10);
          if (isNaN(newsletterId)) {
            throw new Error('Invalid newsletter ID');
          }
        } else if (titleId) {
          const idMatch = titleId.match(/-(\d+)$/);
          if (idMatch && idMatch[1]) {
            newsletterId = parseInt(idMatch[1], 10);
          }
          
          if (!newsletterId || isNaN(newsletterId)) {
            throw new Error('Invalid newsletter ID in URL');
          }
        } else {
          throw new Error('No newsletter identifier provided');
        }
        
        console.log('REQUESTING newsletter with ID:', newsletterId);
        
        // Use the fetch utility instead of direct Supabase call
        const { data, error } = await getNewsletterById(newsletterId);
        
        if (error) {
          console.error('Error fetching newsletter:', error);
          throw error;
        }
        
        if (data) {
          // Ensure we have content as a properly encoded string
          if (data.content) {
            console.log('CONTENT DATA TYPE:', typeof data.content);
            console.log('CONTENT SAMPLE (first 100 chars):', data.content.substring(0, 100));
            
            // Apply our ensureUtf8Encoding function for consistent UTF-8 handling
            data.content = ensureUtf8Encoding(data.content);
            
            // Also ensure title and preview are properly encoded
            if (data.title) {
              data.title = ensureUtf8Encoding(data.title);
            }
            
            if (data.preview) {
              data.preview = ensureUtf8Encoding(data.preview);
            }
            
            // Search for nordic characters after processing
            const nordicChars = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
            console.log('NORDIC CHARACTERS IN HOOK AFTER PROCESSING:', nordicChars || 'None found');
          }
          
          setNewsletter(data);
          document.title = `${data?.title || 'Newsletter'} | NewsletterHub`;
        }
      } catch (error) {
        console.error('Error in fetchNewsletter:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletter();
  }, [id, sender, titleId]);

  return { newsletter, loading };
};
