
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import Navbar from "@/components/Navbar";

const NewsletterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNewsletter = async () => {
      setLoading(true);
      
      try {
        // Convert string ID to number for the query
        const numericId = parseInt(id || '0', 10);
        
        if (isNaN(numericId)) {
          throw new Error('Invalid newsletter ID');
        }
        
        const { data, error } = await supabase
          .from('newsletters')
          .select('*, categories(name, color)')
          .eq('id', numericId)
          .single();
        
        if (error) {
          throw error;
        }
        
        setNewsletter(data);
        document.title = `${data?.title || 'Newsletter'} | NewsletterHub`;
      } catch (error) {
        console.error('Error fetching newsletter:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsletter();
  }, [id]);
  
  const getFormattedDate = (dateString: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  return (
    <>
      <Navbar />
      <div className="container py-8 px-4 md:px-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tilbake
        </Button>
        
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-[600px] bg-gray-200 rounded mt-6"></div>
          </div>
        ) : newsletter ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
                  {newsletter.sender && (
                    <span className="text-lg font-semibold text-gray-700">
                      {newsletter.sender.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{newsletter.title}</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{newsletter.sender}</span>
                    <span className="mx-2">•</span>
                    <span>{getFormattedDate(newsletter.published_at)}</span>
                    
                    {newsletter.categories && (
                      <>
                        <span className="mx-2">•</span>
                        <span 
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{ 
                            backgroundColor: newsletter.categories.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                            color: newsletter.categories.color || '#8B5CF6' 
                          }}
                        >
                          {newsletter.categories.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden bg-white p-6">
              {newsletter.content ? (
                <div 
                  className="newsletter-content prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: newsletter.content }}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No content available</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">Nyhetsbrev ikke funnet</h3>
            <p className="text-muted-foreground mb-6">Vi kunne ikke finne nyhetsbrevet du leter etter</p>
            <Button onClick={() => navigate('/')}>
              Gå til forsiden
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsletterDetail;
