
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
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      
      // Only select elements with data-editable attribute
      if (target.hasAttribute('data-editable')) {
        const editableType = target.getAttribute('data-editable-type') || 'text';
        const editableId = target.getAttribute('data-editable-id') || crypto.randomUUID();
        
        // Get current content for text elements
        let content = '';
        if (editableType === 'text') {
          content = target.textContent || '';
        }
        
        const editableElement: EditableElement = {
          id: editableId,
          type: editableType as any,
          content,
          className: target.className,
          element: target,
          originalClassName: target.className,
        };
        
        selectElement(editableElement);
        
        // Add a visual indicator that the element is selected
        document.querySelectorAll('[data-editable]').forEach(el => {
          el.classList.remove('ring-2', 'ring-[#3a6ffb]', 'ring-offset-2');
        });
        
        target.classList.add('ring-2', 'ring-[#3a6ffb]', 'ring-offset-2');
      } else {
        // Deselect if clicking outside of editable elements
        selectElement(null);
        document.querySelectorAll('[data-editable]').forEach(el => {
          el.classList.remove('ring-2', 'ring-[#3a6ffb]', 'ring-offset-2');
        });
      }
    };
    
    // Add click event listener to the document
    document.addEventListener('click', handleElementClick);
    
    // Clean up when editing is turned off
    return () => {
      document.removeEventListener('click', handleElementClick);
      document.querySelectorAll('[data-editable]').forEach(el => {
        el.classList.remove('ring-2', 'ring-[#3a6ffb]', 'ring-offset-2');
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
