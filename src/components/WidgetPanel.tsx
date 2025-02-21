
import { useDraggable } from '@dnd-kit/core';
import { WidgetType } from '@/lib/types';

interface WidgetPanelProps {
  onDragStart: (type: WidgetType) => void;
}

const widgets = [
  { type: 'text', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'button', label: 'Button' },
  { type: 'table', label: 'Table' },
] as const;

export const WidgetPanel = ({ onDragStart }: WidgetPanelProps) => {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 w-48 bg-white/80 backdrop-blur-lg rounded-lg shadow-lg p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">Widgets</h2>
      {widgets.map(({ type, label }) => (
        <DraggableWidget key={type} type={type} label={label} />
      ))}
    </div>
  );
};

interface DraggableWidgetProps {
  type: WidgetType;
  label: string;
}

const DraggableWidget = ({ type, label }: DraggableWidgetProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `widget-${type}`,
    data: { type },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow cursor-move"
      style={style}
    >
      {label}
    </div>
  );
};
