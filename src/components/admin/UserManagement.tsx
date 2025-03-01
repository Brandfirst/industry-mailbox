
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserPlus, 
  DollarSign, 
  ClockIcon, 
  ShieldAlert, 
  ShieldCheck,
  Search
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserProfiles } from "@/lib/supabase/userProfile";
import { useAuth } from "@/contexts/auth/useAuth";

type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  premium: boolean | null;
  created_at: string;
  updated_at: string;
};

type UserStats = {
  totalUsers: number;
  adminUsers: number;
  premiumUsers: number;
  regularUsers: number;
  trialUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
};

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    adminUsers: 0,
    premiumUsers: 0,
    regularUsers: 0,
    trialUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  });
  const { isAdmin } = useAuth();

  const loadUserProfiles = async () => {
    setIsLoading(true);
    try {
      const profiles = await getUserProfiles();
      
      if (profiles && Array.isArray(profiles)) {
        setUsers(profiles);
        setFilteredUsers(profiles);
        
        // Calculate stats
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const oneWeekAgo = new Date(today - 7 * 24 * 60 * 60 * 1000).getTime();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
        
        const stats: UserStats = {
          totalUsers: profiles.length,
          adminUsers: profiles.filter(u => u.role === 'admin').length,
          premiumUsers: profiles.filter(u => u.premium === true).length,
          regularUsers: profiles.filter(u => !u.premium && u.role !== 'admin').length,
          trialUsers: 0, // Assuming trial users would have a specific flag
          newUsersToday: profiles.filter(u => new Date(u.created_at).getTime() >= today).length,
          newUsersThisWeek: profiles.filter(u => new Date(u.created_at).getTime() >= oneWeekAgo).length,
          newUsersThisMonth: profiles.filter(u => new Date(u.created_at).getTime() >= oneMonthAgo).length
        };
        
        setUserStats(stats);
      }
    } catch (error) {
      console.error("Error loading user profiles:", error);
      toast.error("Failed to load user profiles");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUserProfiles();
    }
  }, [isAdmin]);

  useEffect(() => {
    let result = [...users];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.email?.toLowerCase().includes(query) ||
          user.first_name?.toLowerCase().includes(query) ||
          user.last_name?.toLowerCase().includes(query)
      );
    }
    
    // Filter by tab
    if (currentTab !== "all") {
      switch (currentTab) {
        case "admin":
          result = result.filter(user => user.role === "admin");
          break;
        case "premium":
          result = result.filter(user => user.premium === true);
          break;
        case "regular":
          result = result.filter(user => !user.premium && user.role !== "admin");
          break;
        case "recent":
          // Get users from the last 7 days
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          result = result.filter(user => new Date(user.created_at) > oneWeekAgo);
          break;
      }
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, currentTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getUserFullName = (user: UserProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.last_name) {
      return user.last_name;
    }
    return "Unknown";
  };

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive" className="flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Admin</Badge>;
      case "moderator":
        return <Badge variant="secondary" className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Moderator</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><UserCheck className="h-3 w-3" /> User</Badge>;
    }
  };

  const getPremiumBadge = (isPremium: boolean | null) => {
    if (isPremium) {
      return <Badge variant="default" className="bg-amber-600 hover:bg-amber-700 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Premium</Badge>;
    }
    return <Badge variant="outline" className="flex items-center gap-1"><ClockIcon className="h-3 w-3" /> Free</Badge>;
  };

  return (
    <Card className="shadow-md w-full bg-background border-border">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              User Management
            </CardTitle>
            <CardDescription>
              View and manage all users in the system
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full pl-9 bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={loadUserProfiles} className="border-border">
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold mt-1">{userStats.totalUsers}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Premium Users</p>
                  <h3 className="text-2xl font-bold mt-1">{userStats.premiumUsers}</h3>
                </div>
                <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admin Users</p>
                  <h3 className="text-2xl font-bold mt-1">{userStats.adminUsers}</h3>
                </div>
                <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New This Week</p>
                  <h3 className="text-2xl font-bold mt-1">{userStats.newUsersThisWeek}</h3>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="bg-muted/50 border-border mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-background data-[state=active]:shadow">All Users</TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-background data-[state=active]:shadow">Admins</TabsTrigger>
            <TabsTrigger value="premium" className="data-[state=active]:bg-background data-[state=active]:shadow">Premium</TabsTrigger>
            <TabsTrigger value="regular" className="data-[state=active]:bg-background data-[state=active]:shadow">Regular</TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-background data-[state=active]:shadow">Recent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <UserTable 
              users={filteredUsers} 
              isLoading={isLoading} 
              getUserFullName={getUserFullName}
              formatDate={formatDate}
              getRoleBadge={getRoleBadge}
              getPremiumBadge={getPremiumBadge}
            />
          </TabsContent>
          
          <TabsContent value="admin" className="mt-0">
            <UserTable 
              users={filteredUsers} 
              isLoading={isLoading} 
              getUserFullName={getUserFullName}
              formatDate={formatDate}
              getRoleBadge={getRoleBadge}
              getPremiumBadge={getPremiumBadge}
            />
          </TabsContent>
          
          <TabsContent value="premium" className="mt-0">
            <UserTable 
              users={filteredUsers} 
              isLoading={isLoading} 
              getUserFullName={getUserFullName}
              formatDate={formatDate}
              getRoleBadge={getRoleBadge}
              getPremiumBadge={getPremiumBadge}
            />
          </TabsContent>
          
          <TabsContent value="regular" className="mt-0">
            <UserTable 
              users={filteredUsers} 
              isLoading={isLoading} 
              getUserFullName={getUserFullName}
              formatDate={formatDate}
              getRoleBadge={getRoleBadge}
              getPremiumBadge={getPremiumBadge}
            />
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0">
            <UserTable 
              users={filteredUsers} 
              isLoading={isLoading} 
              getUserFullName={getUserFullName}
              formatDate={formatDate}
              getRoleBadge={getRoleBadge}
              getPremiumBadge={getPremiumBadge}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

type UserTableProps = {
  users: UserProfile[];
  isLoading: boolean;
  getUserFullName: (user: UserProfile) => string;
  formatDate: (date: string) => string;
  getRoleBadge: (role: string | null) => JSX.Element;
  getPremiumBadge: (isPremium: boolean | null) => JSX.Element;
};

const UserTable = ({ 
  users, 
  isLoading, 
  getUserFullName,
  formatDate,
  getRoleBadge,
  getPremiumBadge
}: UserTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-md border border-border">
        <UserMinus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium mb-1">No users found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{getUserFullName(user)}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>{getPremiumBadge(user.premium)}</TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserManagement;
