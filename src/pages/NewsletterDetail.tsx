
import { useNewsletterDetail } from '@/hooks/useNewsletterDetail';
import NewsletterHeader from '@/components/newsletter-detail/NewsletterHeader';
import NewsletterMeta from '@/components/newsletter-detail/NewsletterMeta';
import NewsletterContent from '@/components/newsletter-detail/NewsletterContent';
import NewsletterLoading from '@/components/newsletter-detail/NewsletterLoading';
import NewsletterNotFound from '@/components/newsletter-detail/NewsletterNotFound';

const NewsletterDetail = () => {
  const { newsletter, loading } = useNewsletterDetail();
  
  return (
    <div className="container py-8 px-4 md:px-6">
      <NewsletterHeader />
      
      {loading ? (
        <NewsletterLoading />
      ) : newsletter ? (
        <div className="space-y-6">
          <NewsletterMeta newsletter={newsletter} />
          <NewsletterContent newsletter={newsletter} />
        </div>
      ) : (
        <NewsletterNotFound />
      )}
    </div>
  );
};

export default NewsletterDetail;
