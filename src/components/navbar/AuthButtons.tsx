
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AuthButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/auth?mode=signin">
        <Button variant="outline" className="glass-button text-gray-300 hover:text-white backdrop-blur-sm bg-black/30">Logg inn</Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button className="gradient-button">
          Registrer
        </Button>
      </Link>
    </div>
  );
};
