import { useRef, useState, useEffect } from 'react';
import { ImageContent } from '@/lib/types';
import { Edit } from 'lucide-react';
import { ImageConfigPanel } from './ImageConfigPanel';

interface ImageWidgetProps {
  content: ImageContent;
  onChange: (content: ImageContent) => void;
  onDelete: () => void;
  style?: any;
  onStyleChange?: (style: any) => void;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export const ImageWidget = ({
  content,
  onChange,
  onDelete,
  style,
  onStyleChange,
  isEditing,
  onEditingChange
}: ImageWidgetProps) => {
  const [showConfig, setShowConfig] = useState(isEditing && !content.url);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Handle image load to get dimensions
  useEffect(() => {
    if (content.url && imageRef.current) {
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: img.width,
          height: img.height
        });
        
        // Update widget size based on image dimensions
        if (onStyleChange) {
          const containerWidth = containerRef.current?.offsetWidth || 300;
          const scale = containerWidth / img.width;
          const newHeight = img.height * scale;
          
          onStyleChange({
            ...style,
            aspectRatio: `${img.width} / ${img.height}`,
            height: `${newHeight}px`
          });
        }
      };
      img.src = content.url;
    }
  }, [content.url]);

  return (
    <div ref={containerRef} className="relative w-full h-full group">
      {/* Image Display */}
      <div className="w-full h-full flex items-center justify-center hover:bg-gray-50 rounded-lg overflow-hidden">
        {content.url ? (
          <img
            ref={imageRef}
            src={content.url}
            alt={content.alt || 'Uploaded image'}
            className="w-full h-full object-contain"
            style={{ outline: 'none' }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-gray-400">
            <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>Add an image</p>
          </div>
        )}
      </div>

      {/* Edit Control */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => setShowConfig(true)}
          className="p-1.5 bg-white shadow-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
          title="Edit image"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <ImageConfigPanel
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
