import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ButtonContent, WidgetStyle } from '@/lib/types';
import { X } from 'lucide-react';

interface ButtonConfigPanelProps {
  content: ButtonContent;
  style?: Partial<WidgetStyle>;
  onChange: (content: ButtonContent) => void;
  onStyleChange?: (style: Partial<WidgetStyle>) => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLDivElement>;
}

export const ButtonConfigPanel = ({
  content,
  style,
  onChange,
  onStyleChange,
  onClose,
  buttonRef,
}: ButtonConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!buttonRef.current || !panelRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Check if there's space on the right
    const spaceOnRight = viewportWidth - buttonRect.right > panelRect.width + 20;
    
    // Position the panel
    if (spaceOnRight) {
      // Place on the right
      setPosition({
        left: buttonRect.right + 16,
        top: buttonRect.top,
      });
    } else {
      // Place on the left
      setPosition({
        left: buttonRect.left - panelRect.width - 16,
        top: buttonRect.top,
      });
    }
  }, [buttonRef]);

  return createPortal(
    <div 
      className="fixed inset-0 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className="absolute bg-white rounded-lg shadow-lg w-96 p-6"
        style={{
          left: position.left,
          top: position.top,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Button Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Button Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Text
          </label>
          <input
            type="text"
            value={content.text || ''}
            onChange={(e) => onChange({ ...content, text: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Enter button text"
          />
        </div>

        {/* URL Link */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Link
          </label>
          <input
            type="url"
            value={content.url || ''}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="https://example.com"
          />
        </div>

        {/* Background Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style?.backgroundColor || '#3b82f6'}
              onChange={(e) => onStyleChange?.({ ...style, backgroundColor: e.target.value })}
              className="w-8 h-8 p-0 border-0 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={style?.backgroundColor || '#3b82f6'}
              onChange={(e) => onStyleChange?.({ ...style, backgroundColor: e.target.value })}
              className="flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
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