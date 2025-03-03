
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
          // Ensure content is properly handled as UTF-8
          if (data.content) {
            // Log the raw content to debug encoding issues
            console.log('Raw content from DB (first 100 chars):', data.content.substring(0, 100));
            
            if (typeof data.content !== 'string') {
              console.warn('Newsletter content is not a string, converting:', data.content);
              data.content = String(data.content);
            }
            
            // Force explicit UTF-8 encoding for the content
            try {
              // This technique ensures proper UTF-8 handling
              const encoder = new TextEncoder();
              const decoder = new TextDecoder('utf-8', { fatal: true });
              const encoded = encoder.encode(data.content);
              data.content = decoder.decode(encoded);
              
              // Log the processed content to verify encoding
              console.log('Processed content (first 100 chars):', data.content.substring(0, 100));
            } catch (e) {
              console.error('Error with UTF-8 encoding/decoding:', e);
            }
          }
          
          setNewsletter(data);
          document.title = `${data?.title || 'Newsletter'} | NewsletterHub`;
        }
      } catch (error) {
        console.error('Error fetching newsletter:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletter();
  }, [id, sender, titleId]);

  return { newsletter, loading };
};
