
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Search } from "lucide-react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";

interface SenderPageControlsProps {
  senders: NewsletterSenderStats[];
}

export default function SenderPageControls({ senders }: SenderPageControlsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "count" | "date">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSort = useCallback((key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }, [sortKey, sortAsc]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search senders..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-row gap-2">
        <Button 
          variant={sortKey === "name" ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleSort("name")}
        >
          Name {sortKey === "name" && <ArrowUpDown className="ml-1 h-4 w-4" />}
        </Button>
        <Button 
          variant={sortKey === "count" ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleSort("count")}
        >
          Count {sortKey === "count" && <ArrowUpDown className="ml-1 h-4 w-4" />}
        </Button>
        <Button 
          variant={sortKey === "date" ? "default" : "outline"} 
          size="sm"
          onClick={() => toggleSort("date")}
        >
          Latest {sortKey === "date" && <ArrowUpDown className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
