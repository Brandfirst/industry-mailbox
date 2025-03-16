
import { useNewsletterSenders } from './hooks/useNewsletterSenders';
import SenderList from '@/components/newsletter-senders/list';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const NewsletterSendersPage = () => {
  const {
    filteredSenders,
    categories,
    loading,
    sortKey,
    sortAsc,
    refreshing,
    updatingCategory,
    updatingBrand,
    deleting,
    loadingAnalytics,
    handleRefresh,
    handleCategoryChange,
    handleBrandChange,
    handleDeleteSenders,
    toggleSort
  } = useNewsletterSenders();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Nyhetsbrev-avsendere</h1>
          <p className="text-gray-600">
            Administrer alle nyhetsbrev-avsendere og deres kategorier
          </p>
        </div>
        
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Oppdaterer...' : 'Oppdater'}
        </Button>
      </div>

      <SenderList
        senders={filteredSenders}
        categories={categories}
        loading={loading}
        sortKey={sortKey}
        sortAsc={sortAsc}
        toggleSort={toggleSort}
        onCategoryChange={handleCategoryChange}
        onBrandChange={handleBrandChange}
        onDeleteSenders={handleDeleteSenders}
        updatingCategory={updatingCategory}
        updatingBrand={updatingBrand}
        deleting={deleting}
        loadingAnalytics={loadingAnalytics}
      />
    </div>
  );
};

export default NewsletterSendersPage;
