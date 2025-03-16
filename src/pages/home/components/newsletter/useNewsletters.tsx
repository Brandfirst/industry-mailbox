
import { useState, useEffect } from 'react';
import { Newsletter, NewsletterCategory } from '@/lib/supabase/types';
import { getAllNewsletters } from '@/lib/supabase/newsletters/fetchAll';
import { getAllCategories } from '@/lib/supabase/categories';

export function useNewsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch newsletters based on selected category
  useEffect(() => {
    const fetchNewsletters = async () => {
      setLoading(true);
      try {
        const categoryIdParam = selectedCategory !== 'all' ? selectedCategory : undefined;
        
        const result = await getAllNewsletters({
          categoryId: categoryIdParam,
          limit: 4
        });
        
        setNewsletters(result.data);
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
}
