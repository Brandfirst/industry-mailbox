
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UnderConstructionTabProps {
  setActiveTab: (tab: string) => void;
}

const UnderConstructionTab = ({ setActiveTab }: UnderConstructionTabProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-card rounded-lg border border-border p-6 text-center my-4">
      <h2 className="text-xl font-medium mb-2 text-card-foreground">This Section is Under Construction</h2>
      <p className="text-muted-foreground mb-4">
        We're working on bringing you a complete admin experience.
      </p>
      <Button onClick={() => {
        setActiveTab("dashboard");
        navigate('/admin/dashboard');
      }}>
        Return to Dashboard
      </Button>
    </div>
  );
};

export default UnderConstructionTab;
