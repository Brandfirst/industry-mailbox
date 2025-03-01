
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Search, Users, UserCheck, Crown, Filter } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { getUserProfiles } from "@/lib/supabase/userProfile";
import { toast } from "sonner";
import UsersTab from "@/components/admin/stats/UsersTab";
import { useAuth } from "@/contexts/auth";
import { AdminStatsType } from "@/components/admin/stats/types";

// Define the user profile structure
interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  premium: boolean | null;
  created_at: string;
}

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUserTab, setActiveUserTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const usersPerPage = 10;
  
  // Protect the route
  useEffect(() => {
    if (isAdmin === false) {
      toast.error("You don't have permission to access the user management area");
      navigate('/');
    }
  }, [isAdmin, navigate]);
  
  // Fetch user data
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const profiles = await getUserProfiles();
      setUserProfiles(profiles);
      toast.success("User data loaded successfully");
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Filter users based on search query and active tab
  const filteredUsers = userProfiles.filter(user => {
    const matchesSearch = 
      searchQuery === "" || 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeUserTab === "all") return matchesSearch;
    if (activeUserTab === "admin") return matchesSearch && user.role === "admin";
    if (activeUserTab === "premium") return matchesSearch && user.premium === true;
    if (activeUserTab === "regular") return matchesSearch && user.role === "user" && user.premium !== true;
    
    return matchesSearch;
  });
  
  // Pagination
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );
  
  // User statistics
  const userStats = {
    totalUsers: userProfiles.length,
    adminUsers: userProfiles.filter(user => user.role === "admin").length,
    premiumUsers: userProfiles.filter(user => user.premium === true).length,
    regularUsers: userProfiles.filter(user => user.role === "user" && user.premium !== true).length
  };

  // Calculate new users in past week
  const newUsersInPastWeek = userProfiles.filter(user => {
    const createdDate = new Date(user.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }).length;
  
  // Create a proper AdminStatsType object
  const adminStats: AdminStatsType = {
    totalUsers: userStats.totalUsers,
    premiumUsers: userStats.premiumUsers,
    totalNewsletters: 0, // We don't have this data in this component
    storageUsed: "0 MB", // We don't have this data in this component
    newUsers: newUsersInPastWeek,
    activeUsers: userStats.totalUsers,
    premiumConversion: userStats.premiumUsers > 0 
      ? `${Math.round((userStats.premiumUsers / userStats.totalUsers) * 100)}%` 
      : "0%",
    newNewslettersPastWeek: 0, // We don't have this data in this component
    categories: 0, // We don't have this data in this component
    uncategorized: 0 // We don't have this data in this component
  };
  
  return (
    <AdminLayout activeTab="users" setActiveTab={setActiveTab}>
      <div className="flex flex-col space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">View and manage user accounts</p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchUsers} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        
        {/* User Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{userStats.totalUsers}</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{userStats.adminUsers}</div>
                <UserCheck className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{userStats.premiumUsers}</div>
                <Crown className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{userStats.regularUsers}</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed user statistics for admins */}
        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersTab 
              stats={adminStats}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
        
        {/* User listing */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <CardTitle>User Accounts</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 w-full md:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" title="Filter">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" value={activeUserTab} onValueChange={setActiveUserTab}>
              <div className="border-b px-6">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="admin">Admins</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="regular">Regular</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <UserTable users={paginatedUsers} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="admin" className="m-0">
                <UserTable 
                  users={paginatedUsers} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="premium" className="m-0">
                <UserTable 
                  users={paginatedUsers} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="regular" className="m-0">
                <UserTable 
                  users={paginatedUsers} 
                  isLoading={isLoading} 
                />
              </TabsContent>
            </Tabs>
            
            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex justify-center p-4 border-t">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1} 
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink 
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                        disabled={currentPage === pageCount} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

// User table component
interface UserTableProps {
  users: UserProfile[];
  isLoading: boolean;
}

const UserTable = ({ users, isLoading }: UserTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-muted-foreground">
        No users found
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                <div>
                  <div>{user.email}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.first_name && user.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : "No name provided"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {user.role === "admin" ? (
                  <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Admin</Badge>
                ) : (
                  <Badge variant="outline">User</Badge>
                )}
              </TableCell>
              <TableCell>
                {user.premium ? (
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Premium</Badge>
                ) : (
                  <Badge variant="secondary">Regular</Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersPage;
