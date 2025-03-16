
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { SyncHeader } from "./newsletter-sync/SyncHeader";
import { NewsletterContent } from "./newsletter-sync/NewsletterContent";
import { useNewsletterSync } from "./newsletter-sync/useNewsletterSync";
import { Alert, AlertDescription } from "./ui/alert";
import { InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { getNewslettersFromEmailAccount } from "@/lib/supabase";
import { sanitizeNewsletterContent } from "@/lib/utils/content-sanitization";

export default function NewsletterSync() {
  const { user } = useAuth();
  const {
    emailAccounts,
    selectedAccount,
    setSelectedAccount,
    newsletters,
    setNewsletters,
    categories,
    isSyncing,
    isLoading,
    errorMessage,
    warningMessage,
    page,
    setPage,
    totalPages,
    displayRange,
    filters,
    selectedIds,
    isDeleting,
    handleSync,
    handleDeleteNewsletters,
    handleFiltersChange,
    handleSelectNewsletter,
    handleSelectAll,
    setTotalCount
  } = useNewsletterSync(user?.id);

  // New function to update emails content without fetching new ones
  const handleUpdateEmails = async () => {
    if (!selectedAccount) {
      toast.error("Please select an account first");
      return;
    }

    toast.info("Updating email content...");
    
    try {
      // Refresh the data from the database
      const { data, total } = await getNewslettersFromEmailAccount(
        selectedAccount,
        page,
        {
          category: filters.categoryId !== "all" ? filters.categoryId : undefined,
          fromDate: filters.fromDate ? filters.fromDate.toISOString() : undefined,
          toDate: filters.toDate ? filters.toDate.toISOString() : undefined,
          searchQuery: filters.searchQuery,
          sender: filters.sender
        }
      );
      
      if (data) {
        // Process the content for each newsletter to ensure proper display
        const processedNewsletters = data.map(newsletter => {
          if (newsletter.content) {
            // Apply sanitization to the content
            newsletter.content = sanitizeNewsletterContent(newsletter.content);
          }
          return newsletter;
        });
        
        setNewsletters(processedNewsletters);
        setTotalCount(total || 0);
        toast.success("Emails updated successfully");
      } else {
        toast.warning("No emails found to update");
      }
    } catch (error) {
      console.error("Error updating emails:", error);
      toast.error("Failed to update emails");
    }
  };

  return (
    <Card className="shadow-md bg-white">
      <CardHeader className="bg-white">
        <SyncHeader 
          isSyncing={isSyncing}
          selectedAccount={selectedAccount}
          emailAccounts={emailAccounts}
          onSync={handleSync}
          onUpdateEmails={handleUpdateEmails}
        />
        <CardDescription>
          Import emails from your connected email accounts
        </CardDescription>
        <Alert variant="default" className="mt-4 bg-blue-50/10 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-sm text-blue-700">
            Categories can be managed in the Newsletter Senders section
          </AlertDescription>
        </Alert>
      </CardHeader>
      <CardContent className="bg-white">
        <div className="mb-4 text-sm text-muted-foreground font-medium">
          {displayRange}
        </div>
        <NewsletterContent 
          errorMessage={errorMessage}
          warningMessage={warningMessage}
          emailAccounts={emailAccounts}
          selectedAccount={selectedAccount}
          onSelectAccount={setSelectedAccount}
          isLoading={isLoading}
          isSyncing={isSyncing}
          newsletters={newsletters}
          categories={categories}
          selectedIds={selectedIds}
          isDeleting={isDeleting}
          onDeleteNewsletters={handleDeleteNewsletters}
          onSelectNewsletter={handleSelectNewsletter}
          onSelectAll={handleSelectAll}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </CardContent>
    </Card>
  );
}
