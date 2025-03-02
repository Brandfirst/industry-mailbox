
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
          throw error;
        }
        
        setNewsletter(data);
        document.title = `${data?.title || 'Newsletter'} | NewsletterHub`;
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
