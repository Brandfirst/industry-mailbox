
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
    // Set language
    document.documentElement.setAttribute('lang', 'en');
    
    // Ensure charset meta tag exists and is set to UTF-8
    const ensureMetaTag = (name: string, attributes: Record<string, string>) => {
      let meta = document.querySelector(`meta[${name}="${attributes[name]}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => {
          meta!.setAttribute(key, value);
        });
        document.head.appendChild(meta);
      } else if (name === 'charset') {
        meta.setAttribute('charset', 'utf-8');
      }
      return meta;
    };
    
    // Add or update charset meta tag
    ensureMetaTag('charset', { charset: 'utf-8' });
    
    // Add or update Content-Type meta tag
    ensureMetaTag('http-equiv', { 
      'http-equiv': 'Content-Type', 
      'content': 'text/html; charset=utf-8' 
    });
    
    // Add viewport meta tag
    ensureMetaTag('name', {
      'name': 'viewport',
      'content': 'width=device-width, initial-scale=1.0'
    });
    
    console.log('Meta tags set for UTF-8 encoding on detail page');
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
