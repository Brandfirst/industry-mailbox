
import { Mail, Database } from "lucide-react";
import StatsCard from "./StatsCard";
import { AdminStatsType } from "./types";

interface ContentTabProps {
  stats: AdminStatsType | null;
  isLoading: boolean;
}

const ContentTab = ({ stats, isLoading }: ContentTabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="New Newsletters"
        value={stats?.newNewslettersPastWeek || 0}
        description="Last 7 days"
        icon={Mail}
        change={5.3}
        trend="up"
        isLoading={isLoading}
      />
      <StatsCard
        title="Categories"
        value={stats?.categories || 0}
        description="Industry categories"
        icon={Database}
        change={2}
        trend="up"
        isLoading={isLoading}
      />
      <StatsCard
        title="Uncategorized"
        value={stats?.uncategorized || 0}
        description="Needs review"
        icon={Mail}
        change={12}
        trend="down"
        isLoading={isLoading}
      />
    </div>
  );
};

export default ContentTab;
