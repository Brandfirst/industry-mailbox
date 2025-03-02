
import { Newsletter } from '@/lib/supabase/types';
import NewsletterItem from '@/components/search/NewsletterItem';

interface NewsletterCardProps {
  newsletter: Newsletter;
  onClick: (newsletter: Newsletter) => void;
}

const NewsletterCard = ({ newsletter, onClick }: NewsletterCardProps) => {
  return (
    <NewsletterItem
      newsletter={newsletter}
      onClick={onClick}
    />
  );
};

export default NewsletterCard;
