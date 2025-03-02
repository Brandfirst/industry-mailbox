import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Check, X, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Type, Underline, ArrowUpDown, Sliders } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type SectionStyle = {
  marginTop?: string;
  marginBottom?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textAlign?: 'left' | 'center' | 'right';
};

export type Section = {
  id: string;
  title: string;
  component: React.ReactNode;
  style?: SectionStyle;
  editableContent?: Record<string, string>;
};

interface SectionManagerProps {
  sections: Section[];
  onReorder: (reorderedSections: Section[]) => void;
  onStyleUpdate?: (sectionId: string, style: SectionStyle) => void;
  onContentUpdate?: (sectionId: string, content: Record<string, string>) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({ 
  sections: initialSections, 
  onReorder,
  onStyleUpdate,
  onContentUpdate
}) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editTab, setEditTab] = useState<string>('layout');
  const { isAdmin } = useAuth();

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  if (!isAdmin) {
    return null;
  }

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
    setEditingSection(null);
    toast("Section changes saved successfully!");
  };

  const cancelChanges = () => {
    setSections(initialSections);
    setIsEditing(false);
    setEditingSection(null);
    toast("Changes discarded", {
      description: "Section changes were not saved"
    });
  };

  const updateSectionStyle = (sectionId: string, styleProperty: keyof SectionStyle, value: string) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const updatedStyle = { ...(section.style || {}), [styleProperty]: value };
        return { ...section, style: updatedStyle };
      }
      return section;
    }));

    if (onStyleUpdate) {
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      if (sectionIndex >= 0) {
        const currentStyle = sections[sectionIndex].style || {};
        onStyleUpdate(sectionId, { ...currentStyle, [styleProperty]: value });
      }
    }
  };

  const updateSectionContent = (sectionId: string, contentKey: string, value: string) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const updatedContent = { ...(section.editableContent || {}), [contentKey]: value };
        return { ...section, editableContent: updatedContent };
      }
      return section;
    }));

    if (onContentUpdate) {
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      if (sectionIndex >= 0) {
        const currentContent = sections[sectionIndex].editableContent || {};
        onContentUpdate(sectionId, { ...currentContent, [contentKey]: value });
      }
    }
  };

  const getSectionStyle = (sectionId: string): SectionStyle => {
    const section = sections.find(s => s.id === sectionId);
    return section?.style || {};
  };

  const getSectionContent = (sectionId: string): Record<string, string> => {
    const section = sections.find(s => s.id === sectionId);
    return section?.editableContent || {};
  };

  if (!isEditing) {
    return (
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-black border border-[#3a6ffb] text-white hover:bg-[#3a6ffb]/20 rounded-l-lg rounded-r-none px-3 py-6"
        >
          <span className="writing-mode-vertical">Edit Sections</span>
        </Button>
      </div>
    );
  }

  const currentSection = editingSection ? sections.find(s => s.id === editingSection) : null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-96 bg-[#0A0A0A] border-l border-[#3a6ffb]/30 shadow-lg z-50 flex flex-col">
      <div className="p-4 border-b border-[#3a6ffb]/30">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Section Editor</h2>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={cancelChanges} className="flex items-center">
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button size="sm" onClick={saveChanges} className="flex items-center bg-[#3a6ffb]">
              <Check className="mr-1 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        {editingSection ? (
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Editing: {currentSection?.title}
              </h3>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setEditingSection(null)}
                className="text-gray-400 hover:text-white"
              >
                Back to List
              </Button>
            </div>

            <Tabs value={editTab} onValueChange={setEditTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="layout" className="flex items-center">
                  <Sliders className="mr-2 h-4 w-4" /> Layout
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center">
                  <Type className="mr-2 h-4 w-4" /> Content
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="layout" className="space-y-4 mt-2">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Text Alignment</label>
                    <ToggleGroup 
                      type="single" 
                      value={getSectionStyle(editingSection).textAlign || 'left'}
                      onValueChange={(value) => {
                        if (value) updateSectionStyle(editingSection, 'textAlign', value);
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="left">
                        <AlignLeft className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="center">
                        <AlignCenter className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="right">
                        <AlignRight className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Margin Top</label>
                      <div className="flex space-x-2">
                        <Slider 
                          className="flex-1" 
                          defaultValue={[parseInt(getSectionStyle(editingSection).marginTop || '0')]} 
                          max={100}
                          step={1}
                          onValueChange={(values) => updateSectionStyle(editingSection, 'marginTop', `${values[0]}px`)}
                        />
                        <Input 
                          className="w-16" 
                          value={getSectionStyle(editingSection).marginTop?.replace('px', '') || '0'} 
                          onChange={(e) => updateSectionStyle(editingSection, 'marginTop', `${e.target.value}px`)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Margin Bottom</label>
                      <div className="flex space-x-2">
                        <Slider 
                          className="flex-1" 
                          defaultValue={[parseInt(getSectionStyle(editingSection).marginBottom || '0')]} 
                          max={100}
                          step={1}
                          onValueChange={(values) => updateSectionStyle(editingSection, 'marginBottom', `${values[0]}px`)}
                        />
                        <Input 
                          className="w-16" 
                          value={getSectionStyle(editingSection).marginBottom?.replace('px', '') || '0'} 
                          onChange={(e) => updateSectionStyle(editingSection, 'marginBottom', `${e.target.value}px`)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Padding Top</label>
                      <div className="flex space-x-2">
                        <Slider 
                          className="flex-1" 
                          defaultValue={[parseInt(getSectionStyle(editingSection).paddingTop || '0')]} 
                          max={100}
                          step={1}
                          onValueChange={(values) => updateSectionStyle(editingSection, 'paddingTop', `${values[0]}px`)}
                        />
                        <Input 
                          className="w-16" 
                          value={getSectionStyle(editingSection).paddingTop?.replace('px', '') || '0'} 
                          onChange={(e) => updateSectionStyle(editingSection, 'paddingTop', `${e.target.value}px`)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Padding Bottom</label>
                      <div className="flex space-x-2">
                        <Slider 
                          className="flex-1" 
                          defaultValue={[parseInt(getSectionStyle(editingSection).paddingBottom || '0')]} 
                          max={100}
                          step={1}
                          onValueChange={(values) => updateSectionStyle(editingSection, 'paddingBottom', `${values[0]}px`)}
                        />
                        <Input 
                          className="w-16" 
                          value={getSectionStyle(editingSection).paddingBottom?.replace('px', '') || '0'} 
                          onChange={(e) => updateSectionStyle(editingSection, 'paddingBottom', `${e.target.value}px`)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 mt-2">
                {currentSection?.editableContent ? (
                  Object.entries(getSectionContent(editingSection)).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <label className="text-sm text-gray-400 block capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      {value.length > 50 ? (
                        <Textarea
                          value={value}
                          onChange={(e) => updateSectionContent(editingSection, key, e.target.value)}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <Input
                          value={value}
                          onChange={(e) => updateSectionContent(editingSection, key, e.target.value)}
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    No editable content for this section.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm text-gray-400 mb-4">Rearrange sections or click to edit their content and layout</p>
            <div className="space-y-2">
              {sections.map((section, index) => (
                <div 
                  key={section.id} 
                  className="bg-black/40 border border-gray-800 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:border-[#3a6ffb]/50 transition-all"
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
                  onClick={() => setEditingSection(section.id)}
                >
                  <div className="flex items-center">
                    <ArrowUpDown className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-white font-medium">{section.title}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(index, 'up');
                      }}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        moveSection(index, 'down');
                      }}
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
        )}
      </div>
    </div>
  );
};
