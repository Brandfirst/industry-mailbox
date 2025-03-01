
import { Newsletter, NewsletterCategory, updateNewsletterCategory } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useState } from "react";

type NewsletterListProps = {
  newsletters: Newsletter[];
  categories: NewsletterCategory[];
  onCategoryChange: (newsletters: Newsletter[]) => void;
};

export function NewsletterList({ newsletters, categories, onCategoryChange }: NewsletterListProps) {
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);

  const handleCategoryChange = async (newsletterId: number, categoryId: string) => {
    try {
      // Convert categoryId to number or null if empty string
      const numericCategoryId = categoryId ? parseInt(categoryId) : null;
      
      await updateNewsletterCategory(newsletterId, numericCategoryId);
      toast.success("Category updated successfully");
      
      // Update the local state to reflect the change
      const updatedNewsletters = newsletters.map(newsletter => 
        newsletter.id === newsletterId 
          ? { ...newsletter, category_id: numericCategoryId } 
          : newsletter
      );
      
      onCategoryChange(updatedNewsletters);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  return (
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
  );
}
