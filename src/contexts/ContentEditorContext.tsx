
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types for our editor state and operations
export type EditableType = 'text' | 'padding' | 'margin' | 'color' | 'background' | 'fontSize' | 'alignment' | string;
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
    // Add visual-editor-active class to body when editing is active
    if (isEditing) {
      document.body.classList.add('visual-editor-active');
    } else {
      document.body.classList.remove('visual-editor-active');
      // Clean up any leftover styles when editing is stopped
      restoreOriginalStyles();
    }
    
    // Clean up when the component unmounts
    return () => {
      document.body.classList.remove('visual-editor-active');
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
    
    // Remove any highlighting from editable elements
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.classList.remove(
        'ring-2', 'ring-[#3a6ffb]', 'ring-offset-2', 'ring-offset-black',
        'ring-1', 'ring-blue-400', 'ring-opacity-50'
      );
    });
  };

  const selectElement = (element: EditableElement | null) => {
    // If we already have a selected element, restore its original styles before selecting a new one
    if (selectedElement && selectedElement.element && selectedElement.originalClassName && element?.id !== selectedElement.id) {
      selectedElement.element.className = selectedElement.className || '';
    }
    
    setSelectedElement(element);
    
    // Log selection for debugging
    if (element) {
      console.log('Selected element:', element);
    }
  };

  const updateSelectedElement = (updates: Partial<EditableElement>) => {
    if (!selectedElement) return;
    
    const updatedElement = { ...selectedElement, ...updates };
    
    // Apply changes to the actual DOM element
    if (updatedElement.element) {
      if (updates.className) {
        updatedElement.element.className = updates.className;
      }
      
      if (updates.content && updatedElement.type.includes('text')) {
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
