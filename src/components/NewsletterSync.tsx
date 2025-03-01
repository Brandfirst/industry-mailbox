
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { SyncHeader } from "./newsletter-sync/SyncHeader";
import { NewsletterContent } from "./newsletter-sync/NewsletterContent";
import { useNewsletterSync } from "./newsletter-sync/useNewsletterSync";

export default function NewsletterSync() {
  const { user } = useAuth();
  const {
    emailAccounts,
    selectedAccount,
    setSelectedAccount,
    newsletters,
    categories,
    isSyncing,
    isLoading,
    errorMessage,
    warningMessage,
    page,
    setPage,
    totalPages,
    filters,
    handleSync,
    handleCategoryChange,
    handleDeleteNewsletters,
    handleFiltersChange
  } = useNewsletterSync(user?.id);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <SyncHeader 
          isSyncing={isSyncing}
          selectedAccount={selectedAccount}
          emailAccounts={emailAccounts}
          onSync={handleSync}
        />
        <CardDescription>
          Import and categorize newsletters from your connected email accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
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
          onCategoryChange={handleCategoryChange}
          onDeleteNewsletters={handleDeleteNewsletters}
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
