
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getFeaturedNewsletters } from '@/lib/supabase/newsletters';
import { NewsletterCategory } from '@/lib/supabase/types';

export const useNewsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
        .limit(4);
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories(data || []);
    };
    
    fetchCategories();
  }, []);
  
  // Fetch newsletters based on selected category
  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      
      try {
        const result = await getFeaturedNewsletters({
          categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
          limit: 4
        });
        
        setNewsletters(result.data || []);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletters();
  }, [selectedCategory]);

  return {
    newsletters,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory
  };
};
