
import { TableCell } from "@/components/ui/table";
import { Mail } from "lucide-react";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";

interface SenderInfoCellProps {
  sender: NewsletterSenderStats;
}

const SenderInfoCell = ({ sender }: SenderInfoCellProps) => {
  return (
    <TableCell className="py-2 font-medium">
      <div className="flex items-center space-x-2">
        <div>
          <div className="text-sm font-medium">
            {sender.sender_name || sender.sender_email.split('@')[0]}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <Mail className="h-3 w-3 mr-1" />
            {sender.sender_email}
          </div>
        </div>
      </div>
    </TableCell>
  );
};

export default SenderInfoCell;
