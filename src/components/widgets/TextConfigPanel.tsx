import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TextContent, WidgetStyle } from '@/lib/types';
import { X, AlignLeft, AlignCenter, AlignRight, Bold, Type } from 'lucide-react';

interface TextConfigPanelProps {
  content: TextContent;
  style?: Partial<WidgetStyle>;
  onChange: (content: TextContent) => void;
  onStyleChange?: (style: Partial<WidgetStyle>) => void;
  onClose: () => void;
  onRemove: () => void;
  buttonRef: React.RefObject<HTMLDivElement>;
}

export const TextConfigPanel = ({
  content,
  style = {},
  onChange,
  onStyleChange,
  onClose,
  onRemove,
  buttonRef,
}: TextConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [text, setText] = useState(content.text || '');
  const [isVisible, setIsVisible] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [textAlign, setTextAlign] = useState(style.textAlign || 'left');
  const [fontSize, setFontSize] = useState(style.fontSize || '16px');
  const [isBold, setIsBold] = useState(style.fontWeight === 'bold');

  useEffect(() => {
    // Set initial position off-screen
    setPosition({ left: -9999, top: -9999 });
    
    // Add small delay to allow for initial render
    const timer = setTimeout(() => {
      if (!buttonRef.current || !panelRef.current) return;

      const buttonRect = buttonRef.current.getBoundingClientRect();
      const panelRect = panelRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // Check if there's space on the right
      const spaceOnRight = viewportWidth - buttonRect.right > panelRect.width + 20;
      
      // Position the panel
      if (spaceOnRight) {
        setPosition({
          left: buttonRect.right + 16,
          top: buttonRect.top,
        });
      } else {
        setPosition({
          left: buttonRect.left - panelRect.width - 16,
          top: buttonRect.top,
        });
      }
      
      // Show panel after positioning
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [buttonRef]);

  const handleSave = () => {
    if (!text.trim()) {
      setShowWarning(true);
      return;
    }
    
    onChange({ text });
    if (onStyleChange) {
      onStyleChange({
        ...style,
        textAlign,
        fontSize,
        fontWeight: isBold ? 'bold' : 'normal'
      });
    }
    onClose();
  };

  const handleRemove = () => {
    onRemove();
    onClose();
  };

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (!text.trim()) {
            setShowWarning(true);
          } else {
            onClose();
          }
        }
      }}
    >
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Empty Text Warning</h3>
            <p className="text-gray-600 mb-6">
              The text field is empty. If you proceed, the widget will be removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove Widget
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        ref={panelRef}
        className={`absolute bg-white rounded-lg shadow-lg w-96 p-6 transition-transform duration-200 ${isVisible ? 'translate-y-0' : 'translate-y-2'}`}
        style={{
          left: position.left,
          top: position.top,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Text Settings</h3>
          <button 
            onClick={() => !text.trim() ? setShowWarning(true) : onClose()}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Enter your text here..."
          />
        </div>

        {/* Formatting Options */}
        <div className="space-y-4 mb-6">
          {/* Text Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alignment
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTextAlign('left')}
                className={`p-2 rounded ${textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Align Left"
              >
                <AlignLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTextAlign('center')}
                className={`p-2 rounded ${textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Align Center"
              >
                <AlignCenter className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTextAlign('right')}
                className={`p-2 rounded ${textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Align Right"
              >
                <AlignRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="12"
                max="32"
                value={parseInt(fontSize)}
                onChange={(e) => setFontSize(`${e.target.value}px`)}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 min-w-[3ch]">
                {parseInt(fontSize)}
              </span>
            </div>
          </div>

          {/* Bold Toggle */}
          <div>
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-2 rounded ${isBold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title="Toggle Bold"
            >
              <Bold className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => !text.trim() ? setShowWarning(true) : onClose()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}; 