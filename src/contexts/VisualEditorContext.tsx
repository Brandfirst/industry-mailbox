
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Section } from '@/components/SectionManager';

type EditableProperty = {
  name: string;
  value: string | number;
  unit?: 'px' | '%' | 'rem' | 'em';
  min?: number;
  max?: number;
  type: 'range' | 'text' | 'select' | 'alignment';
  options?: string[];
};

type EditableStyles = {
  padding: EditableProperty;
  paddingTop: EditableProperty;
  paddingBottom: EditableProperty;
  paddingLeft: EditableProperty;
  paddingRight: EditableProperty;
  margin: EditableProperty;
  marginTop: EditableProperty;
  marginBottom: EditableProperty;
  marginLeft: EditableProperty;
  marginRight: EditableProperty;
  textAlign: EditableProperty;
  height: EditableProperty;
  width: EditableProperty;
};

type EditableContent = {
  elementId: string;
  content: string;
  type: 'heading' | 'paragraph' | 'button' | 'list';
};

type VisualEditorContextType = {
  activeSection: Section | null;
  setActiveSection: (section: Section | null) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  editableStyles: Partial<EditableStyles>;
  updateStyle: (property: string, value: string | number) => void;
  editableContent: EditableContent | null;
  updateContent: (content: string) => void;
  applyChanges: () => void;
  cancelChanges: () => void;
  isPanelOpen: boolean;
  togglePanel: () => void;
};

const defaultContext: VisualEditorContextType = {
  activeSection: null,
  setActiveSection: () => {},
  selectedElementId: null,
  setSelectedElementId: () => {},
  isEditing: false,
  setIsEditing: () => {},
  editableStyles: {},
  updateStyle: () => {},
  editableContent: null,
  updateContent: () => {},
  applyChanges: () => {},
  cancelChanges: () => {},
  isPanelOpen: false,
  togglePanel: () => {},
};

const VisualEditorContext = createContext<VisualEditorContextType>(defaultContext);

export const useVisualEditor = () => useContext(VisualEditorContext);

export const VisualEditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableStyles, setEditableStyles] = useState<Partial<EditableStyles>>({});
  const [editableContent, setEditableContent] = useState<EditableContent | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any>(null);

  // When active section changes, initialize editable styles from section styles
  React.useEffect(() => {
    if (activeSection && activeSection.styles) {
      // Convert section styles to editable properties format
      const initialStyles: Partial<EditableStyles> = {};
      
      Object.entries(activeSection.styles).forEach(([key, value]) => {
        initialStyles[key as keyof EditableStyles] = {
          name: key,
          value: value as string | number,
          type: key === 'textAlign' ? 'alignment' : 'range',
          unit: key.includes('padding') || key.includes('margin') || key.includes('height') || key.includes('width') ? 'px' : undefined
        } as EditableProperty;
      });
      
      setEditableStyles(initialStyles);
    } else {
      // Reset if no active section
      setEditableStyles({});
    }
  }, [activeSection]);

  const updateStyle = (property: string, value: string | number) => {
    setEditableStyles(prev => ({
      ...prev,
      [property]: {
        ...prev[property as keyof EditableStyles],
        value
      }
    }));
    
    // Also update pending changes for real-time preview
    if (activeSection) {
      setPendingChanges({
        ...pendingChanges,
        styles: {
          ...(pendingChanges?.styles || {}),
          [property]: value
        }
      });
    }
  };

  const updateContent = (content: string) => {
    if (editableContent) {
      setEditableContent({
        ...editableContent,
        content
      });
      
      // Also update pending changes
      setPendingChanges({
        ...pendingChanges,
        contentEdits: {
          elementId: editableContent.elementId,
          content
        }
      });
    }
  };

  const applyChanges = () => {
    // This would update the actual DOM elements or state
    console.log("Applying changes:", { editableStyles, editableContent });
    setIsEditing(false);
    // Clear pending changes after apply
    setPendingChanges(null);
  };

  const cancelChanges = () => {
    setIsEditing(false);
    setSelectedElementId(null);
    setEditableContent(null);
    setEditableStyles({});
    // Clear pending changes on cancel
    setPendingChanges(null);
  };

  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
  };

  return (
    <VisualEditorContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedElementId,
        setSelectedElementId,
        isEditing,
        setIsEditing,
        editableStyles,
        updateStyle,
        editableContent,
        updateContent,
        applyChanges,
        cancelChanges,
        isPanelOpen,
        togglePanel
      }}
    >
      {children}
    </VisualEditorContext.Provider>
  );
};
