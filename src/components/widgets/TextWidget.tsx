import { useRef, useState, useEffect } from 'react';
import { TextContent } from '@/lib/types';
import { Edit, Trash } from 'lucide-react';
import { TextConfigPanel } from './TextConfigPanel';

interface TextWidgetProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  onDelete: () => void;
  style?: any;
  onStyleChange?: (style: any) => void;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export const TextWidget = ({
  content,
  onChange,
  onDelete,
  style = {},
  onStyleChange,
  isEditing = false,
  onEditingChange
}: TextWidgetProps) => {
  const [showConfig, setShowConfig] = useState(isEditing);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-open config panel for new widgets
  useEffect(() => {
    if (isEditing && !content.text) {
      setShowConfig(true);
    }
  }, [isEditing, content.text]);

  // Update parent about editing state
  useEffect(() => {
    if (onEditingChange) {
      onEditingChange(showConfig);
    }
  }, [showConfig]);

  return (
    <div ref={containerRef} className="relative w-full h-full group">
      {/* Text Display */}
      <div 
        className="w-full h-full p-4 bg-white rounded-lg"
        style={{
          textAlign: style.textAlign || 'left',
          fontSize: style.fontSize || '16px',
          fontWeight: style.fontWeight || 'normal'
        }}
      >
        {content.text ? (
          <p>{content.text}</p>
        ) : (
          <p className="text-gray-400">Enter your text here...</p>
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 border border-gray-300">
        <button
          onClick={() => setShowConfig(true)}
          className="p-1.5 bg-white shadow-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors "
          title="Edit text"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete()}
          className="p-1.5 bg-white shadow-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors "
          title="Edit text"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <TextConfigPanel
          content={content}
          style={style}
          onChange={onChange}
          onStyleChange={onStyleChange}
          onClose={() => setShowConfig(false)}
          onRemove={onDelete}
          buttonRef={containerRef}
        />
      )}
    </div>
  );
};
