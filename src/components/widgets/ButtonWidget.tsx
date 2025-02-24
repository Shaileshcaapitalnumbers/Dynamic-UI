import { useState } from 'react';
import { ButtonContent } from '@/lib/types';

interface ButtonWidgetProps {
  content: ButtonContent;
  onChange: (content: ButtonContent) => void;
  onDelete: () => void;
  isEditing?: boolean;
  onEditingChange: (isEditing: boolean) => void;
}

export const ButtonWidget = ({ content, onChange, onDelete, isEditing, onEditingChange }: ButtonWidgetProps) => {
  const [text, setText] = useState(content.text || 'Button');

  const handleBlur = () => {
    onEditingChange(false);
    onChange({ ...content, text });
  };

  return (
    <div className="group relative h-full flex flex-col">
      {isEditing ? (
        <div className="flex-1 h-full p-4 flex items-center justify-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      ) : (
        <div className="relative flex-1 h-full p-4 flex items-center justify-center">
          <button
            className="w-full h-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
            onClick={() => onEditingChange(true)}
          >
            {text}
          </button>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={() => onEditingChange(true)}
              className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
