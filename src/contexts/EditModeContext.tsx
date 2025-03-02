
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  toggleEditMode: () => {},
});

export const useEditMode = () => useContext(EditModeContext);

interface EditModeProviderProps {
  children: ReactNode;
}

export const EditModeProvider = ({ children }: EditModeProviderProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev);
    // Add or remove a class to the body for global styling
    if (!isEditMode) {
      document.body.classList.add('edit-mode-active');
    } else {
      document.body.classList.remove('edit-mode-active');
    }
  };

  return (
    <EditModeContext.Provider value={{ isEditMode, toggleEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
};
