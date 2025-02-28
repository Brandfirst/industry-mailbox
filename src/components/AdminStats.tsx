
import { useState, useEffect } from "react";
import { Users, Mail, Database, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAdminStats } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  change?: number;
  trend?: "up" | "down" | "neutral";
  isLoading?: boolean;
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  change,
  trend = "neutral",
  isLoading = false
}: StatsCardProps) => {
  const trendColor = trend === "up" 
    ? "text-green-500" 
    : trend === "down" 
      ? "text-red-500" 
      : "text-gray-500";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            <CardDescription className="flex items-center mt-1 text-xs">
              {description}
              {change !== undefined && (
                <span className={`ml-2 flex items-center ${trendColor}`}>
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {change}%
                </span>
              )}
            </CardDescription>
          </>
        )}
      </CardContent>
    </Card>
  );
};

interface AdminStatsType {
  totalUsers: number;
  premiumUsers: number;
  totalNewsletters: number;
  storageUsed: string;
  newUsers: number;
  activeUsers: number;
  premiumConversion: string;
  newNewslettersPastWeek: number;
  categories: number;
  uncategorized: number;
}

const AdminStats = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !isAdmin) {
        setError("You don't have admin access");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch the latest stats from admin_stats table
        const statsData = await getAdminStats();
        
        // Get the latest stats or use empty default if no stats exist
        const latestStats = statsData || null;
        
        // Fetch additional data that isn't stored in the stats table
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('count', { count: 'exact' });
          
        if (categoriesError) {
          console.error("Error fetching categories:", categoriesError);
          throw new Error(categoriesError.message);
        }
        
        // Fetch weekly newsletters count
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { data: weeklyNewsletters, error: weeklyNewslettersError } = await supabase
          .from('newsletters')
          .select('count', { count: 'exact' })
          .gte('created_at', oneWeekAgo.toISOString());
          
        if (weeklyNewslettersError) {
          console.error("Error fetching weekly newsletters:", weeklyNewslettersError);
          throw new Error(weeklyNewslettersError.message);
        }

        // For now, use some calculated or default values for data we don't have yet
        const categoriesCount = categoriesData?.length || 0;
        const weeklyNewslettersCount = weeklyNewsletters?.length || 0;
        
        // If we don't have stats data, fetch direct counts
        let totalUsers = latestStats?.total_users || 0;
        let premiumUsers = latestStats?.premium_users || 0;
        let totalNewsletters = latestStats?.total_newsletters || 0;
        
        // If we don't have stats data, try to get direct counts
        if (!latestStats) {
          // Get user count
          const { count: userCount, error: userCountError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
            
          if (userCountError) {
            console.error("Error fetching user count:", userCountError);
          } else {
            totalUsers = userCount || 0;
          }
          
          // Get premium user count
          const { count: premiumCount, error: premiumCountError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('premium', true);
            
          if (premiumCountError) {
            console.error("Error fetching premium user count:", premiumCountError);
          } else {
            premiumUsers = premiumCount || 0;
          }
          
          // Get newsletter count
          const { count: newsletterCount, error: newsletterCountError } = await supabase
            .from('newsletters')
            .select('*', { count: 'exact', head: true });
            
          if (newsletterCountError) {
            console.error("Error fetching newsletter count:", newsletterCountError);
          } else {
            totalNewsletters = newsletterCount || 0;
          }
        }
        
        const formattedStats: AdminStatsType = {
          totalUsers: totalUsers,
          premiumUsers: premiumUsers,
          totalNewsletters: totalNewsletters,
          storageUsed: formatBytes(latestStats?.storage_used || 0),
          newUsers: Math.floor(totalUsers * 0.12) || 0, // Placeholder: 12% of total
          activeUsers: Math.floor(totalUsers * 0.76) || 0, // Placeholder: 76% of total
          premiumConversion: totalUsers > 0 ? 
            `${((premiumUsers / totalUsers) * 100).toFixed(1)}%` : 
            "0%",
          newNewslettersPastWeek: weeklyNewslettersCount,
          categories: categoriesCount,
          uncategorized: Math.floor(totalNewsletters * 0.05) || 0 // Placeholder: 5% of total
        };
        
        setStats(formattedStats);
      } catch (err) {
        console.error("Error in fetchStats:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Update stats automatically every 5 minutes
    const intervalId = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [user, isAdmin]);

  // Helper function to format bytes to human-readable format
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-0">
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
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
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
      </TabsContent>
      
      <TabsContent value="content" className="space-y-4">
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
      </TabsContent>
    </Tabs>
  );
};

export default AdminStats;
