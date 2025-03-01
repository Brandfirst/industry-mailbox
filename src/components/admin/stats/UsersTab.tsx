
import { Users, TrendingUp } from "lucide-react";
import StatsCard from "./StatsCard";
import { AdminStatsType } from "./types";

interface UsersTabProps {
  stats: AdminStatsType | null;
  isLoading: boolean;
}

const UsersTab = ({ stats, isLoading }: UsersTabProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="New Users (Week)"
        value={stats?.newUsers || 0}
        description="New registrations"
        icon={Users}
        change={3.2}
        trend="up"
        isLoading={isLoading}
      />
      <StatsCard
        title="Active Users"
        value={stats?.activeUsers || 0}
        description="Last 30 days"
        icon={Users}
        change={1.8}
        trend="up"
        isLoading={isLoading}
      />
      <StatsCard
        title="Premium Conversion"
        value={stats?.premiumConversion || "0%"}
        description="Conversion rate"
        icon={TrendingUp}
        change={0.5}
        trend="down"
        isLoading={isLoading}
      />
    </div>
  );
};

export default UsersTab;
