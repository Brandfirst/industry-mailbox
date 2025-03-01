import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SearchPage = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNewsletters = async () => {
      const response = await supabase
        .from('newsletters')
        .select('*')
        .ilike('title', `%${searchQuery}%`);

      if (response.error) {
        console.error('Error fetching newsletters:', response.error);
        return;
      }

      const data = response.data;
      setNewsletters(data);
    };

    fetchNewsletters();
  }, [searchQuery]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search newsletters..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ul>
        {newsletters.map((newsletter) => (
          <li key={newsletter.id}>{newsletter.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
