
import { useState, useEffect } from "react";
import { Briefcase, Pen } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  const [brandValue, setBrandValue] = useState(initialValue);

  // Update the internal state when initialValue changes (e.g., after navigation)
  useEffect(() => {
    setInputValue(initialValue);
    setBrandValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    try {
      await onUpdate(senderEmail, inputValue);
      setBrandValue(inputValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving brand:", error);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setInputValue(brandValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center">
          <span className="text-sm mr-2">{brandValue || "Not set"}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => setIsEditing(true)}
          >
            <Pen className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
      <Briefcase className="h-4 w-4 text-muted-foreground mt-2.5 md:mt-0" />
      <div className="flex flex-col w-full space-y-2">
        <Input
          placeholder="Enter brand name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="text-sm min-w-[200px] w-full"
        />
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSave}
            disabled={isUpdating}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandInput;
