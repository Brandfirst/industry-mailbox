
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { format, subDays, formatDistanceToNow, parseISO } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SenderAnalyticsProps = {
  senders: NewsletterSenderStats[];
  loading: boolean;
  frequencyData: SenderFrequencyData[] | null;
};

export type SenderFrequencyData = {
  date: string;
  sender: string;
  count: number;
};

const SenderAnalytics = ({ senders, loading, frequencyData }: SenderAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState("frequency-table");

  const getTopSenders = () => {
    // Sort senders by newsletter count and get top 10
    return [...senders]
      .sort((a, b) => (b.newsletter_count || 0) - (a.newsletter_count || 0))
      .slice(0, 10)
      .map(sender => ({
        name: sender.brand_name || sender.sender_name || sender.sender_email,
        value: sender.newsletter_count || 0
      }));
  };
  
  // Get the top 5 most active senders
  const getTopActiveSenders = () => {
    return [...senders]
      .sort((a, b) => (b.newsletter_count || 0) - (a.newsletter_count || 0))
      .slice(0, 5);
  };
  
  // Get sender frequency data in a more tabular format
  const getSenderFrequencyTableData = () => {
    if (!frequencyData) return [];
    
    // Get top 5 senders
    const topSenders = getTopActiveSenders();
    
    // Calculate average newsletters per day for each sender
    return topSenders.map(sender => {
      const senderFrequencyData = frequencyData.filter(d => d.sender === sender.sender_email);
      const totalNewsletters = senderFrequencyData.reduce((sum, item) => sum + item.count, 0);
      const uniqueDays = new Set(senderFrequencyData.map(d => d.date)).size;
      
      // Calculate frequency (newsletters per day)
      const frequency = uniqueDays > 0 ? (totalNewsletters / uniqueDays).toFixed(1) : "0";
      
      // Get the most recent newsletter date
      const lastNewsletterDate = sender.last_sync_date 
        ? new Date(sender.last_sync_date)
        : null;
      
      // Calculate days since last newsletter
      const daysSinceLastNewsletter = lastNewsletterDate 
        ? Math.floor((new Date().getTime() - lastNewsletterDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;
      
      return {
        senderName: sender.brand_name || sender.sender_name || sender.sender_email,
        senderEmail: sender.sender_email,
        count: sender.newsletter_count,
        frequency: `${frequency} per day`,
        lastNewsletter: lastNewsletterDate 
          ? formatDistanceToNow(lastNewsletterDate, { addSuffix: true })
          : "Never",
        status: daysSinceLastNewsletter === null ? "unknown" :
               daysSinceLastNewsletter <= 1 ? "good" :
               daysSinceLastNewsletter <= 2 ? "warning" : "alert"
      };
    });
  };
  
  const getDailyFrequencyData = () => {
    if (!frequencyData) return [];

    // Get the most active senders (top 5)
    const topSenderEmails = getTopActiveSenders().map(s => s.sender_email);
      
    // Filter frequency data to only include top senders
    const filteredData = frequencyData.filter(d => 
      topSenderEmails.includes(d.sender)
    );
    
    // Group by date
    const dateGroups = filteredData.reduce((groups, item) => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
      return groups;
    }, {} as Record<string, SenderFrequencyData[]>);
    
    // Create chart data
    return Object.entries(dateGroups).map(([date, items]) => {
      const result: any = { date };
      
      items.forEach(item => {
        // Use brand name if available, otherwise sender email
        const senderKey = senders.find(s => s.sender_email === item.sender)?.brand_name || 
                          senders.find(s => s.sender_email === item.sender)?.sender_name || 
                          item.sender;
        result[senderKey] = item.count;
      });
      
      return result;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  // Get a random color for line chart based on index
  const getLineColor = (index: number) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];
    return colors[index % colors.length];
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "alert": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };
  
  const dailyData = getDailyFrequencyData();
  const lineKeys = dailyData.length > 0 
    ? Object.keys(dailyData[0]).filter(key => key !== 'date')
    : [];
  
  const frequencyTableData = getSenderFrequencyTableData();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Newsletter Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="frequency-table" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="frequency-table">Sending Frequency Table</TabsTrigger>
            <TabsTrigger value="frequency">Sending Frequency Chart</TabsTrigger>
            <TabsTrigger value="volume">Newsletter Volume</TabsTrigger>
          </TabsList>
          
          <TabsContent value="frequency-table" className="space-y-4">
            <h3 className="text-lg font-semibold">Sending Frequency and Last Newsletter (Top 5 Senders)</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : frequencyTableData.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sender</TableHead>
                      <TableHead>Total Newsletters</TableHead>
                      <TableHead>Sending Frequency</TableHead>
                      <TableHead>Last Newsletter</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {frequencyTableData.map((item) => (
                      <TableRow key={item.senderEmail}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{item.senderName}</span>
                            <span className="text-xs text-muted-foreground">{item.senderEmail}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.count}</Badge>
                        </TableCell>
                        <TableCell>{item.frequency}</TableCell>
                        <TableCell>{item.lastNewsletter}</TableCell>
                        <TableCell className="text-center">
                          {item.status === "alert" ? (
                            <div className="flex items-center justify-center">
                              <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
                              <span className="text-xs text-red-500">Check source</span>
                            </div>
                          ) : (
                            <div className={`w-3 h-3 rounded-full mx-auto ${getStatusColor(item.status)}`} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No frequency data available. Try syncing more newsletters.
              </div>
            )}
            
            <div className="space-y-2 text-sm text-muted-foreground mt-4">
              <div>Status indicators:</div>
              <div className="flex space-x-4">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" /> 
                  Last 24 hours
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" /> 
                  1-2 days ago
                </span>
                <span className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" /> 
                  More than 2 days - check source
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="frequency" className="space-y-4">
            <h3 className="text-lg font-semibold">Daily Sending Pattern (Top 5 Senders)</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {lineKeys.map((key, index) => (
                    <Line 
                      key={key}
                      type="monotone" 
                      dataKey={key} 
                      stroke={getLineColor(index)} 
                      activeDot={{ r: 8 }} 
                      name={key}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No frequency data available. Try syncing more newsletters.
              </div>
            )}
            
            <div className="text-sm text-muted-foreground mt-2">
              This chart shows the number of newsletters sent by each sender per day.
              A declining trend may indicate a sender is becoming less active.
            </div>
          </TabsContent>
          
          <TabsContent value="volume">
            <h3 className="text-lg font-semibold mb-4">Total Newsletter Volume (Top 10 Senders)</h3>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={getTopSenders()} 
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={90}
                    tickFormatter={(value) => 
                      value.length > 15 ? `${value.substring(0, 15)}...` : value
                    }
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Newsletters" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            <div className="text-sm text-muted-foreground mt-4">
              This chart shows the total volume of newsletters from each sender.
              A high volume may indicate an important sender to keep track of.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SenderAnalytics;
