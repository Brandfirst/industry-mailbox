
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { RefreshCw, Filter, Check, Tag, Calendar, Mail, Eye, AlertCircle } from "lucide-react";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        setErrorMessage(null);
        const accounts = await getUserEmailAccounts(user.id);
        setEmailAccounts(accounts);
        
        if (accounts.length > 0) {
          setSelectedAccount(accounts[0].id);
        }
        
        const allCategories = await getAllCategories();
        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setErrorMessage("Failed to load email accounts or categories.");
        toast.error("Failed to load data");
      }
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    const loadNewsletters = async () => {
      if (!selectedAccount) return;
      
      setIsLoading(true);
      setErrorMessage(null);
      
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
        setErrorMessage("Failed to load newsletters. There may be a database issue or the account is not properly connected.");
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
    setErrorMessage(null);
    toast.info("Starting email sync...");
    
    try {
      console.log("Syncing account:", selectedAccount);
      const result = await syncEmailAccount(selectedAccount);
      console.log("Sync result:", result);
      
      if (result.success) {
        toast.success(`Successfully synced ${result.count || 0} newsletters`);
        // Refresh the newsletter list
        const { data, count } = await getNewslettersFromEmailAccount(
          selectedAccount, 
          page, 
          ITEMS_PER_PAGE
        );
        setNewsletters(data);
        setTotalCount(count || 0);
      } else {
        console.error("Sync error details:", result);
        let errorMsg = result.error || "Unknown error occurred during sync";
        
        // More descriptive error messages for common failures
        if (errorMsg.includes("Edge Function") || result.statusCode === 500) {
          errorMsg = "Server error during sync. The edge function may have encountered an issue. Please check the logs or try again later.";
        } else if (result.statusCode === 401 || result.statusCode === 403) {
          errorMsg = "Authentication error. Your email account connection may need to be refreshed.";
        } else if (result.details) {
          // If we have more specific details, include them
          errorMsg += `: ${result.details}`;
        }
        
        setErrorMessage(`Failed to sync emails: ${errorMsg}`);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error syncing emails:", error);
      setErrorMessage("An unexpected error occurred while syncing emails. Please check the console for more details and try again.");
      toast.error("An error occurred while syncing emails");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCategoryChange = async (newsletterId: number, categoryId: string) => {
    try {
      // Convert categoryId to number or null if empty string
      const numericCategoryId = categoryId ? parseInt(categoryId) : null;
      
      await updateNewsletterCategory(newsletterId, numericCategoryId);
      toast.success("Category updated successfully");
      
      // Update the local state to reflect the change
      setNewsletters(prev => 
        prev.map(newsletter => 
          newsletter.id === newsletterId 
            ? { ...newsletter, category_id: numericCategoryId } 
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
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{errorMessage}</span>
          </div>
        )}
        
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
                        <TableHead>Actions</TableHead>
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
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setSelectedNewsletter(newsletter)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle>{newsletter.title || "Untitled Newsletter"}</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 overflow-auto h-full pb-6">
                                  {newsletter.content ? (
                                    <div 
                                      className="prose max-w-none"
                                      dangerouslySetInnerHTML={{ __html: newsletter.content }} 
                                    />
                                  ) : (
                                    <div className="text-center py-12">
                                      <p>No content available for this newsletter.</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            disabled={page === 1} 
                            onClick={() => setPage(p => Math.max(p - 1, 1))} 
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={page === i + 1}
                              onClick={() => setPage(i + 1)}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            disabled={page === totalPages} 
                            onClick={() => setPage(p => Math.min(p + 1, totalPages))} 
                          />
                        </PaginationItem>
                      </PaginationContent>
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
