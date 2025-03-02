
import { Card } from "@/components/ui/card";
import NewsletterCard from "./NewsletterCard";

interface NewsletterGridProps {
  newsletters: any[];
  loading: boolean;
  onNewsletterClick: (newsletter: any) => void;
}

const NewsletterGrid = ({ newsletters, loading, onNewsletterClick }: NewsletterGridProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse h-24 md:h-[400px]">
            <div className="h-full bg-muted/20"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (newsletters.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2 text-white">Ingen nyhetsbrev funnet</h3>
        <p className="text-muted-foreground mb-6">Prøv å endre kategori for å se flere nyhetsbrev</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
      {newsletters.map((newsletter) => (
        <NewsletterCard 
          key={newsletter.id} 
          newsletter={newsletter} 
          onClick={onNewsletterClick} 
        />
      ))}
    </div>
  );
};

export default NewsletterGrid;
