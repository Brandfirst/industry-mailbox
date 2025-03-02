
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewsletterHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate(-1)}
      className="mb-6"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Tilbake
    </Button>
  );
};

export default NewsletterHeader;
