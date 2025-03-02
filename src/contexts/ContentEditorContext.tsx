
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types for our editor state and operations
type EditableType = 'text' | 'padding' | 'margin' | 'color' | 'background' | 'fontSize' | 'alignment';
export type EditableElement = {
  id: string;
  type: EditableType;
  content?: string;
  className?: string;
  element?: HTMLElement;
  originalClassName?: string;
};

type ContentEditorContextType = {
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  saveChanges: () => void;
  cancelChanges: () => void;
  selectedElement: EditableElement | null;
  selectElement: (element: EditableElement | null) => void;
  updateSelectedElement: (updates: Partial<EditableElement>) => void;
  elementsHistory: Record<string, string>;
};

const ContentEditorContext = createContext<ContentEditorContextType | undefined>(undefined);

export const ContentEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [elementsHistory, setElementsHistory] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Clean up when the component unmounts or editing is stopped
    return () => {
      if (isEditing) {
        restoreOriginalStyles();
      }
    };
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
    toast("Edit mode activated", {
      description: "Click on elements to edit their properties",
    });
  };

  const stopEditing = () => {
    setIsEditing(false);
    setSelectedElement(null);
  };

  const saveChanges = () => {
    // Here we would typically save to a database
    // For now, we'll just show a toast and update our history
    const newHistory = { ...elementsHistory };
    
    if (selectedElement && selectedElement.id) {
      newHistory[selectedElement.id] = selectedElement.className || '';
    }
    
    setElementsHistory(newHistory);
    setSelectedElement(null);
    setIsEditing(false);
    
    toast.success("Changes saved successfully", {
      description: "Your edits have been applied"
    });
  };

  const cancelChanges = () => {
    restoreOriginalStyles();
    setSelectedElement(null);
    setIsEditing(false);
    
    toast("Edits discarded", {
      description: "Reverted to previous state"
    });
  };

  const restoreOriginalStyles = () => {
    // Restore original styles for all edited elements
    if (selectedElement && selectedElement.element && selectedElement.originalClassName) {
      selectedElement.element.className = selectedElement.originalClassName;
    }
  };

  const selectElement = (element: EditableElement | null) => {
    setSelectedElement(element);
  };

  const updateSelectedElement = (updates: Partial<EditableElement>) => {
    if (!selectedElement) return;
    
    const updatedElement = { ...selectedElement, ...updates };
    
    // Apply changes to the actual DOM element
    if (updatedElement.element) {
      if (updates.className) {
        updatedElement.element.className = updates.className;
      }
      
      if (updates.content && updatedElement.type === 'text') {
        updatedElement.element.textContent = updates.content;
      }
    }
    
    setSelectedElement(updatedElement);
  };

  return (
    <ContentEditorContext.Provider
      value={{
        isEditing,
        startEditing,
        stopEditing,
        saveChanges,
        cancelChanges,
        selectedElement,
        selectElement,
        updateSelectedElement,
        elementsHistory,
      }}
    >
      {children}
    </ContentEditorContext.Provider>
  );
};

export const useContentEditor = () => {
  const context = useContext(ContentEditorContext);
  if (context === undefined) {
    throw new Error('useContentEditor must be used within a ContentEditorProvider');
  }
  return context;
};
