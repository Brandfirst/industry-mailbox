
import { Input } from "@/components/ui/input";

interface SenderListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
}

const SenderListHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  resultsCount 
}: SenderListHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
      <div className="relative w-full sm:w-64">
        <Input
          type="text"
          placeholder="Search senders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="text-sm text-muted-foreground">
        {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
      </div>
    </div>
  );
};

export default SenderListHeader;
