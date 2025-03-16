
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Newsletter } from '@/lib/supabase/types';
import { getNewsletterById } from '@/lib/supabase/newsletters/fetch';
import { ensureUtf8Encoding, debugLog } from '@/lib/utils/content-sanitization';

export const useNewsletterDetail = () => {
  const { id, sender, title } = useParams<{ id?: string; sender?: string; title?: string }>();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNewsletter = async () => {
      setLoading(true);
      
      try {
        let newsletterId: number | null = null;
        
        // Handle classic /newsletter/:id route
        if (id) {
          newsletterId = parseInt(id, 10);
          if (isNaN(newsletterId)) {
            throw new Error('Invalid newsletter ID');
          }
        } 
        // Handle SEO friendly route /:sender/:title-id
        else if (title) {
          console.log("Processing SEO-friendly URL with title slug:", title);
          // Extract the ID from the title slug (format: title-ID)
          const idMatch = title.match(/-(\d+)$/);
          if (idMatch && idMatch[1]) {
            newsletterId = parseInt(idMatch[1], 10);
            console.log("Extracted newsletter ID from slug:", newsletterId);
          }
          
          if (!newsletterId || isNaN(newsletterId)) {
            throw new Error('Invalid newsletter ID in URL');
          }
        } else {
          throw new Error('No newsletter identifier provided');
        }
        
        debugLog('REQUESTING newsletter with ID:', newsletterId);
        
        const { data, error } = await getNewsletterById(newsletterId);
        
        if (error) {
          console.error('Error fetching newsletter:', error);
          throw error;
        }
        
        if (data) {
          if (data.content) {
            const rawNordicChars = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
            debugLog('NORDIC CHARACTERS IN RAW DB DATA:', rawNordicChars || 'None found');
            
            const potentialDoubleEncoded = data.content.match(/Ã[…†˜¦ø¸]/g);
            if (potentialDoubleEncoded && potentialDoubleEncoded.length > 0) {
              debugLog('Potential double-encoded characters found:', potentialDoubleEncoded.join(', '));
            }
            
            debugLog('CONTENT DATA TYPE:', typeof data.content);
            debugLog('CONTENT SAMPLE (first 100 chars):', data.content.substring(0, 100));
            
            data.content = ensureUtf8Encoding(data.content);
            
            const hexDump = Array.from(data.content.substring(0, 20))
              .map(char => `${char} (0x${char.charCodeAt(0).toString(16)})`)
              .join(', ');
            debugLog('HEX DUMP OF FIRST 20 CHARS:', hexDump);
            
            if (data.title) {
              const titleNordicBefore = (data.title.match(/[ØÆÅøæå]/g) || []).join('');
              debugLog('NORDIC CHARS IN TITLE BEFORE:', titleNordicBefore || 'None found');
              data.title = ensureUtf8Encoding(data.title);
              const titleNordicAfter = (data.title.match(/[ØÆÅøæå]/g) || []).join('');
              debugLog('NORDIC CHARS IN TITLE AFTER:', titleNordicAfter || 'None found');
            }
            
            if (data.preview) {
              const previewNordicBefore = (data.preview.match(/[ØÆÅøæå]/g) || []).join('');
              debugLog('NORDIC CHARS IN PREVIEW BEFORE:', previewNordicBefore || 'None found');
              data.preview = ensureUtf8Encoding(data.preview);
              const previewNordicAfter = (data.preview.match(/[ØÆÅøæå]/g) || []).join('');
              debugLog('NORDIC CHARS IN PREVIEW AFTER:', previewNordicAfter || 'None found');
            }
            
            const nordicChars = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
            debugLog('NORDIC CHARACTERS IN HOOK AFTER PROCESSING:', nordicChars || 'None found');
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
  }, [id, sender, title]);

  return { newsletter, loading };
};
