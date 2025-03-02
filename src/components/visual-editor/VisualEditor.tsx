
import React, { useEffect, useRef } from 'react';
import { useContentEditor, EditableElement } from '@/contexts/ContentEditorContext';
import { Badge } from '@/components/ui/badge';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Type,
  Layout,
  PaintBucket,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Array of common tailwind padding and margin classes
const paddingClasses = [
  'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12', 'p-16', 'p-20',
  'px-0', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10', 'px-12', 'px-16', 'px-20',
  'py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8', 'py-10', 'py-12', 'py-16', 'py-20',
  'pt-0', 'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pt-6', 'pt-8', 'pt-10', 'pt-12', 'pt-16', 'pt-20',
  'pr-0', 'pr-1', 'pr-2', 'pr-3', 'pr-4', 'pr-5', 'pr-6', 'pr-8', 'pr-10', 'pr-12', 'pr-16', 'pr-20',
  'pb-0', 'pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-8', 'pb-10', 'pb-12', 'pb-16', 'pb-20',
  'pl-0', 'pl-1', 'pl-2', 'pl-3', 'pl-4', 'pl-5', 'pl-6', 'pl-8', 'pl-10', 'pl-12', 'pl-16', 'pl-20',
];

const marginClasses = [
  'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'm-16', 'm-20',
  'mx-0', 'mx-1', 'mx-2', 'mx-3', 'mx-4', 'mx-5', 'mx-6', 'mx-8', 'mx-10', 'mx-12', 'mx-16', 'mx-20', 'mx-auto',
  'my-0', 'my-1', 'my-2', 'my-3', 'my-4', 'my-5', 'my-6', 'my-8', 'my-10', 'my-12', 'my-16', 'my-20',
  'mt-0', 'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6', 'mt-8', 'mt-10', 'mt-12', 'mt-16', 'mt-20',
  'mr-0', 'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-5', 'mr-6', 'mr-8', 'mr-10', 'mr-12', 'mr-16', 'mr-20',
  'mb-0', 'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6', 'mb-8', 'mb-10', 'mb-12', 'mb-16', 'mb-20',
  'ml-0', 'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6', 'ml-8', 'ml-10', 'ml-12', 'ml-16', 'ml-20', 'ml-auto',
];

const fontSizeClasses = [
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'
];

const colorClasses = [
  'text-white', 'text-black', 'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
  'text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500', 'text-indigo-500',
  'text-[#3a6ffb]', 'text-[#FF5722]'
];

const backgroundClasses = [
  'bg-transparent', 'bg-white', 'bg-black', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
  'bg-[#3a6ffb]', 'bg-[#FF5722]', 'bg-[#0A0A0A]'
];

const alignmentClasses = [
  'text-left', 'text-center', 'text-right', 'text-justify'
];

