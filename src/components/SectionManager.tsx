
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Check, X, Edit, Move, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import VisualEditor from './VisualEditor';

export type SectionStyles = {
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  height?: number | string;
  width?: number | string;
  textAlign?: 'left' | 'center' | 'right';
};

export type Section = {
  id: string;
  title: string;
  component: React.ReactNode;
  styles?: SectionStyles;
};

interface SectionManagerProps {
  sections: Section[];
  onReorder: (reorderedSections: Section[]) => void;
  onUpdate?: (sectionId: string, updates: any) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({ 
  sections: initialSections, 
  onReorder,
  onUpdate 
}) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isEditing, setIsEditing] = useState(false);
  const { isAdmin } = useAuth();
  const { 
    setActiveSection, 
    activeSection, 
    isPanelOpen, 
    togglePanel 
  } = useVisualEditor();

  // If not admin, don't render anything
  if (!isAdmin) {
    return null;
  }

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < sections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    setSections(newSections);
  };

  const saveChanges = () => {
    onReorder(sections);
    setIsEditing(false);
    toast("Section order updated successfully!");
  };

  const cancelChanges = () => {
    setSections(initialSections);
    setIsEditing(false);
    toast("Changes discarded", {
      description: "Section order was not changed"
    });
  };

  const handleSectionEdit = (section: Section) => {
    setActiveSection(section);
    if (!isPanelOpen) {
      togglePanel();
    }
  };

  const handleSectionUpdate = (sectionId: string, updates: any) => {
    if (onUpdate) {
      onUpdate(sectionId, updates);
    }
    
    // Also update local state if needed
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          styles: {
            ...section.styles,
            ...updates.styles
          }
        };
      }
      return section;
    });
    
    setSections(updatedSections);
  };

  if (!isEditing) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-black border border-[#FF5722] text-white hover:bg-[#FF5722]/20 rounded-l-lg rounded-r-none px-3 py-6"
        >
          <span className="writing-mode-vertical flex items-center">
            <Move className="h-4 w-4 mr-1" rotate={90} /> Rearrange
          </span>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#0A0A0A] border-l border-[#FF5722]/30 shadow-lg z-50 flex flex-col">
        <div className="p-4 border-b border-[#FF5722]/30">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Rearrange Sections</h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={cancelChanges} className="flex items-center">
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
              <Button size="sm" onClick={saveChanges} className="flex items-center bg-[#FF5722]">
                <Check className="mr-1 h-4 w-4" /> Save
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4">
          <p className="text-sm text-gray-400 mb-4">Drag sections up and down to reorder them or edit their content</p>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                className={`
                  bg-black/40 border border-gray-800 p-3 rounded-lg flex justify-between items-center
                  ${activeSection?.id === section.id ? 'border-[#FF5722] bg-[#FF5722]/10' : ''}
                `}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                  if (draggedIndex !== index) {
                    const newSections = [...sections];
                    const [movedItem] = newSections.splice(draggedIndex, 1);
                    newSections.splice(index, 0, movedItem);
                    setSections(newSections);
                  }
                }}
              >
                <span className="text-white font-medium">{section.title}</span>
                <div className="flex space-x-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleSectionEdit(section)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-[#FF5722]/20"
                    title="Edit section content"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === sections.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <VisualEditor 
        sections={sections}
        onSectionUpdate={handleSectionUpdate}
      />
    </>
  );
};
