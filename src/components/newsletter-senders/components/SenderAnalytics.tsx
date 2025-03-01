
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { NewsletterSenderStats } from "@/lib/supabase/newsletters/types";
import { format, subDays, addDays, isSameDay, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("frequency");

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
  
  const getDailyFrequencyData = () => {
    if (!frequencyData) return [];

    // Get the most active senders (top 5)
    const topSenderEmails = [...senders]
      .sort((a, b) => (b.newsletter_count || 0) - (a.newsletter_count || 0))
      .slice(0, 5)
      .map(s => s.sender_email);
      
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
  
  const dailyData = getDailyFrequencyData();
  const lineKeys = dailyData.length > 0 
    ? Object.keys(dailyData[0]).filter(key => key !== 'date')
    : [];

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Newsletter Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="frequency" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="frequency">Sending Frequency</TabsTrigger>
            <TabsTrigger value="volume">Newsletter Volume</TabsTrigger>
          </TabsList>
          
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
