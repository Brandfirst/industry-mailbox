
import { useState, useEffect } from "react";
import { Users, Mail, Database, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  change,
  trend = "neutral"
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
      </CardContent>
    </Card>
  );
};

const AdminStats = () => {
  // Mock data - would be replaced with real API calls
  const stats = {
    totalUsers: 1248,
    premiumUsers: 342,
    totalNewsletters: 8453,
    newNewslettersPastWeek: 234,
    storageUsed: "12.6 GB",
    categories: 18
  };

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
            value={stats.totalUsers}
            description="All registered users"
            icon={Users}
            change={8.2}
            trend="up"
          />
          <StatsCard
            title="Premium Users"
            value={stats.premiumUsers}
            description={`${((stats.premiumUsers / stats.totalUsers) * 100).toFixed(1)}% of total`}
            icon={Users}
            change={5.1}
            trend="up"
          />
          <StatsCard
            title="Total Newsletters"
            value={stats.totalNewsletters}
            description="Archived newsletters"
            icon={Mail}
            change={12.5}
            trend="up"
          />
          <StatsCard
            title="Storage Used"
            value={stats.storageUsed}
            description="Database storage"
            icon={Database}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="New Users (Week)"
            value="156"
            description="New registrations"
            icon={Users}
            change={3.2}
            trend="up"
          />
          <StatsCard
            title="Active Users"
            value="892"
            description="Last 30 days"
            icon={Users}
            change={1.8}
            trend="up"
          />
          <StatsCard
            title="Premium Conversion"
            value="27.4%"
            description="Conversion rate"
            icon={TrendingUp}
            change={0.5}
            trend="down"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="content" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="New Newsletters"
            value={stats.newNewslettersPastWeek}
            description="Last 7 days"
            icon={Mail}
            change={5.3}
            trend="up"
          />
          <StatsCard
            title="Categories"
            value={stats.categories}
            description="Industry categories"
            icon={Database}
            change={2}
            trend="up"
          />
          <StatsCard
            title="Uncategorized"
            value="126"
            description="Needs review"
            icon={Mail}
            change={12}
            trend="down"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AdminStats;
