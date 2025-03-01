
import { useState } from "react";
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

  const handleSave = async () => {
    await onUpdate(senderEmail, inputValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(initialValue);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Briefcase className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center">
          <span className="text-sm mr-2">{inputValue || "Not set"}</span>
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
    <div className="flex items-center space-x-2">
      <Briefcase className="h-4 w-4 text-muted-foreground" />
      <div className="flex w-full md:w-40">
        <Input
          placeholder="Enter brand name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mr-2 text-sm"
        />
        <div className="flex space-x-1">
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
