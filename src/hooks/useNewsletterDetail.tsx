import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Newsletter } from '@/lib/supabase/types';
import { getNewsletterById } from '@/lib/supabase/newsletters/fetch';
import { ensureUtf8Encoding } from '@/lib/utils/content-sanitization';

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
        
        const { data, error } = await getNewsletterById(newsletterId);
        
        if (error) {
          console.error('Error fetching newsletter:', error);
          throw error;
        }
        
        if (data) {
          if (data.content) {
            const rawNordicChars = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
            console.log('NORDIC CHARACTERS IN RAW DB DATA:', rawNordicChars || 'None found');
            
            const potentialDoubleEncoded = data.content.match(/Ã[…†˜¦ø¸]/g);
            if (potentialDoubleEncoded && potentialDoubleEncoded.length > 0) {
              console.log('Potential double-encoded characters found:', potentialDoubleEncoded.join(', '));
            }
            
            console.log('CONTENT DATA TYPE:', typeof data.content);
            console.log('CONTENT SAMPLE (first 100 chars):', data.content.substring(0, 100));
            
            data.content = ensureUtf8Encoding(data.content);
            
            const hexDump = Array.from(data.content.substring(0, 20))
              .map(char => `${char} (0x${char.charCodeAt(0).toString(16)})`)
              .join(', ');
            console.log('HEX DUMP OF FIRST 20 CHARS:', hexDump);
            
            if (data.title) {
              const titleNordicBefore = (data.title.match(/[ØÆÅøæå]/g) || []).join('');
              console.log('NORDIC CHARS IN TITLE BEFORE:', titleNordicBefore || 'None found');
              data.title = ensureUtf8Encoding(data.title);
              const titleNordicAfter = (data.title.match(/[ØÆÅøæå]/g) || []).join('');
              console.log('NORDIC CHARS IN TITLE AFTER:', titleNordicAfter || 'None found');
            }
            
            if (data.preview) {
              const previewNordicBefore = (data.preview.match(/[ØÆÅøæå]/g) || []).join('');
              console.log('NORDIC CHARS IN PREVIEW BEFORE:', previewNordicBefore || 'None found');
              data.preview = ensureUtf8Encoding(data.preview);
              const previewNordicAfter = (data.preview.match(/[ØÆÅøæå]/g) || []).join('');
              console.log('NORDIC CHARS IN PREVIEW AFTER:', previewNordicAfter || 'None found');
            }
            
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
