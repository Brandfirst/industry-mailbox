
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pagination } from "@/components/ui/pagination";
import { RefreshCw, Filter, Check, Tag, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { 
  EmailAccount, 
  NewsletterCategory, 
  Newsletter,
  getUserEmailAccounts, 
  getNewslettersFromEmailAccount,
  syncEmailAccount,
  getAllCategories,
  updateNewsletterCategory
} from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function NewsletterSync() {
  const { user } = useAuth();
  const [emailAccounts, setEmailAccounts] = useState<EmailAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const accounts = await getUserEmailAccounts(user.id);
        setEmailAccounts(accounts);
        
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0].id);
        }
        
        const allCategories = await getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load email accounts");
      }
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    const loadNewsletters = async () => {
      if (!selectedAccount) return;
      
      setIsLoading(true);
      try {
        const { data, count } = await getNewslettersFromEmailAccount(
          selectedAccount, 
          page, 
          ITEMS_PER_PAGE
        );
        setNewsletters(data);
        setTotalCount(count || 0);
      } catch (error) {
        console.error("Error loading newsletters:", error);
        toast.error("Failed to load newsletters");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNewsletters();
  }, [selectedAccount, page]);

  const handleSync = async () => {
    if (!selectedAccount) return;
    
    setIsSyncing(true);
    toast.info("Starting email sync...");
    
    try {
      const result = await syncEmailAccount(selectedAccount);
      
      if (result.success) {
        toast.success(`Successfully synced ${result.count || 0} newsletters`);
        // Refresh the newsletter list
        const { data } = await getNewslettersFromEmailAccount(
          selectedAccount, 
          page, 
          ITEMS_PER_PAGE
        );
        setNewsletters(data);
      } else {
        toast.error(result.error || "Failed to sync emails");
      }
    } catch (error) {
      console.error("Error syncing emails:", error);
      toast.error("An error occurred while syncing emails");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCategoryChange = async (newsletterId: number, categoryId: string) => {
    try {
      await updateNewsletterCategory(newsletterId, parseInt(categoryId));
      toast.success("Category updated successfully");
      
      // Update the local state to reflect the change
      setNewsletters(prev => 
        prev.map(newsletter => 
          newsletter.id === newsletterId 
            ? { ...newsletter, category_id: parseInt(categoryId) } 
            : newsletter
        )
      );
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  
  const getLastSyncTime = () => {
    if (!selectedAccount) return "Never";
    
    const account = emailAccounts.find(acc => acc.id === selectedAccount);
    if (!account || !account.last_sync) return "Never";
    
    return formatDistanceToNow(new Date(account.last_sync), { addSuffix: true });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Newsletter Sync</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSync}
                  disabled={isSyncing || !selectedAccount}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Now
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Last synced: {getLastSyncTime()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Import and categorize newsletters from your connected email accounts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailAccounts.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold">No email accounts connected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Connect an email account to start importing newsletters
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <Select
                value={selectedAccount || ""}
                onValueChange={setSelectedAccount}
                disabled={isLoading || isSyncing}
              >
                <SelectTrigger className="w-full sm:w-72">
                  <SelectValue placeholder="Select email account" />
                </SelectTrigger>
                <SelectContent>
                  {emailAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.email} ({account.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="text-sm text-muted-foreground">
                <Calendar className="inline-block mr-1 h-4 w-4" />
                Last synced: {getLastSyncTime()}
              </div>
            </div>
            
            {isLoading ? (
              <div className="py-32 flex justify-center items-center">
                <RefreshCw className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : newsletters.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">No newsletters found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try syncing your account or select a different email account
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newsletters.map((newsletter) => (
                        <TableRow key={newsletter.id}>
                          <TableCell className="font-medium">
                            {newsletter.title || "Untitled"}
                          </TableCell>
                          <TableCell>
                            {newsletter.sender || newsletter.sender_email || "Unknown"}
                          </TableCell>
                          <TableCell>
                            {newsletter.published_at
                              ? formatDistanceToNow(new Date(newsletter.published_at), { addSuffix: true })
                              : "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={newsletter.category_id?.toString() || ""}
                              onValueChange={(value) => handleCategoryChange(newsletter.id, value)}
                            >
                              <SelectTrigger className="w-full max-w-[180px]">
                                <SelectValue placeholder="Categorize" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Uncategorized</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <Pagination>
                      <Button 
                        variant="outline" 
                        disabled={page === 1} 
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                      >
                        Previous
                      </Button>
                      <div className="mx-4 flex items-center">
                        Page {page} of {totalPages}
                      </div>
                      <Button 
                        variant="outline" 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                      >
                        Next
                      </Button>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
