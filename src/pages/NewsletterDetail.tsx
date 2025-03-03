
import { useNewsletterDetail } from '@/hooks/useNewsletterDetail';
import NewsletterHeader from '@/components/newsletter-detail/NewsletterHeader';
import NewsletterMeta from '@/components/newsletter-detail/NewsletterMeta';
import NewsletterContent from '@/components/newsletter-detail/NewsletterContent';
import NewsletterLoading from '@/components/newsletter-detail/NewsletterLoading';
import NewsletterNotFound from '@/components/newsletter-detail/NewsletterNotFound';
import { useEffect } from 'react';

const NewsletterDetail = () => {
  const { newsletter, loading } = useNewsletterDetail();
  
  // Force UTF-8 character set for the whole page
  useEffect(() => {
    // Make sure the document's character set is UTF-8
    const meta = document.querySelector('meta[charset]');
    if (meta) {
      meta.setAttribute('charset', 'utf-8');
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('charset', 'utf-8');
      document.head.appendChild(newMeta);
    }
    
    // Also add content-type meta tag if missing
    const contentTypeMeta = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!contentTypeMeta) {
      const newContentTypeMeta = document.createElement('meta');
      newContentTypeMeta.setAttribute('http-equiv', 'Content-Type');
      newContentTypeMeta.setAttribute('content', 'text/html; charset=utf-8');
      document.head.appendChild(newContentTypeMeta);
    }
    
    // Force the page to use UTF-8
    document.documentElement.lang = 'en';
    document.documentElement.setAttribute('encoding', 'UTF-8');
  }, []);
  
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
