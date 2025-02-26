import { useDroppable } from '@dnd-kit/core';
import { Widget, WidgetType, TextContent, ImageContent, ButtonContent, TableContent } from '@/lib/types';
import { TextWidget } from './widgets/TextWidget';
import { ImageWidget } from './widgets/ImageWidget';
import { TableWidget } from './widgets/TableWidget';
import { ButtonWidget } from './widgets/ButtonWidget';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useEffect, useState } from 'react';

interface CanvasProps {
  widgets: Widget[];
  onWidgetChange: (id: string, widget: Partial<Widget>) => void;
  onWidgetDelete: (id: string) => void;
  onLayoutChange: (id: string, position: { x: number; y: number }, size?: { w: number; h: number }) => void;
}

export const Canvas = ({ widgets, onWidgetChange, onWidgetDelete, onLayoutChange }: CanvasProps) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const [containerWidth, setContainerWidth] = useState(1200);
  const [isDragging, setIsDragging] = useState(false);
  useEffect(() => {
    const updateWidth = () => {
      const container = document.getElementById('grid-container');
      if (container) {
        setContainerWidth(container.offsetWidth - 40); // Account for padding
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const calculateTextHeight = (widget: Widget) => {
    if (widget.type === 'text') {
      const content = widget.content as TextContent;
      const text = content.text || '';
      const fontSize = widget.style?.fontSize ? parseInt(widget.style.fontSize) : 16;
      const lineHeight = 1.5;
      const padding = 32; // 2rem (p-4 * 2)
      const linesOfText = Math.ceil(text.length / 50); // Rough estimate of characters per line
      const estimatedHeight = Math.max(2, Math.ceil((fontSize * lineHeight * linesOfText + padding) / 30));
      return estimatedHeight;
    }
    return widget.size?.h || getDefaultSize(widget.type).h;
  };

  const renderWidget = (widget: Widget) => {
    const commonProps = {
      onDelete: () => onWidgetDelete(widget.id),
      key: widget.id,
      style: widget.style,
      onStyleChange: (style: any) => onWidgetChange(widget.id, { style }),
      isEditing: widget.isEditing,
      onEditingChange: (isEditing: boolean) => onWidgetChange(widget.id, { isEditing })
    };

    switch (widget.type) {
      case 'text':
        return (
          <TextWidget
            {...commonProps}
            content={widget.content as TextContent}
            onChange={(content) => onWidgetChange(widget.id, { content })}
          />
        );
      case 'image':
        return (
          <ImageWidget
            {...commonProps}
            content={widget.content as ImageContent}
            onChange={(content) => onWidgetChange(widget.id, { content })}
          />
        );
      case 'table':
        return (
          <TableWidget
            {...commonProps}
            content={widget.content as TableContent}
            onChange={(content) => onWidgetChange(widget.id, { content })}
            onSizeChange={(size) => onLayoutChange(widget.id, widget.position, size)}
          />
        );
      case 'button':
        return (
          <ButtonWidget
            {...commonProps}
            content={widget.content as ButtonContent}
            onChange={(content) => onWidgetChange(widget.id, { content })}
          />
        );
      default:
        return null;
    }
  };

  const getDefaultRowHeight = (widget: Widget) => {
    switch (widget.type) {
      case 'image':
        return 8; // Increased height for images
      case 'table': {
        const tableContent = widget.content as TableContent;
        return tableContent.rows ? tableContent.rows.length * 2 + 2 : 4; // Better table height calculation
      }
      default:
        return 2;
    }
  };

  const layout = widgets.map((widget) => ({
    i: widget.id,
    x: widget.position?.x || 0,
    y: widget.position?.y || 0,
    w: widget.size?.w || getDefaultSize(widget.type).w,
    h: calculateTextHeight(widget),
    minW: 2,
    minH: 2,
    maxW: 12,
    maxH: 12,
    isDraggable: true,
    isResizable: false,
  }));

  const getDefaultSize = (type: WidgetType) => {
    switch (type) {
      case 'image':
        return { w: 6, h: 8 };
      case 'table':
        return { w: 8, h: 6 };
      case 'text':
        return { w: 4, h: 3 };
      case 'button':
        return { w: 3, h: 2 };
      default:
        return { w: 4, h: 2 };
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div 
        id="grid-container"
        ref={setNodeRef}
        className="bg-white rounded-xl shadow-sm min-h-[calc(100vh-4rem)] mx-auto max-w-[1920px] p-5"
      >
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={containerWidth}
          margin={[20, 20]}
          containerPadding={[20, 20]}
          onLayoutChange={(newLayout) => {
            if (!isDragging) {
              // Sort the new layout by Y position
              const sortedLayout = [...newLayout].sort((a, b) => a.y - b.y);
              
              // Update positions while maintaining order and preventing overlap
              sortedLayout.forEach((item, index) => {
                const widget = widgets.find(w => w.id === item.i);
                if (widget) {
                  const newPosition = { 
                    x: Math.max(0, Math.min(item.x, 12 - (widget.size?.w || 4))),
                    y: index * 2 // Ensure consistent spacing between widgets
                  };
                  const newSize = { w: item.w, h: item.h };
                  
                  // Only update if position or size actually changed
                  if (
                    widget.position?.x !== newPosition.x ||
                    widget.position?.y !== newPosition.y ||
                    widget.size?.w !== newSize.w ||
                    widget.size?.h !== newSize.h
                  ) {
                    onLayoutChange(item.i, newPosition, newSize);
                  }
                }
              });
            }
          }}
          onDragStart={() => setIsDragging(true)}
          onDragStop={() => {
            setIsDragging(false);
            const currentLayout = layout;
            // Sort by Y position before updating
            const sortedLayout = [...currentLayout].sort((a, b) => a.y - b.y);
            sortedLayout.forEach((item, index) => {
              const widget = widgets.find(w => w.id === item.i);
              if (widget) {
                onLayoutChange(
                  item.i,
                  { 
                    x: Math.max(0, Math.min(item.x, 12 - (widget.size?.w || 4))),
                    y: index * 2 // Maintain consistent spacing
                  },
                  { w: item.w, h: item.h }
                );
              }
            });
          }}
          isDraggable={true}
          compactType="vertical"
          preventCollision={false}
          isResizable={false}
          verticalCompact={true}
          useCSSTransforms={true}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className={`
                group relative  transition-all duration-200
                bg-white shadow-sm hover:shadow-md overflow-hidden rounded-lg
                ${widget.isEditing ? 'border-gray-300' : 'hover:border-gray-300'}
              `}
            >
              {renderWidget(widget)}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};
