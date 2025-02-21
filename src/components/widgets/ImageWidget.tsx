
import { useState } from 'react';
import { ImageContent } from '@/lib/types';

interface ImageWidgetProps {
  content: ImageContent;
  onChange: (content: ImageContent) => void;
  onDelete: () => void;
}

export const ImageWidget = ({ content, onChange, onDelete }: ImageWidgetProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(content.url);
  const [alt, setAlt] = useState(content.alt);

  const handleSave = () => {
    setIsEditing(false);
    onChange({ url, alt });
  };

  return (
    <div className="group relative p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Alt text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {content.url ? (
            <img
              src={content.url}
              alt={content.alt}
              className="max-w-full h-auto rounded-md"
            />
          ) : (
            <div className="h-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              Click to add image
            </div>
          )}
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
