
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Newsletter } from '@/lib/supabase/types';

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
        
        // Directly fetch the raw content for testing
        console.log('Fetching newsletter with ID:', newsletterId);
        
        const { data, error } = await supabase
          .from('newsletters')
          .select('*, categories(name, color)')
          .eq('id', newsletterId)
          .single();
        
        if (error) {
          console.error('Error fetching newsletter:', error);
          throw error;
        }
        
        if (data) {
          // Debug raw content immediately after fetch
          console.log('FETCHED RAW CONTENT (first 100 chars):', data.content?.substring(0, 100));
          console.log('CONTENT TYPE:', typeof data.content);
          
          // Check for Nordic characters
          if (data.content) {
            const nordicChars = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
            console.log('NORDIC CHARACTERS IN RAW CONTENT:', nordicChars || 'None found');
            
            // Ensure content is a string
            if (typeof data.content !== 'string') {
              data.content = String(data.content);
            }
            
            // Try to fix encoding issues by normalizing to UTF-8
            try {
              // Force UTF-8 encoding by re-encoding the content
              const textEncoder = new TextEncoder();
              const textDecoder = new TextDecoder('utf-8', { fatal: false });
              
              // Encode to UTF-8 bytes and then decode back to string
              const encodedContent = textEncoder.encode(data.content);
              data.content = textDecoder.decode(encodedContent);
              
              console.log('RE-ENCODED CONTENT (first 100 chars):', data.content.substring(0, 100));
              
              // Check for Nordic characters after re-encoding
              const nordicCharsAfter = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
              console.log('NORDIC CHARACTERS AFTER RE-ENCODING:', nordicCharsAfter || 'None found');
            } catch (encError) {
              console.error('Error re-encoding content:', encError);
            }
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
