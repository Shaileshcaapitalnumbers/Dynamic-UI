
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
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Widgets</h2>
      <div className="grid gap-3">
        {widgets.map(({ type, label }) => (
          <DraggableWidget key={type} type={type} label={label} />
        ))}
      </div>
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
      className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md 
                transition-all duration-200 cursor-move
                hover:border-blue-500 active:scale-95"
      style={style}
    >
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
};
