
export function useDisplayRange(
  page: number,
  itemsPerPage: number,
  totalCount: number,
  isLoading: boolean
) {
  // Calculate displayed range (e.g., "Showing 1-10 of 50")
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalCount);
  const displayRange = isLoading 
    ? "Loading..."
    : totalCount > 0 
      ? `Showing ${startItem}-${endItem} of ${totalCount}`
      : "No newsletters found";

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return {
    displayRange,
    totalPages
  };
}
