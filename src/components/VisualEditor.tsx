
import React, { useEffect } from 'react';
import { useVisualEditor } from '@/contexts/VisualEditorContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { X, Save, AlignLeft, AlignCenter, AlignRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Section } from './SectionManager';

interface VisualEditorProps {
  sections: Section[];
  onSectionUpdate: (sectionId: string, updates: any) => void;
}

const VisualEditor: React.FC<VisualEditorProps> = ({ sections, onSectionUpdate }) => {
  const { 
    activeSection, 
    editableStyles, 
    updateStyle, 
    editableContent, 
    updateContent, 
    applyChanges, 
    cancelChanges,
    isPanelOpen,
    togglePanel
  } = useVisualEditor();

  const handleStyleChange = (property: string, value: string | number) => {
    updateStyle(property, value);
    
    if (activeSection) {
      // Apply style changes in real-time
      const styleUpdates = {
        styles: {
          ...activeSection.styles,
          [property]: value
        }
      };
      onSectionUpdate(activeSection.id, styleUpdates);
    }
  };

  const handleContentChange = (content: string) => {
    updateContent(content);
    
    if (activeSection && editableContent) {
      // This is a simplified approach; in a real app, you'd have a more sophisticated
      // way to update specific content within a section
      const contentUpdates = {
        contentEdits: {
          elementId: editableContent.elementId,
          content: content
        }
      };
      onSectionUpdate(activeSection.id, contentUpdates);
    }
  };

  if (!isPanelOpen) {
    return (
      <Button 
        onClick={togglePanel}
        className="fixed right-4 bottom-4 z-50 bg-[#FF5722] hover:bg-[#E64A19]"
      >
        Edit Section
      </Button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-[#0A0A0A] border-l border-[#FF5722]/30 shadow-lg z-50 flex flex-col overflow-auto">
      <div className="p-4 border-b border-[#FF5722]/30 flex justify-between items-center sticky top-0 bg-[#0A0A0A] z-10">
        <h2 className="text-xl font-bold text-white">Edit Section</h2>
        <Button size="sm" variant="ghost" onClick={togglePanel} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {activeSection ? (
        <div className="p-4 overflow-y-auto flex-1">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">{activeSection.title}</h3>
            <p className="text-sm text-gray-400">Selected section: {activeSection.id}</p>
          </div>

          <div className="space-y-6">
            {/* Layout Settings */}
            <div>
              <h4 className="text-md font-semibold text-white mb-4 border-b border-[#FF5722]/20 pb-2">Layout Settings</h4>
              
              {/* Min Height - Changed from Height to Min Height for better layout */}
              <div className="mb-4">
                <Label htmlFor="height" className="text-sm text-gray-300 mb-1 block">Min Height</Label>
                <div className="flex gap-2 items-center">
                  <Slider
                    id="height"
                    defaultValue={[activeSection.styles?.height as number || 400]}
                    min={200}
                    max={1000}
                    step={10}
                    value={[editableStyles.height?.value as number || activeSection.styles?.height as number || 400]}
                    onValueChange={(vals) => handleStyleChange('height', vals[0])}
                    className="flex-1"
                  />
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={editableStyles.height?.value || activeSection.styles?.height || 400}
                      onChange={(e) => handleStyleChange('height', parseInt(e.target.value) || 400)}
                      className="w-16 h-8 bg-black border-gray-700 text-white"
                    />
                    <span className="ml-1 text-gray-400">px</span>
                  </div>
                </div>
              </div>

              {/* Padding Top */}
              <div className="mb-4">
                <Label htmlFor="paddingTop" className="text-sm text-gray-300 mb-1 block">Padding Top</Label>
                <div className="flex gap-2 items-center">
                  <Slider
                    id="paddingTop"
                    defaultValue={[activeSection.styles?.paddingTop as number || 64]}
                    min={0}
                    max={200}
                    step={4}
                    value={[editableStyles.paddingTop?.value as number || activeSection.styles?.paddingTop as number || 64]}
                    onValueChange={(vals) => handleStyleChange('paddingTop', vals[0])}
                    className="flex-1"
                  />
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={editableStyles.paddingTop?.value || activeSection.styles?.paddingTop || 64}
                      onChange={(e) => handleStyleChange('paddingTop', parseInt(e.target.value) || 0)}
                      className="w-16 h-8 bg-black border-gray-700 text-white"
                    />
                    <span className="ml-1 text-gray-400">px</span>
                  </div>
                </div>
              </div>

              {/* Padding Bottom */}
              <div className="mb-4">
                <Label htmlFor="paddingBottom" className="text-sm text-gray-300 mb-1 block">Padding Bottom</Label>
                <div className="flex gap-2 items-center">
                  <Slider
                    id="paddingBottom"
                    defaultValue={[activeSection.styles?.paddingBottom as number || 96]}
                    min={0}
                    max={200}
                    step={4}
                    value={[editableStyles.paddingBottom?.value as number || activeSection.styles?.paddingBottom as number || 96]}
                    onValueChange={(vals) => handleStyleChange('paddingBottom', vals[0])}
                    className="flex-1"
                  />
                  <div className="flex items-center">
                    <Input
                      type="number"
                      value={editableStyles.paddingBottom?.value || activeSection.styles?.paddingBottom || 96}
                      onChange={(e) => handleStyleChange('paddingBottom', parseInt(e.target.value) || 0)}
                      className="w-16 h-8 bg-black border-gray-700 text-white"
                    />
                    <span className="ml-1 text-gray-400">px</span>
                  </div>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="mb-4">
                <Label htmlFor="textAlign" className="text-sm text-gray-300 mb-1 block">Text Alignment</Label>
                <div className="flex gap-2 items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStyleChange('textAlign', 'left')}
                    className={`${(editableStyles.textAlign?.value === 'left' || activeSection.styles?.textAlign === 'left') ? 'bg-[#FF5722]/20 border-[#FF5722]' : 'bg-black/40'}`}
                  >
                    <AlignLeft size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStyleChange('textAlign', 'center')}
                    className={`${(editableStyles.textAlign?.value === 'center' || activeSection.styles?.textAlign === 'center') ? 'bg-[#FF5722]/20 border-[#FF5722]' : 'bg-black/40'}`}
                  >
                    <AlignCenter size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleStyleChange('textAlign', 'right')}
                    className={`${(editableStyles.textAlign?.value === 'right' || activeSection.styles?.textAlign === 'right') ? 'bg-[#FF5722]/20 border-[#FF5722]' : 'bg-black/40'}`}
                  >
                    <AlignRight size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Settings */}
            {editableContent && (
              <div>
                <h4 className="text-md font-semibold text-white mb-4 border-b border-[#FF5722]/20 pb-2">Content Settings</h4>
                <div className="mb-4">
                  <Label htmlFor="content" className="text-sm text-gray-300 mb-1 block">Edit Text</Label>
                  <textarea
                    id="content"
                    value={editableContent.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="w-full h-32 bg-black border border-gray-700 rounded-md p-2 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex space-x-2">
            <Button variant="default" onClick={applyChanges} className="flex-1 bg-[#FF5722] hover:bg-[#E64A19]">
              <Save className="mr-1 h-4 w-4" /> Save Changes
            </Button>
            <Button variant="outline" onClick={cancelChanges} className="flex-1">
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-400">
          Select a section to edit its properties
        </div>
      )}
    </div>
  );
};

export default VisualEditor;
