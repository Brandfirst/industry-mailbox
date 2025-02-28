
import { Mail, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Thank you for subscribing to our updates!");
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-900/60 to-blue-800/40 border border-blue-800/50 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center mb-2 text-blue-300">
        <Mail className="w-4 h-4 mr-2" />
        <h3 className="text-sm font-medium">NewsletterHub Updates</h3>
      </div>
      <p className="text-xs text-gray-300 mb-3">
        Stay updated with the latest features and newsletter trends
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Your email address"
          className="flex-grow bg-dark-300/60 border-gray-700 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-xs" 
          size="sm"
          disabled={isLoading}
        >
          Subscribe
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </form>
    </div>
  );
}
