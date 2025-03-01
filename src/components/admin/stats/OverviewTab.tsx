
import { Users, Mail, Database } from "lucide-react";
import StatsCard from "./StatsCard";
import { AdminStatsType } from "./types";

interface OverviewTabProps {
  stats: AdminStatsType | null;
  isLoading: boolean;
}

const OverviewTab = ({ stats, isLoading }: OverviewTabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={stats?.totalUsers || 0}
        description="All registered users"
        icon={Users}
        change={8.2}
        trend="up"
        isLoading={isLoading}
      />
      <StatsCard
        title="Premium Users"
        value={stats?.premiumUsers || 0}
        description={stats && stats.totalUsers > 0 ? `${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% of total` : "0% of total"}
        icon={Users}
        change={5.1}
        trend="up"
        isLoading={isLoading}
      />
      <StatsCard
        title="Total Newsletters"
        value={stats?.totalNewsletters || 0}
        description="Archived newsletters"
        icon={Mail}
        change={12.5}
        trend="up"
        isLoading={isLoading}
      />
      <StatsCard
        title="Storage Used"
        value={stats?.storageUsed || "0 KB"}
        description="Database storage"
        icon={Database}
        isLoading={isLoading}
      />
    </div>
  );
};

export default OverviewTab;
