import { useDroppable } from '@dnd-kit/core';
import { Widget, TextContent, ImageContent, ButtonContent, TableContent } from '@/lib/types';
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
    x: widget.position.x || 0,
    y: widget.position.y || 0,
    w: widget.size?.w || 4,
    h: widget.size?.h || getDefaultRowHeight(widget),
  }));

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
              newLayout.forEach((item) => {
                onLayoutChange(
                  item.i,
                  { x: item.x, y: item.y },
                  { w: item.w, h: item.h }
                );
              });
            }
          }}
          onDragStart={() => setIsDragging(true)}
          onDragStop={() => {
            setIsDragging(false);
            const currentLayout = layout.map((item) => ({
              ...item,
              isDragging: false,
            }));
            currentLayout.forEach((item) => {
              onLayoutChange(
                item.i,
                { x: item.x, y: item.y },
                { w: item.w, h: item.h }
              );
            });
          }}
          resizeHandles={['se']}
          isDraggable={true}
          compactType={null}
          preventCollision={true}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              onDoubleClick={() => onWidgetChange(widget.id, { isEditing: true })}
              className={`
                group relative border border-gray-200 transition-all duration-200
                bg-white shadow-sm hover:shadow-md overflow-hidden rounded-lg
                ${widget.isEditing ? 'ring-2 ring-blue-500' : 'hover:border-blue-500'}
              `}
            >
              {renderWidget(widget)}
              <style>
                {`
                  .group:hover .react-resizable-handle {
                    opacity: 1;
                  }
                  .react-resizable-handle {
                    opacity: 0;
                    transition: opacity 0.2s ease-in-out;
                  }
                `}
              </style>
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};
