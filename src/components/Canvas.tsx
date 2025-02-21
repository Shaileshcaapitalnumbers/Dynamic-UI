
import { useDroppable } from '@dnd-kit/core';
import { Widget } from '@/lib/types';
import { TextWidget } from './widgets/TextWidget';
import { ImageWidget } from './widgets/ImageWidget';

interface CanvasProps {
  widgets: Widget[];
  onWidgetChange: (id: string, widget: Partial<Widget>) => void;
  onWidgetDelete: (id: string) => void;
}

export const Canvas = ({ widgets, onWidgetChange, onWidgetDelete }: CanvasProps) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'text':
        return (
          <TextWidget
            content={widget.content}
            onChange={(content) => onWidgetChange(widget.id, { content })}
            onDelete={() => onWidgetDelete(widget.id)}
          />
        );
      case 'image':
        return (
          <ImageWidget
            content={widget.content}
            onChange={(content) => onWidgetChange(widget.id, { content })}
            onDelete={() => onWidgetDelete(widget.id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-h-screen p-8 bg-gray-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div key={widget.id}>{renderWidget(widget)}</div>
        ))}
      </div>
    </div>
  );
};
