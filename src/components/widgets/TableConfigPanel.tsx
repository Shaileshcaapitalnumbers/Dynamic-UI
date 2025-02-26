import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TableContent } from '@/lib/types';
import { X, Image, Type, Upload, Trash } from 'lucide-react';

interface TableConfigPanelProps {
  content: TableContent;
  rowIndex: number;
  colIndex: number;
  onChange: (content: TableContent) => void;
  onClose: () => void;
  buttonRef: React.RefObject<HTMLDivElement>;
}

export const TableConfigPanel = ({
  content,
  rowIndex,
  colIndex,
  onChange,
  onClose,
  buttonRef,
}: TableConfigPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [cellType, setCellType] = useState(content.rows[rowIndex][colIndex].type);
  const [cellContent, setCellContent] = useState(content.rows[rowIndex][colIndex].content);

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
    const newRows = [...content.rows];
    newRows[rowIndex][colIndex] = {
      type: cellType,
      content: cellContent
    };
    onChange({ ...content, rows: newRows });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCellContent(dataUrl);
      };
      reader.readAsDataURL(file);
    }
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
          <h3 className="text-lg font-semibold">Cell Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setCellType('text')}
              className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                cellType === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Type className="w-5 h-5" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setCellType('image')}
              className={`flex-1 p-2 rounded flex items-center justify-center gap-2 ${
                cellType === 'image' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <Image className="w-5 h-5" />
              <span>Image</span>
            </button>
          </div>
        </div>

        {/* Content Input */}
        {cellType === 'text' ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={cellContent}
              onChange={(e) => setCellContent(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Enter text content..."
            />
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            {cellContent ? (
              <div className="relative mb-2">
                <img
                  src={cellContent}
                  alt="Cell content"
                  className="w-full rounded-md"
                />
                <button
                  onClick={() => setCellContent('')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ) : null}
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
        )}

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