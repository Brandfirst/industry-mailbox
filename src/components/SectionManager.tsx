
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export type Section = {
  id: string;
  title: string;
  component: React.ReactNode;
};

interface SectionManagerProps {
  sections: Section[];
  onReorder: (reorderedSections: Section[]) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({ sections: initialSections, onReorder }) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isEditing, setIsEditing] = useState(false);

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

  if (!isEditing) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-black border border-[#3a6ffb] text-white hover:bg-[#3a6ffb]/20"
        >
          Rearrange Sections
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-[#0A0A0A] border border-[#3a6ffb]/30 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Rearrange Sections</h2>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={cancelChanges} className="flex items-center">
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button size="sm" onClick={saveChanges} className="flex items-center bg-[#3a6ffb]">
              <Check className="mr-1 h-4 w-4" /> Save
            </Button>
          </div>
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className="bg-black/40 border border-gray-800 p-3 rounded-lg flex justify-between items-center"
            >
              <span className="text-white font-medium">{section.title}</span>
              <div className="flex space-x-1">
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
  );
};
