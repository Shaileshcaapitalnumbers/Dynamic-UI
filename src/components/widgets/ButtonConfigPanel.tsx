import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ButtonContent, WidgetStyle } from '@/lib/types';
import { X } from 'lucide-react';
import { useConfigPanelPosition } from '@/hooks/useConfigPanelPosition';

interface ButtonConfigPanelProps {
  content: ButtonContent;
  style?: Partial<WidgetStyle>;
  onChange: (content: ButtonContent) => void;
  onStyleChange?: (style: Partial<WidgetStyle>) => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLDivElement>;
  onRemove: () => void;
}

export const ButtonConfigPanel = ({
  content,
  style,
  onChange,
  onStyleChange,
  onClose,
  onRemove,
  buttonRef,
}: ButtonConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { position, isVisible } = useConfigPanelPosition(buttonRef, panelRef);
  const [showWarning, setShowWarning] = useState(false);
  const handleRemove = () => {
    onRemove();
    onClose();
  };

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (!content.text.trim()) {
            handleRemove()
          }
        }
      }}
    >
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Empty button Text Warning</h3>
            <p className="text-gray-600 mb-6">
              The button text field is empty. If you proceed, the widget will be removed.
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
          <h3 className="text-lg font-semibold">Button Settings</h3>
          <button 
            // onClick={onClose}
            onClick={() => !content.text.trim() ? setShowWarning(true) : onClose()}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

        <div className="flex gap-3">
          <button
              onClick={() => !content.text.trim() ? setShowWarning(true) : onClose()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
              onClick={() => !content.text.trim() ? setShowWarning(true) : onClose()}
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
