
import React, { useEffect } from 'react';
import { useContentEditor, EditableElement } from '@/contexts/ContentEditorContext';
import VisualEditor from './VisualEditor';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { Edit } from 'lucide-react';

interface ContentEditorProps {
  children: React.ReactNode;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ children }) => {
  const { isEditing, startEditing, selectElement } = useContentEditor();
  const { isAdmin } = useAuth();
  
  // Initialize click handler when editing is active
  useEffect(() => {
    if (!isEditing) return;
    
    const handleElementClick = (e: MouseEvent) => {
      // Prevent default behaviors
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      
      // Look for the closest editable parent if the clicked element isn't directly editable
      let editableElement = target;
      
      if (!target.hasAttribute('data-editable')) {
        const closestEditable = target.closest('[data-editable]');
        if (closestEditable) {
          editableElement = closestEditable as HTMLElement;
        } else {
          // Deselect if clicking outside of editable elements
          selectElement(null);
          document.querySelectorAll('[data-editable]').forEach(el => {
            el.classList.remove('ring-2', 'ring-[#3a6ffb]', 'ring-offset-2', 'ring-offset-black');
          });
          return;
        }
      }
      
      // Only select elements with data-editable attribute
      if (editableElement.hasAttribute('data-editable')) {
        const editableType = editableElement.getAttribute('data-editable-type') || 'text';
        const editableId = editableElement.getAttribute('data-editable-id') || crypto.randomUUID();
        
        // Get current content for text elements
        let content = '';
        if (editableType === 'text') {
          content = editableElement.textContent || '';
        }
        
        const editableData: EditableElement = {
          id: editableId,
          type: editableType as any,
          content,
          className: editableElement.className,
          element: editableElement,
          originalClassName: editableElement.className,
        };
        
        selectElement(editableData);
        
        // Add a visual indicator that the element is selected
        document.querySelectorAll('[data-editable]').forEach(el => {
          el.classList.remove('ring-2', 'ring-[#3a6ffb]', 'ring-offset-2', 'ring-offset-black');
        });
        
        editableElement.classList.add('ring-2', 'ring-[#3a6ffb]', 'ring-offset-2', 'ring-offset-black');
      }
    };
    
    // Add click event listener to the document
    document.addEventListener('click', handleElementClick, { capture: true });
    
    // Add hover effect for editable elements
    const addHoverStyles = () => {
      document.querySelectorAll('[data-editable]').forEach(el => {
        el.classList.add('cursor-pointer', 'transition-all', 'duration-200');
        
        el.addEventListener('mouseover', () => {
          if (!el.classList.contains('ring-2')) {
            el.classList.add('ring-1', 'ring-blue-400', 'ring-opacity-50');
          }
        });
        
        el.addEventListener('mouseout', () => {
          if (!el.classList.contains('ring-2')) {
            el.classList.remove('ring-1', 'ring-blue-400', 'ring-opacity-50');
          }
        });
      });
    };
    
    addHoverStyles();
    
    // Clean up when editing is turned off
    return () => {
      document.removeEventListener('click', handleElementClick, { capture: true });
      document.querySelectorAll('[data-editable]').forEach(el => {
        el.classList.remove(
          'ring-2', 'ring-[#3a6ffb]', 'ring-offset-2', 'ring-offset-black',
          'cursor-pointer', 'transition-all', 'duration-200',
          'ring-1', 'ring-blue-400', 'ring-opacity-50'
        );
      });
    };
  }, [isEditing, selectElement]);
  
  if (!isAdmin) {
    return <>{children}</>;
  }
  
  return (
    <>
      {children}
      
      {!isEditing && (
        <div className="fixed right-5 bottom-5 z-50">
          <Button 
            onClick={startEditing}
            className="bg-[#3a6ffb] text-white hover:bg-[#3a6ffb]/90"
          >
            <Edit className="mr-2 h-4 w-4" /> Visual Editor
          </Button>
        </div>
      )}
      
      <VisualEditor />
    </>
  );
};

export default ContentEditor;
