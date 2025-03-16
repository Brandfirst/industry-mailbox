
import React from "react";
import { Newsletter } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { NewsletterViewHeader } from "./NewsletterViewHeader";
import { NewsletterViewContent } from "./NewsletterViewContent";

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden border-gray-200 shadow-lg">
        <NewsletterViewHeader newsletter={newsletter} />
        <NewsletterViewContent newsletter={newsletter} />
      </DialogContent>
    </Dialog>
  );
}
