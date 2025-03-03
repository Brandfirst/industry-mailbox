
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
    // Ensure document's character set is UTF-8
    document.documentElement.setAttribute('lang', 'en');
    
    // Check and set charset meta tag
    let meta = document.querySelector('meta[charset]');
    if (meta) {
      meta.setAttribute('charset', 'utf-8');
    } else {
      meta = document.createElement('meta');
      meta.setAttribute('charset', 'utf-8');
      document.head.insertBefore(meta, document.head.firstChild);
    }
    
    // Also set Content-Type meta
    let contentTypeMeta = document.querySelector('meta[http-equiv="Content-Type"]');
    if (!contentTypeMeta) {
      contentTypeMeta = document.createElement('meta');
      contentTypeMeta.setAttribute('http-equiv', 'Content-Type');
      contentTypeMeta.setAttribute('content', 'text/html; charset=utf-8');
      document.head.appendChild(contentTypeMeta);
    }
    
    // Force browsers to detect UTF-8
    if (newsletter?.content) {
      console.log('Newsletter content available. Setting UTF-8 for display.');
    }
  }, [newsletter]);
  
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
