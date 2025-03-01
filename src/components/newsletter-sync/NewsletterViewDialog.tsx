
import { Newsletter } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

type NewsletterViewDialogProps = {
  newsletter: Newsletter;
};

export function NewsletterViewDialog({ newsletter }: NewsletterViewDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{newsletter.title || "Untitled Newsletter"}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-auto h-full pb-6">
          {newsletter.content ? (
            <iframe
              srcDoc={newsletter.content}
              title={newsletter.title || "Newsletter Content"}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="text-center py-12">
              <p>No content available for this newsletter.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
