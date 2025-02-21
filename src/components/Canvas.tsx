
import { useDroppable } from '@dnd-kit/core';
import { Widget } from '@/lib/types';
import { TextWidget } from './widgets/TextWidget';
import { ImageWidget } from './widgets/ImageWidget';
import { TableWidget } from './widgets/TableWidget';
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
      default:
        return null;
    }
  };

  const layout = widgets.map((widget, index) => ({
    i: widget.id,
    x: widget.position.x || 0,
    y: widget.position.y || 0,
    w: 6,
    h: 4,
  }));

  return (
    <div ref={setNodeRef} className="ml-64 flex-1 min-h-screen p-8 bg-gray-50">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={50}
        width={1200}
        onLayoutChange={(newLayout) => {
          newLayout.forEach((item) => {
            onLayoutChange(item.i, { x: item.x, y: item.y }, { w: item.w, h: item.h });
          });
        }}
        draggableHandle=".widget-drag-handle"
      >
        {widgets.map((widget) => (
          <div key={widget.id} className="bg-white rounded-lg shadow-sm">
            <div className="widget-drag-handle cursor-move p-2 bg-gray-100 rounded-t-lg">
              Drag here
            </div>
            {renderWidget(widget)}
          </div>
        ))}
      </GridLayout>
    </div>
  );
};
