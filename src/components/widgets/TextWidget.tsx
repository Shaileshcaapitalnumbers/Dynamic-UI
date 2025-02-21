
import { useState, useRef, useEffect } from 'react';
import { TextContent } from '@/lib/types';

interface TextWidgetProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  onDelete: () => void;
}

export const TextWidget = ({ content, onChange, onDelete }: TextWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content.text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text, isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange({ text });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div className="group relative p-5">
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div className="relative">
          <div 
            onDoubleClick={handleDoubleClick}
            className="cursor-text whitespace-pre-wrap"
          >
            {content.text || 'Double-click to edit text'}
          </div>
          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-500 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
