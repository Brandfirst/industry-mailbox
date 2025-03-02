
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const AuthButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Link to="/auth?mode=signin">
        <Button variant="outline" className="btn-hover-effect text-gray-300 hover:text-white backdrop-blur-sm bg-black/30">Logg inn</Button>
      </Link>
      <Link to="/auth?mode=signup">
        <Button className="bg-gradient-to-r from-[#FF5722] to-[#FF8A50] text-white hover:from-[#FF8A50] hover:to-[#FF5722] transition-all backdrop-blur-sm bg-opacity-20 border border-white/10 shadow-md btn-hover-effect">
          Registrer
        </Button>
      </Link>
    </div>
  );
};
