
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth";
import { SyncHeader } from "./newsletter-sync/SyncHeader";
import { NewsletterContent } from "./newsletter-sync/NewsletterContent";
import { useNewsletterSync } from "./newsletter-sync/useNewsletterSync";
import { Alert, AlertDescription } from "./ui/alert";
import { InfoIcon } from "lucide-react";

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
    displayRange,
    filters,
    handleSync,
    handleDeleteNewsletters,
    handleFiltersChange
  } = useNewsletterSync(user?.id);

  return (
    <Card className="shadow-md bg-white">
      <CardHeader className="bg-white">
        <SyncHeader 
          isSyncing={isSyncing}
          selectedAccount={selectedAccount}
          emailAccounts={emailAccounts}
          onSync={handleSync}
        />
        <CardDescription>
          Import newsletters from your connected email accounts
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