const VisualEditor = () => {
  const { 
    isEditing, 
    stopEditing, 
    saveChanges, 
    cancelChanges, 
    selectedElement, 
    updateSelectedElement 
  } = useContentEditor();
  
  const textRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (selectedElement?.type === 'text' && textRef.current) {
      textRef.current.value = selectedElement.content || '';
    }
  }, [selectedElement]);
  
  const replaceClassInElement = (classType: string, newClass: string) => {
    if (!selectedElement || !selectedElement.className) return;
    
    let classArray = selectedElement.className.split(' ');
    
    // Remove any existing classes that start with our classType
    classArray = classArray.filter(c => {
      if (classType === 'p-' || classType === 'pt-' || classType === 'pr-' || classType === 'pb-' || classType === 'pl-' || classType === 'px-' || classType === 'py-') {
        return !paddingClasses.includes(c);
      }
      if (classType === 'm-' || classType === 'mt-' || classType === 'mr-' || classType === 'mb-' || classType === 'ml-' || classType === 'mx-' || classType === 'my-') {
        return !marginClasses.includes(c);
      }
      if (classType === 'text-' && fontSizeClasses.includes(c)) {
        return false;
      }
      if (classType === 'text-' && colorClasses.includes(c)) {
        return false;
      }
      if (classType === 'bg-') {
        return !c.startsWith('bg-');
      }
      if (classType === 'text-' && alignmentClasses.includes(c)) {
        return false;
      }
      return true;
    });
    
    // Add the new class
    classArray.push(newClass);
    
    // Update the element
    updateSelectedElement({
      className: classArray.join(' ')
    });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSelectedElement({
      content: e.target.value
    });
  };
  
  const getPaddingValue = (): number => {
    if (!selectedElement || !selectedElement.className) return 0;
    
    const classArray = selectedElement.className.split(' ');
    let paddingValue = 0;
    
    for (const cls of classArray) {
      if (paddingClasses.includes(cls)) {
        // Extract the numeric value from classes like p-4
        const matches = cls.match(/\d+/);
        if (matches && matches[0]) {
          paddingValue = parseInt(matches[0]);
          break;
        }
      }
    }
    
    return paddingValue;
  };
  
  const getMarginValue = (): number => {
    if (!selectedElement || !selectedElement.className) return 0;
    
    const classArray = selectedElement.className.split(' ');
    let marginValue = 0;
    
    for (const cls of classArray) {
      if (marginClasses.includes(cls)) {
        // Extract the numeric value from classes like m-4
        const matches = cls.match(/\d+/);
        if (matches && matches[0]) {
          marginValue = parseInt(matches[0]);
          break;
        }
      }
    }
    
    return marginValue;
  };
  
  if (!isEditing) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#3a6ffb]/30 shadow-lg z-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-[#3a6ffb] text-white">
              Edit Mode
            </Badge>
            {selectedElement && (
              <Badge variant="outline" className="bg-black text-white">
                Editing: {selectedElement.type}
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={cancelChanges} size="sm" className="flex items-center">
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={saveChanges} size="sm" className="flex items-center bg-[#3a6ffb]">
              <Save className="mr-1 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>
        
        {selectedElement ? (
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="w-full grid grid-cols-5 mb-4">
              <TabsTrigger value="text" className="flex items-center">
                <Type className="mr-2 h-4 w-4" /> Text
              </TabsTrigger>
              <TabsTrigger value="padding" className="flex items-center">
                <Layout className="mr-2 h-4 w-4" /> Padding
              </TabsTrigger>
              <TabsTrigger value="margin" className="flex items-center">
                <Layout className="mr-2 h-4 w-4" /> Margin
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center">
                <PaintBucket className="mr-2 h-4 w-4" /> Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center">
                <Type className="mr-2 h-4 w-4" /> Typography
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              {selectedElement.type === 'text' && (
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Input 
                    id="content"
                    ref={textRef}
                    defaultValue={selectedElement.content}
                    onChange={handleTextChange}
                    className="border-gray-600 bg-black text-white"
                  />
                  
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => replaceClassInElement('text-align', 'text-left')}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => replaceClassInElement('text-align', 'text-center')}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => replaceClassInElement('text-align', 'text-right')}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const hasClass = selectedElement.className?.includes('font-bold');
                        if (hasClass) {
                          const newClassName = selectedElement.className?.replace('font-bold', '').trim();
                          updateSelectedElement({ className: newClassName });
                        } else {
                          updateSelectedElement({ 
                            className: `${selectedElement.className || ''} font-bold` 
                          });
                        }
                      }}
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const hasClass = selectedElement.className?.includes('italic');
                        if (hasClass) {
                          const newClassName = selectedElement.className?.replace('italic', '').trim();
                          updateSelectedElement({ className: newClassName });
                        } else {
                          updateSelectedElement({ 
                            className: `${selectedElement.className || ''} italic` 
                          });
                        }
                      }}
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const hasClass = selectedElement.className?.includes('underline');
                        if (hasClass) {
                          const newClassName = selectedElement.className?.replace('underline', '').trim();
                          updateSelectedElement({ className: newClassName });
                        } else {
                          updateSelectedElement({ 
                            className: `${selectedElement.className || ''} underline` 
                          });
                        }
                      }}
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="padding" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>All Padding (p-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[getPaddingValue()]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('p-', `p-${value}`);
                      }}
                      className="my-4"
                    />
                    <span className="text-sm text-white">{getPaddingValue()}</span>
                  </div>
                </div>
                
                <div>
                  <Label>X-Axis Padding (px-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('px-', `px-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Y-Axis Padding (py-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('py-', `py-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Top Padding (pt-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('pt-', `pt-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Bottom Padding (pb-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('pb-', `pb-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Left Padding (pl-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('pl-', `pl-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Right Padding (pr-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('pr-', `pr-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="margin" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>All Margins (m-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[getMarginValue()]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('m-', `m-${value}`);
                      }}
                      className="my-4"
                    />
                    <span className="text-sm text-white">{getMarginValue()}</span>
                  </div>
                </div>
                
                <div>
                  <Label>X-Axis Margin (mx-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        if (value === 0) {
                          replaceClassInElement('mx-', 'mx-0');
                        } else {
                          replaceClassInElement('mx-', `mx-${value}`);
                        }
                      }}
                      className="my-4"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => replaceClassInElement('mx-', 'mx-auto')}
                    className="mt-2"
                  >
                    Center (mx-auto)
                  </Button>
                </div>
                
                <div>
                  <Label>Y-Axis Margin (my-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('my-', `my-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Top Margin (mt-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('mt-', `mt-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Bottom Margin (mb-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('mb-', `mb-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Left Margin (ml-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('ml-', `ml-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Right Margin (mr-X)</Label>
                  <div className="flex items-center space-x-2">
                    <Slider 
                      defaultValue={[0]} 
                      max={20} 
                      step={1}
                      onValueChange={([value]) => {
                        replaceClassInElement('mr-', `mr-${value}`);
                      }}
                      className="my-4"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Text Color</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {colorClasses.map((color) => (
                      <Button 
                        key={color}
                        variant="outline" 
                        size="sm"
                        className={`h-8 w-full ${color} border border-gray-600`}
                        onClick={() => replaceClassInElement('text-color', color)}
                      >
                        Aa
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Background Color</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {backgroundClasses.map((bgColor) => (
                      <Button 
                        key={bgColor}
                        variant="outline" 
                        size="sm"
                        className={`h-8 w-full ${bgColor} border border-gray-600`}
                        onClick={() => replaceClassInElement('bg-', bgColor)}
                      >
                        {bgColor === 'bg-transparent' ? 'None' : ''}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Font Size</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {fontSizeClasses.map((fontSize) => (
                      <Button 
                        key={fontSize}
                        variant="outline" 
                        size="sm"
                        className={`h-8 ${fontSize === 'text-xs' ? 'text-xs' : ''} ${fontSize === 'text-sm' ? 'text-sm' : ''} border border-gray-600`}
                        onClick={() => replaceClassInElement('text-size', fontSize)}
                      >
                        {fontSize.replace('text-', '')}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Text Alignment</Label>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => replaceClassInElement('text-', 'text-left')}
                      className="flex-1"
                    >
                      <AlignLeft className="h-4 w-4 mr-2" /> Left
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => replaceClassInElement('text-', 'text-center')}
                      className="flex-1"
                    >
                      <AlignCenter className="h-4 w-4 mr-2" /> Center
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => replaceClassInElement('text-', 'text-right')}
                      className="flex-1"
                    >
                      <AlignRight className="h-4 w-4 mr-2" /> Right
                    </Button>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <Label>Font Style</Label>
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      variant="outline" 
                      className={`flex-1 ${selectedElement.className?.includes('font-normal') ? 'bg-[#3a6ffb]/20' : ''}`}
                      onClick={() => {
                        const classes = ['font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold'];
                        let classArray = selectedElement.className?.split(' ') || [];
                        classArray = classArray.filter(c => !classes.includes(c));
                        classArray.push('font-normal');
                        updateSelectedElement({
                          className: classArray.join(' ')
                        });
                      }}
                    >
                      Normal
                    </Button>
                    <Button 
                      variant="outline"
                      className={`flex-1 ${selectedElement.className?.includes('font-medium') ? 'bg-[#3a6ffb]/20' : ''}`}
                      onClick={() => {
                        const classes = ['font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold'];
                        let classArray = selectedElement.className?.split(' ') || [];
                        classArray = classArray.filter(c => !classes.includes(c));
                        classArray.push('font-medium');
                        updateSelectedElement({
                          className: classArray.join(' ')
                        });
                      }}
                    >
                      Medium
                    </Button>
                    <Button 
                      variant="outline"
                      className={`flex-1 ${selectedElement.className?.includes('font-bold') ? 'bg-[#3a6ffb]/20' : ''}`}
                      onClick={() => {
                        const classes = ['font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold'];
                        let classArray = selectedElement.className?.split(' ') || [];
                        classArray = classArray.filter(c => !classes.includes(c));
                        classArray.push('font-bold');
                        updateSelectedElement({
                          className: classArray.join(' ')
                        });
                      }}
                    >
                      Bold
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-4">
            <p className="text-white">Click on an element to edit it</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualEditor;
