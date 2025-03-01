
import { Newsletter, NewsletterCategory, EmailAccount } from "@/lib/supabase";
import { EmptyState } from "./EmptyState";
import { AlertMessages } from "./AlertMessages";
import { AccountSelector } from "./AccountSelector";
import { NewsletterList } from "./NewsletterList";
import { NewsletterPagination } from "./NewsletterPagination";
import { LoadingState } from "./LoadingState";
import { FilterToolbar, FiltersState } from "./FilterToolbar";

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
  onCategoryChange: (updatedNewsletters: Newsletter[]) => void;
  onDeleteNewsletters: (ids: number[]) => Promise<void>;
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
  onCategoryChange,
  onDeleteNewsletters,
  currentPage,
  totalPages,
  onPageChange,
  filters,
  onFiltersChange
}: NewsletterContentProps) {
  return (
    <>
      <AlertMessages 
        errorMessage={errorMessage} 
        warningMessage={warningMessage} 
      />
      
      {emailAccounts.length === 0 ? (
        <EmptyState type="noAccounts" />
      ) : (
        <>
          <AccountSelector 
            accounts={emailAccounts}
            selectedAccount={selectedAccount}
            onSelectAccount={onSelectAccount}
            isDisabled={isLoading || isSyncing}
          />
          
          <FilterToolbar 
            categories={categories}
            onFiltersChange={onFiltersChange}
          />
          
          {isLoading ? (
            <LoadingState />
          ) : newsletters.length === 0 ? (
            <EmptyState type="noNewsletters" />
          ) : (
            <>
              <NewsletterList 
                newsletters={newsletters}
                categories={categories}
                onCategoryChange={onCategoryChange}
                onDeleteNewsletters={onDeleteNewsletters}
              />
              
              <NewsletterPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
