
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

  const layout = widgets.map((widget) => ({
    i: widget.id,
    x: widget.position.x || 0,
    y: widget.position.y || 0,
    w: widget.size?.w || 6,
    h: widget.size?.h || 4,
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
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className="border-2 border-transparent hover:border-blue-500 rounded-lg cursor-move transition-all duration-200 bg-white shadow-sm hover:shadow-md"
          >
            {renderWidget(widget)}
          </div>
        ))}
      </GridLayout>
    </div>
  );
};
