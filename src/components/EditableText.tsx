
import React, { useState, useRef, useEffect } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { Pencil } from 'lucide-react';

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span';
}

const EditableText: React.FC<EditableTextProps> = ({ 
  text, 
  onSave, 
  className = '', 
  as = 'p' 
}) => {
  const { isEditMode } = useEditMode();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      if (editedText !== text) {
        onSave(editedText);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditedText(text);
      setIsEditing(false);
    }
  };

  const Component = as;

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} p-1 w-full min-h-[1.5em] bg-black border border-[#FF5722] text-white rounded resize-y transition-all`}
        style={{ minHeight: '1.5em', maxHeight: '20em' }}
      />
    );
  }

  return (
    <Component 
      onClick={handleClick} 
      className={`${className} ${isEditMode ? 'cursor-pointer relative group' : ''}`}
    >
      {text}
      {isEditMode && (
        <span className="absolute opacity-0 group-hover:opacity-100 -right-6 top-1/2 transform -translate-y-1/2">
          <Pencil className="h-4 w-4 text-[#FF5722]" />
        </span>
      )}
    </Component>
  );
};

export default EditableText;
