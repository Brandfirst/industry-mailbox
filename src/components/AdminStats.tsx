
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminStats } from "@/components/admin/stats/useAdminStats";
import ErrorState from "@/components/admin/stats/ErrorState";
import OverviewTab from "@/components/admin/stats/OverviewTab";
import UsersTab from "@/components/admin/stats/UsersTab";
import ContentTab from "@/components/admin/stats/ContentTab";

const AdminStats = () => {
  const { stats, isLoading, error } = useAdminStats();
  const [activeTab, setActiveTab] = useState("overview");

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Tabs 
      defaultValue="overview" 
      className="w-full"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-0">
        <OverviewTab stats={stats} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <UsersTab stats={stats} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="content" className="space-y-4">
        <ContentTab stats={stats} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
};

export default AdminStats;
