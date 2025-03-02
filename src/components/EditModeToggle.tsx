
import React from 'react';
import { Button } from '@/components/ui/button';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAuth } from '@/contexts/auth';
import { Pencil, Check } from 'lucide-react';

const EditModeToggle: React.FC = () => {
  const { isEditMode, toggleEditMode } = useEditMode();
  const { isAdmin } = useAuth();

  // Only show to admins
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <Button
        onClick={toggleEditMode}
        className={`${
          isEditMode 
            ? 'bg-[#FF5722] hover:bg-[#FF8A50]' 
            : 'bg-black border border-[#FF5722] text-white hover:bg-[#FF5722]/20'
        } rounded-full p-3 shadow-lg`}
        aria-label={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
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
