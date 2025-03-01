
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Mail, Calendar, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters";
import { NewsletterCategory } from "@/lib/supabase/types";

type SenderListProps = {
  senders: NewsletterSenderStats[];
  categories: NewsletterCategory[];
  loading?: boolean;
  onCategoryChange?: (senderEmail: string, categoryId: number | null) => Promise<void>;
};

type SortField = 'name' | 'count' | 'last_sync';
type SortDirection = 'asc' | 'desc';

const SenderList = ({ senders, categories, loading = false, onCategoryChange }: SenderListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [updatingCategory, setUpdatingCategory] = useState<string | null>(null);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort senders
  const filteredSenders = senders
    .filter(sender => 
      sender.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sender.sender_email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        const nameA = a.sender_name?.toLowerCase() || a.sender_email?.toLowerCase() || "";
        const nameB = b.sender_name?.toLowerCase() || b.sender_email?.toLowerCase() || "";
        comparison = nameA.localeCompare(nameB);
      } else if (sortField === 'count') {
        comparison = (a.newsletter_count || 0) - (b.newsletter_count || 0);
      } else if (sortField === 'last_sync') {
        // Sort by last_sync_date, handling null values
        if (!a.last_sync_date) return 1;
        if (!b.last_sync_date) return -1;
        comparison = new Date(a.last_sync_date).getTime() - new Date(b.last_sync_date).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Get category name by ID
  const getCategoryNameById = (categoryId: number | null) => {
    if (!categoryId) return "Uncategorized";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  // Get category color by ID
  const getCategoryColorById = (categoryId: number | null) => {
    if (!categoryId) return "#666666";
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : "#666666";
  };

  // Format the last sync date
  const formatLastSync = (date: string | null) => {
    if (!date) return "Never";
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Handle category change
  const handleCategoryChange = async (senderEmail: string, categoryId: string) => {
    if (!onCategoryChange) return;
    
    setUpdatingCategory(senderEmail);
    try {
      // Convert empty string to null, otherwise parse as number
      const parsedCategoryId = categoryId === "null" ? null : parseInt(categoryId);
      await onCategoryChange(senderEmail, parsedCategoryId);
      toast.success(`Category updated for all newsletters from ${senderEmail}`);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    } finally {
      setUpdatingCategory(null);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
          {filteredSenders.length} sender{filteredSenders.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[300px] cursor-pointer" 
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Sender <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('count')}
              >
                <div className="flex items-center">
                  Newsletters <SortIcon field="count" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('last_sync')}
              >
                <div className="flex items-center">
                  Last Synchronized <SortIcon field="last_sync" />
                </div>
              </TableHead>
              <TableHead>Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSenders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No senders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredSenders.map((sender) => (
                <TableRow key={sender.sender_email}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{sender.sender_name}</div>
                      <div className="text-sm text-muted-foreground">{sender.sender_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{sender.newsletter_count}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {formatLastSync(sender.last_sync_date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Tag 
                        className="h-4 w-4 mr-2" 
                        style={{ color: getCategoryColorById(sender.category_id) }} 
                      />
                      {onCategoryChange ? (
                        <Select
                          value={sender.category_id?.toString() || "null"}
                          onValueChange={(value) => handleCategoryChange(sender.sender_email, value)}
                          disabled={updatingCategory === sender.sender_email}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="null">Uncategorized</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span>{getCategoryNameById(sender.category_id)}</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SenderList;
