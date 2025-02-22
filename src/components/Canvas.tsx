
import { useDroppable } from '@dnd-kit/core';
import { Widget } from '@/lib/types';
import { TextWidget } from './widgets/TextWidget';
import { ImageWidget } from './widgets/ImageWidget';
import { TableWidget } from './widgets/TableWidget';
import { ButtonWidget } from './widgets/ButtonWidget';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

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

  const renderWidget = (widget: Widget) => {
    const commonProps = {
      onDelete: () => onWidgetDelete(widget.id),
      key: widget.id,
      style: widget.style,
      onStyleChange: (style: any) => onWidgetChange(widget.id, { style }),
    };

    switch (widget.type) {
      case 'text':
        return (
          <TextWidget
            {...commonProps}
            content={widget.content}
            onChange={(content) => onWidgetChange(widget.id, { content })}
          />
        );
      case 'image':
        return (
          <ImageWidget
            {...commonProps}
            content={widget.content}
            onChange={(content) => onWidgetChange(widget.id, { content })}
          />
        );
      case 'table':
        return (
          <TableWidget
            {...commonProps}
            content={widget.content}
            onChange={(content) => onWidgetChange(widget.id, { content })}
          />
        );
      case 'button':
        return (
          <ButtonWidget
            {...commonProps}
            content={widget.content}
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
      case 'table':
        return widget.content.rows ? widget.content.rows.length * 2 + 2 : 4; // Better table height calculation
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
    <div className="flex flex-1 min-h-screen">
      <div className="w-64 border-r-2 border-dashed border-gray-300" />
      <div ref={setNodeRef} className="flex-1 p-8 bg-gray-50">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          margin={[20, 20]}
          onLayoutChange={(newLayout) => {
            newLayout.forEach((item) => {
              onLayoutChange(item.i, { x: item.x, y: item.y }, { w: item.w, h: item.h });
            });
          }}
          resizeHandles={['se']}
          draggableHandle=".drag-handle" // Only allow dragging by handle
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              onDoubleClick={() => onWidgetChange(widget.id, { isEditing: true })}
              className="relative border hover:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md overflow-hidden"
            >
              <div className="drag-handle absolute top-0 left-0 right-0 h-6 bg-gray-50 cursor-move opacity-0 group-hover:opacity-100 transition-opacity" />
              {renderWidget(widget)}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};
