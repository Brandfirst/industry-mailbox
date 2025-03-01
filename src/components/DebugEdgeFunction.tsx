
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DebugEdgeFunction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleTestEdgeFunction = async () => {
    setIsLoading(true);
    setResponse(null);
    toast.info("Testing Edge Function connection...");

    try {
      console.log("Invoking debug-test Edge Function...");
      const { data, error } = await supabase.functions.invoke('debug-test', {
        method: 'POST',
        body: { timestamp: new Date().toISOString() }
      });

      if (error) {
        console.error("Edge Function error:", error);
        toast.error(`Edge Function error: ${error.message}`);
        setResponse({ error: error.message });
      } else {
        console.log("Edge Function response:", data);
        toast.success("Edge Function called successfully!");
        setResponse(data);
      }
    } catch (error) {
      console.error("Error calling Edge Function:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setResponse({ error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Edge Function Debug Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={handleTestEdgeFunction} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Test Edge Function
          </Button>
          
          {response && (
            <div className="mt-4 border rounded-md p-4 bg-slate-50 dark:bg-slate-900 overflow-auto">
              <h3 className="text-sm font-medium mb-2">Response:</h3>
              <pre className="text-xs">{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Check the Supabase Edge Function logs to verify if the function was called.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
