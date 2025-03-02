
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const NewsletterNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-16">
      <h3 className="text-xl font-medium mb-2">Nyhetsbrev ikke funnet</h3>
      <p className="text-muted-foreground mb-6">Vi kunne ikke finne nyhetsbrevet du leter etter</p>
      <Button onClick={() => navigate('/')}>
        Gå til forsiden
      </Button>
    </div>
  );
};

export default NewsletterNotFound;
