
import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface NewsletterCountCellProps {
  count: number;
}

const NewsletterCountCell = ({ count }: NewsletterCountCellProps) => {
  return (
    <TableCell className="py-2">
      <Badge variant="outline" className="text-xs font-normal">
        {count || 0}
      </Badge>
    </TableCell>
  );
};

export default NewsletterCountCell;
