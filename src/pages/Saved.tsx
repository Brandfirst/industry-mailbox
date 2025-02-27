
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Bookmark } from "lucide-react";

const Saved = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // This would normally fetch saved newsletters
    console.log("Fetching saved newsletters for user", user?.id);
  }, [user]);

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Mine lagrede nyhetsbrev</h1>
      <p className="text-muted-foreground mb-8">Her finner du alle nyhetsbrevene du har lagret.</p>
      
      {/* If no saved newsletters, show this */}
      <Card className="bg-slate-50 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            Ingen lagrede nyhetsbrev
          </CardTitle>
          <CardDescription>
            Du har ikke lagret noen nyhetsbrev ennå.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Klikk på bokmerke-ikonet på et nyhetsbrev for å lagre det her for enkel tilgang senere.
          </p>
          <Button 
            onClick={() => {
              toast({
                title: "Funksjon under utvikling",
                description: "Denne funksjonen er ikke helt klar ennå."
              });
            }}
          >
            Utforsk nyhetsbrev
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Saved;
