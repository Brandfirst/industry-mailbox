
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSenderStats, updateSenderCategory } from "@/lib/supabase/newsletters";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { NewsletterCategory } from "@/lib/supabase/types";
import SenderList from "@/components/newsletter-senders/SenderList";
import { LoadingState } from "@/components/newsletter-sync/LoadingState";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSenders = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [senders, setSenders] = useState<NewsletterSenderStats[]>([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);

  // Function to get newsletter categories
  const getNewsletterCategories = async (): Promise<NewsletterCategory[]> => {
    try {
      const { data, error } = await supabase
        .from('newsletter_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching newsletter categories:', error);
      throw error;
    }
  };

  // Load senders and categories data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (user?.id) {
          // Fetch senders stats 
          const sendersData = await getSenderStats(user.id);
          setSenders(sendersData);

          // Fetch categories
          const categoriesData = await getNewsletterCategories();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error loading senders data:", error);
        toast.error("Failed to load senders data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleCategoryChange = async (senderEmail: string, categoryId: number) => {
    try {
      // Update the sender's category in the database
      await updateSenderCategory(senderEmail, categoryId);
      
      // Update local state
      setSenders(prevSenders => 
        prevSenders.map(sender => 
          sender.sender_email === senderEmail 
            ? { ...sender, category_id: categoryId } 
            : sender
        )
      );
      
      toast.success("Sender category updated successfully");
    } catch (error) {
      console.error("Error updating sender category:", error);
      toast.error("Failed to update sender category");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Newsletter Senders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : (
            <SenderList 
              senders={senders} 
              categories={categories} 
              onCategoryChange={handleCategoryChange} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterSenders;
