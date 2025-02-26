import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ImageContent, WidgetStyle } from '@/lib/types';
import { X, Upload } from 'lucide-react';
import { useConfigPanelPosition } from '@/hooks/useConfigPanelPosition';

interface ImageConfigPanelProps {
  content: ImageContent;
  style?: Partial<WidgetStyle>;
  onChange: (content: ImageContent) => void;
  onStyleChange?: (style: Partial<WidgetStyle>) => void;
  onClose: () => void;
  onRemove: () => void;
  buttonRef: React.RefObject<HTMLDivElement>;
}

export const ImageConfigPanel = ({
  content,
  onChange,
  onClose,
  onRemove,
  buttonRef,
}: ImageConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState(content.url || '');
  const { position, isVisible } = useConfigPanelPosition(buttonRef, panelRef);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setImageUrl(dataUrl);
        onChange({ ...content, url: dataUrl, alt: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!imageUrl.trim()) {
      onRemove();
    } else {
      onChange({ ...content, url: imageUrl });
    }
    onClose();
  };

  return createPortal(
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
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
          <h3 className="text-lg font-semibold">Image Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
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
