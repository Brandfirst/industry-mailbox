
import { useNewsletterDetail } from '@/hooks/useNewsletterDetail';
import NewsletterHeader from '@/components/newsletter-detail/NewsletterHeader';
import NewsletterMeta from '@/components/newsletter-detail/NewsletterMeta';
import NewsletterContent from '@/components/newsletter-detail/NewsletterContent';
import NewsletterLoading from '@/components/newsletter-detail/NewsletterLoading';
import NewsletterNotFound from '@/components/newsletter-detail/NewsletterNotFound';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const NewsletterDetail = () => {
  // Get parameters from URL
  const params = useParams();
  const { newsletter, loading } = useNewsletterDetail();
  
  // Debug URL parameters 
  useEffect(() => {
    console.log("URL Params:", params);
    // If we're using the new URL format, the newsletter ID will be in the title param at the end
    if (params.title) {
      console.log("SEO friendly URL detected");
      // Extract the ID from the title slug (format: title-ID)
      const idMatch = params.title.match(/-(\d+)$/);
      if (idMatch && idMatch[1]) {
        console.log("Extracted newsletter ID from slug:", idMatch[1]);
      }
    }
  }, [params]);
  
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
