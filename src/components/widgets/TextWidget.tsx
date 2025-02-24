import { useState, useRef, useEffect } from 'react';
import { TextContent, TextStyle } from '@/lib/types';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type
} from 'lucide-react';

interface TextWidgetProps {
  content: TextContent;
  onChange: (content: TextContent) => void;
  onDelete: () => void;
  isEditing?: boolean;
  onEditingChange: (isEditing: boolean) => void;
}

export const TextWidget = ({ content, onChange, onDelete, isEditing, onEditingChange }: TextWidgetProps) => {
  const [text, setText] = useState(content.text);
  const [textStyle, setTextStyle] = useState<TextStyle>(content.style || {
    fontSize: '16px',
    color: '#000000',
    isBold: false,
    isItalic: false,
    textAlign: 'left'
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = '100%';
    }
  }, [isEditing]);

  const handleBlur = () => {
    onEditingChange(false);
    onChange({ text, style: textStyle });
  };

  const updateStyle = (updates: Partial<TextStyle>) => {
    const newStyle = { ...textStyle, ...updates };
    setTextStyle(newStyle);
    onChange({ text, style: newStyle });
  };

  const getTextStyles = () => ({
    fontSize: textStyle.fontSize,
    color: textStyle.color,
    fontWeight: textStyle.isBold ? 'bold' : 'normal',
    fontStyle: textStyle.isItalic ? 'italic' : 'normal',
    textAlign: textStyle.textAlign,
  });

  const renderFormatControls = () => (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white shadow-lg rounded-lg p-2 z-10">
      <div className="flex items-center gap-2 border-r pr-2">
        <input
          type="number"
          min="8"
          max="72"
          value={parseInt(textStyle.fontSize || '16')}
          onChange={(e) => updateStyle({ fontSize: `${e.target.value}px` })}
          className="w-16 p-1 border rounded"
        />
        <input
          type="color"
          value={textStyle.color}
          onChange={(e) => updateStyle({ color: e.target.value })}
          className="w-8 h-8 p-1 border rounded cursor-pointer"
        />
      </div>
      <div className="flex items-center gap-2 border-r pr-2">
        <button
          onClick={() => updateStyle({ isBold: !textStyle.isBold })}
          className={`p-1 rounded hover:bg-gray-100 ${textStyle.isBold ? 'bg-gray-200' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => updateStyle({ isItalic: !textStyle.isItalic })}
          className={`p-1 rounded hover:bg-gray-100 ${textStyle.isItalic ? 'bg-gray-200' : ''}`}
        >
          <Italic size={16} />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateStyle({ textAlign: 'left' })}
          className={`p-1 rounded hover:bg-gray-100 ${textStyle.textAlign === 'left' ? 'bg-gray-200' : ''}`}
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => updateStyle({ textAlign: 'center' })}
          className={`p-1 rounded hover:bg-gray-100 ${textStyle.textAlign === 'center' ? 'bg-gray-200' : ''}`}
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => updateStyle({ textAlign: 'right' })}
          className={`p-1 rounded hover:bg-gray-100 ${textStyle.textAlign === 'right' ? 'bg-gray-200' : ''}`}
        >
          <AlignRight size={16} />
        </button>
      </div>
      <div className="border-l pl-2 flex gap-2">
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
  );

  return (
    <div className="group relative h-full flex flex-col">
      {isEditing ? (
        <textarea
          ref={textareaRef}
          className="w-full h-full p-4 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          style={{ ...getTextStyles(), height: '100%', minHeight: '100%' }}
        />
      ) : (
        <div className="relative flex-1 h-full p-4">
          <div 
            className="cursor-text whitespace-pre-wrap h-full"
            style={getTextStyles()}
          >
            {content.text || 'Double-click to edit text'}
          </div>
          {renderFormatControls()}
        </div>
      )}
    </div>
  );
};
