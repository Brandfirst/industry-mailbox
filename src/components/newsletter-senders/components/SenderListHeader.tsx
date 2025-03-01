
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

type SenderListHeaderProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  resultsCount: number;
};

const SenderListHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  resultsCount 
}: SenderListHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative w-full md:w-72">
        <Input
          placeholder="Search senders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
      <div className="hidden md:block text-sm text-muted-foreground">
        {resultsCount} sender{resultsCount !== 1 ? 's' : ''} found
      </div>
    </div>
  );
};

export default SenderListHeader;
