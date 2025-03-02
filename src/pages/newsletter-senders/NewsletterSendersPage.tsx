
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SenderList from "@/components/newsletter-senders/SenderList";
import SenderAnalytics from "@/components/newsletter-senders/components/SenderAnalytics";
import SenderPageHeader from "./components/SenderPageHeader";
import SenderPageControls from "./components/SenderPageControls";
import { useNewsletterSenders } from "./hooks/useNewsletterSenders";

export default function NewsletterSendersPage() {
  const {
    senders,
    categories,
    loading,
    loadingAnalytics,
    handleRefresh,
    refreshing,
    handleCategoryChange,
    handleBrandChange,
    frequencyData,
    filteredSenders
  } = useNewsletterSenders();

  useEffect(() => {
    document.title = "Newsletter Senders | NewsletterHub";
  }, []);

  return (
    <Card className="border shadow-md max-w-full">
      <CardHeader className="pb-3">
        <SenderPageHeader onRefresh={handleRefresh} refreshing={refreshing || loading} />
      </CardHeader>
      
      <CardContent>
        <SenderPageControls 
          senders={filteredSenders} 
        />
        
        <Separator className="my-4" />
        
        <SenderList 
          senders={filteredSenders}
          categories={categories}
          loading={loading}
          onCategoryChange={handleCategoryChange}
          onBrandChange={handleBrandChange}
        />
        
        <SenderAnalytics 
          senders={senders}
          loading={loadingAnalytics}
          frequencyData={frequencyData}
        />
      </CardContent>
    </Card>
  );
}
