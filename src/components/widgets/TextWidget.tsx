
import { useState } from 'react';
import { TextContent } from '@/lib/types';

interface TextWidgetProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  onDelete: () => void;
}

export const TextWidget = ({ content, onChange, onDelete }: TextWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content.text);

  const handleBlur = () => {
    setIsEditing(false);
    onChange({ text });
  };

  return (
    <div className="group relative p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {isEditing ? (
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-text">
          {content.text || 'Click to edit text'}
        </div>
      )}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className="p-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};
