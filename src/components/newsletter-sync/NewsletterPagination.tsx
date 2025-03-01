
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type NewsletterPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function NewsletterPagination({ currentPage, totalPages, onPageChange }: NewsletterPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              disabled={currentPage === 1} 
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))} 
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => onPageChange(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              disabled={currentPage === totalPages} 
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} 
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
