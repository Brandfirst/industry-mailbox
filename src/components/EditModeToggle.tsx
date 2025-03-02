
import React from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Button } from '@/components/ui/button';
import { Pencil, Check } from 'lucide-react';

const EditModeToggle = () => {
  const { isEditMode, toggleEditMode } = useEditMode();

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={toggleEditMode}
        className={`edit-mode-toggle ${
          isEditMode 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-[#FF5722] hover:bg-[#FF8A50]'
        } text-white rounded-full p-3 h-12 w-12 flex items-center justify-center shadow-lg`}
        size="icon"
      >
        {isEditMode ? (
          <Check className="h-5 w-5" />
        ) : (
          <Pencil className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};

export default EditModeToggle;
