
import { useState } from "react";
import { Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BrandInputProps = {
  senderEmail: string;
  initialValue: string;
  isUpdating: boolean;
  onUpdate: (senderEmail: string, brandName: string) => Promise<void>;
};

const BrandInput = ({ 
  senderEmail, 
  initialValue, 
  isUpdating, 
  onUpdate 
}: BrandInputProps) => {
  const [inputValue, setInputValue] = useState(initialValue);

  return (
    <div className="flex items-center space-x-2">
      <Briefcase className="h-4 w-4 text-muted-foreground" />
      <div className="flex w-full md:w-40">
        <Input
          placeholder="Enter brand name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mr-2 text-sm"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdate(senderEmail, inputValue)}
          disabled={isUpdating}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default BrandInput;
