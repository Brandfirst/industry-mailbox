
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AuthButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/auth?mode=signin">
        <Button variant="ghost" className="btn-hover-effect text-gray-300 hover:text-white">Logg inn</Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors btn-hover-effect">
          Registrer
        </Button>
      </Link>
    </div>
  );
};
