
import React from "react";
import { Newsletter } from "@/lib/supabase";
import { format } from "date-fns";
import { Calendar, Mail } from "lucide-react";

interface NewsletterViewHeaderProps {
  newsletter: Newsletter;
}

export function NewsletterViewHeader({
  newsletter
}: NewsletterViewHeaderProps) {
  // Format the date if available
  const formattedDate = newsletter.published_at
    ? format(new Date(newsletter.published_at), "MMM d, yyyy")
    : "Unknown date";

  return (
    <div className="p-4 border-b mb-1">
      <h2 className="text-xl font-semibold mb-1">
        {newsletter.title || "No Subject"}
      </h2>
      <div className="flex flex-col space-y-1 text-sm text-gray-600">
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          <span>From: {newsletter.sender || newsletter.sender_email || "Unknown Sender"}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Date: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
