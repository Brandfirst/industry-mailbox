
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Play, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DebugEdgeFunction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("response");
  const [connectionTest, setConnectionTest] = useState<{status: string, message: string} | null>(null);

  const handleTestEdgeFunction = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);
    setConnectionTest(null);
    toast.info("Testing Edge Function connection...");

    try {
      console.log("Invoking debug-test Edge Function...");
      const { data, error } = await supabase.functions.invoke('debug-test', {
        method: 'POST',
        body: { 
          timestamp: new Date().toISOString(),
          clientInfo: "Testing from admin panel",
          randomData: Math.random().toString(36).substring(2)
        }
      });

      if (error) {
        console.error("Edge Function error:", error);
        toast.error(`Edge Function error: ${error.message}`);
        setError(error.message);
        setResponse({ error: error.message });
      } else {
        console.log("Edge Function response:", data);
        toast.success("Edge Function called successfully!");
        setResponse(data);
        setActiveTab("response");
      }
    } catch (error) {
      console.error("Error calling Edge Function:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Error: ${errorMessage}`);
      setError(errorMessage);
      setResponse({ error: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckLogs = () => {
    // Open Supabase logs in a new tab
    window.open(`https://supabase.com/dashboard/project/ldhnqpkaifyoxtuchxko/functions/debug-test/logs`, '_blank');
  };

  const handleTestConnection = async () => {
    setConnectionTest({status: "testing", message: "Testing connection to Supabase..."});
    
    try {
      // Test basic connection with a simple query
      const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
      
      if (error) {
        console.error("Connection test error:", error);
        setConnectionTest({
          status: "error", 
          message: `Failed to connect to Supabase: ${error.message}`
        });
      } else {
        console.log("Connection test successful:", data);
        setConnectionTest({
          status: "success", 
          message: "Successfully connected to Supabase!"
        });
      }
    } catch (error) {
      console.error("Connection test exception:", error);
      setConnectionTest({
        status: "error", 
        message: `Connection exception: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Edge Function Debug Tool</CardTitle>
        <CardDescription>
          Test the connection to Supabase Edge Functions and verify logs are being generated
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleTestEdgeFunction} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Test Edge Function
            </Button>
            
            <Button 
              onClick={handleCheckLogs} 
              variant="outline"
              className="flex-1"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Function Logs
            </Button>
            
            <Button 
              onClick={handleTestConnection} 
              variant="secondary"
              className="flex-1"
              disabled={connectionTest?.status === "testing"}
            >
              {connectionTest?.status === "testing" ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test DB Connection
            </Button>
          </div>
          
          {connectionTest && (
            <div className={`mt-4 border rounded-md p-4 ${
              connectionTest.status === "success" ? "border-green-500 bg-green-50 dark:bg-green-950/20" : 
              connectionTest.status === "error" ? "border-destructive bg-destructive/10" : 
              "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {connectionTest.status === "success" ? (
                  <div className="text-green-500">✓</div>
                ) : connectionTest.status === "error" ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
                )}
                <h3 className={`text-sm font-medium ${
                  connectionTest.status === "success" ? "text-green-500" : 
                  connectionTest.status === "error" ? "text-destructive" : "text-amber-500"
                }`}>
                  {connectionTest.status === "success" ? "Connection Successful" : 
                   connectionTest.status === "error" ? "Connection Error" : "Testing Connection"}
                </h3>
              </div>
              <p className={`text-xs ${
                connectionTest.status === "success" ? "text-green-600" : 
                connectionTest.status === "error" ? "text-destructive" : "text-amber-600"
              }`}>
                {connectionTest.message}
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 border border-destructive rounded-md p-4 bg-destructive/10 overflow-auto">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <h3 className="text-sm font-medium text-destructive">Error</h3>
              </div>
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}
          
          {response && (
            <div className="mt-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="response" className="flex-1">Response</TabsTrigger>
                  <TabsTrigger value="raw" className="flex-1">Raw JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="response">
                  <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900 overflow-auto">
                    <h3 className="text-sm font-medium mb-2">Function Response:</h3>
                    {response.success ? (
                      <div className="space-y-2">
                        <p className="text-xs text-emerald-500">✓ Function executed successfully</p>
                        {response.debug && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium mt-2">Debug Information:</p>
                            <ul className="text-xs space-y-1">
                              <li><span className="font-medium">Request Time:</span> {response.debug.requestTimestamp}</li>
                              <li><span className="font-medium">Response Time:</span> {response.debug.timestamp}</li>
                              <li><span className="font-medium">Environment:</span> {response.debug.environment}</li>
                              <li><span className="font-medium">Has Supabase URL:</span> {response.debug.hasSupabaseUrl ? "Yes" : "No"}</li>
                              <li><span className="font-medium">Has Supabase Key:</span> {response.debug.hasSupabaseKey ? "Yes" : "No"}</li>
                              <li><span className="font-medium">Has Service Role Key:</span> {response.debug.hasServiceRoleKey ? "Yes" : "No"}</li>
                              <li><span className="font-medium">Supabase Project:</span> {response.debug.projectRef || "Unknown"}</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-destructive">Function execution failed</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="raw">
                  <div className="border rounded-md p-4 bg-slate-50 dark:bg-slate-900 overflow-auto">
                    <h3 className="text-sm font-medium mb-2">Raw JSON:</h3>
                    <pre className="text-xs overflow-auto max-h-96">{JSON.stringify(response, null, 2)}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground space-y-2">
            <p>After clicking "Test Edge Function", check the Supabase Edge Function logs to verify if the function was called and logs were generated.</p>
            <p>If you don't see logs immediately, there might be a delay in Supabase's logging system or a connection issue. Use the "Test DB Connection" to verify basic connectivity.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
