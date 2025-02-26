import { useRef, useState } from 'react';
import { ButtonContent } from '@/lib/types';
import { Edit, Trash } from 'lucide-react';
import { ButtonConfigPanel } from './ButtonConfigPanel';

interface ButtonWidgetProps {
  content: ButtonContent;
  onChange: (content: ButtonContent) => void;
  onDelete: () => void;
  style?: any;
  onStyleChange?: (style: any) => void;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export const ButtonWidget = ({ 
  content, 
  onChange, 
  onDelete,
  style, 
  onStyleChange,
  isEditing,
  onEditingChange 
}: ButtonWidgetProps) => {
  const [showConfig, setShowConfig] = useState(isEditing?true:false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const mouseDownTimeRef = useRef(0);

  const handleMouseDown = () => {
    mouseDownTimeRef.current = Date.now();
  };

  const handleClick = (e: React.MouseEvent) => {
    // If the mouse was down for more than 200ms, consider it a drag
    const mouseUpTime = Date.now();
    const mouseDownDuration = mouseUpTime - mouseDownTimeRef.current;
    
    if (mouseDownDuration < 200 && content.url) {
      window.open(content.url, '_blank');
    }
  };

  return (
    <div ref={buttonRef} className="relative w-full h-full group">
      {/* Main Button */}
      <button
        className="w-full h-full rounded-md flex items-center justify-center"
        style={{
          backgroundColor: style?.backgroundColor || '#3b82f6',
          color: style?.textColor || '#ffffff',
          border: `${style?.borderWidth || '1px'} solid ${style?.borderColor || 'transparent'}`,
          borderRadius: style?.borderRadius || '0.375rem',
          padding: style?.padding || '0.5rem 1rem',
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <span>{content.text || 'Button'}</span>
      </button>

      {/* Edit/Delete Controls */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          onClick={() => setShowConfig(true)}
          className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          title="Edit button"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          title="Delete button"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <ButtonConfigPanel
          content={content}
          style={style}
          onChange={onChange}
          onStyleChange={onStyleChange}
          onClose={() => setShowConfig(false)}
          buttonRef={buttonRef}
        />
      )}
    </div>
  );
};
