
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

  return (
    <div className="group relative p-4">
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
        <button
          onClick={() => setIsEditing(true)}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {text}
        </button>
      )}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
};
