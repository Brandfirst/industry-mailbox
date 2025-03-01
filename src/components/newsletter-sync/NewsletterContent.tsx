
import { Newsletter, NewsletterCategory, EmailAccount } from "@/lib/supabase";
import { AlertMessages } from "./AlertMessages";
import { AccountSelector } from "./AccountSelector";
import { LoadingState } from "./LoadingState";
import { EmptyState } from "./EmptyState";
import { FilterToolbar, FiltersState } from "./FilterToolbar";
import { NewsletterList } from "./newsletter-list/NewsletterList";
import { NewsletterPagination } from "./NewsletterPagination";

type NewsletterContentProps = {
  errorMessage: string | null;
  warningMessage: string | null;
  emailAccounts: EmailAccount[];
  selectedAccount: string | null;
  onSelectAccount: (accountId: string) => void;
  isLoading: boolean;
  isSyncing: boolean;
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  onDeleteNewsletters?: (ids: number[]) => Promise<void>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
};

export function NewsletterContent({
  errorMessage,
  warningMessage,
  emailAccounts,
  selectedAccount,
  onSelectAccount,
  isLoading,
  isSyncing,
  newsletters,
  categories,
  onDeleteNewsletters,
  currentPage,
  totalPages,
  onPageChange,
  filters,
  onFiltersChange
}: NewsletterContentProps) {
  
  return (
    <div className="space-y-6">
      <AlertMessages 
        errorMessage={errorMessage} 
        warningMessage={warningMessage}
      />
      
      <AccountSelector 
        accounts={emailAccounts}
        selectedAccount={selectedAccount}
        onSelectAccount={onSelectAccount}
        isDisabled={isLoading || isSyncing}
      />
      
      {isLoading ? (
        <LoadingState />
      ) : newsletters.length === 0 ? (
        <EmptyState 
          selectedAccount={selectedAccount} 
          isSyncing={isSyncing} 
        />
      ) : (
        <>
          <FilterToolbar 
            filters={filters}
            onFiltersChange={onFiltersChange}
            categories={categories}
          />
          
          <NewsletterList 
            newsletters={newsletters}
            categories={categories}
            onDeleteNewsletters={onDeleteNewsletters}
          />
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <NewsletterPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
