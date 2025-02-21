
import { useState } from 'react';
import { ButtonContent } from '@/lib/types';

interface ButtonWidgetProps {
  content: ButtonContent;
  onChange: (content: ButtonContent) => void;
  onDelete: () => void;
}

export const ButtonWidget = ({ content, onChange, onDelete }: ButtonWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content.text || 'Button');

  const handleBlur = () => {
    setIsEditing(false);
    onChange({ ...content, text });
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  return (
    <div className="group relative p-5">
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div className="relative">
          <button
            onDoubleClick={handleDoubleClick}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {text}
          </button>
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
