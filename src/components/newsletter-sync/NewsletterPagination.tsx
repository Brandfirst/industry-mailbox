
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

type NewsletterPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function NewsletterPagination({ currentPage, totalPages, onPageChange }: NewsletterPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }
  
  // Calculate what page numbers to show
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first, last, current, and one page on each side of current
    let pages = [1];
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    // Add "..." if there's a gap before current group
    if (start > 2) {
      pages.push(-1); // -1 represents ellipsis
    }
    
    // Add current page group
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add "..." if there's a gap after current group
    if (end < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis to distinguish from the first one
    }
    
    // Add last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button 
            variant="outline"
            size="icon"
            disabled={currentPage === 1} 
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className="h-8 w-8"
          >
            <PaginationPrevious className="h-4 w-4" />
          </Button>
        </PaginationItem>
        
        {pageNumbers.map((pageNum, index) => (
          <PaginationItem key={`${pageNum}-${index}`}>
            {pageNum < 0 ? (
              <div className="flex h-8 w-8 items-center justify-center">...</div>
            ) : (
              <Button
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(pageNum)}
                className="h-8 w-8"
              >
                {pageNum}
              </Button>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <Button 
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages} 
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className="h-8 w-8"
          >
            <PaginationNext className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
