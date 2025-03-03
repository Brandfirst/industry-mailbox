
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
        
        // Get the raw content with no transform to see what's in the database
        const { data: rawData, error: rawError } = await supabase
          .from('newsletters')
          .select('content')
          .eq('id', newsletterId)
          .single();
          
        if (rawData?.content) {
          console.log('RAW DB CONTENT (first 200 chars):', rawData.content.substring(0, 200));
          // Log special characters to check encoding
          const specialChars = (rawData.content.match(/[ØÆÅøæå]/g) || []).join('');
          console.log('Special characters in raw content:', specialChars || 'None found');
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
          // Process content for proper UTF-8 encoding
          if (data.content) {
            console.log('Original content (first 200 chars):', data.content.substring(0, 200));
            
            // Log any special Nordic characters to check encoding
            const specialChars = (data.content.match(/[ØÆÅøæå]/g) || []).join('');
            console.log('Special characters in content:', specialChars || 'None found');
            
            // Ensure content is a string
            if (typeof data.content !== 'string') {
              data.content = String(data.content);
            }
            
            // Add explicit UTF-8 header if HTML
            if (!data.content.includes('charset=utf-8') && data.content.includes('<html')) {
              data.content = data.content.replace('<head>', '<head><meta charset="utf-8">');
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
