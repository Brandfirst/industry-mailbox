
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newsletter } from '@/lib/supabase/types';
import NewsletterItem from './NewsletterItem';

interface NewsletterResultsProps {
  newsletters: Newsletter[];
  loading: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  handleNewsletterClick: (newsletter: Newsletter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
}

const NewsletterResults = ({
  newsletters,
  loading,
  hasMore,
  handleLoadMore,
  handleNewsletterClick,
  searchQuery,
  setSearchQuery,
  setSelectedCategory
}: NewsletterResultsProps) => {
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Card key={i} className="animate-pulse h-24 md:h-[500px]">
            <div className="h-full bg-muted/20"></div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (newsletters.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium mb-2">Ingen nyhetsbrev funnet</h3>
        <p className="text-muted-foreground mb-6">Prøv å endre søk eller filtre for å se flere nyhetsbrev</p>
        <Button variant="outline" onClick={() => {
          setSearchQuery('');
          setSelectedCategory('all');
        }}>
          Tilbakestill søk
        </Button>
      </div>
    );
  }
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {newsletters.map((newsletter) => (
          <NewsletterItem 
            key={newsletter.id}
            newsletter={newsletter}
            onClick={handleNewsletterClick}
          />
        ))}
      </div>
      
      {hasMore && (
        <div className="flex justify-center mt-8 md:mt-12">
          <Button 
            onClick={handleLoadMore} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Laster...' : 'Last inn flere'}
          </Button>
        </div>
      )}
    </>
  );
};

export default NewsletterResults;
