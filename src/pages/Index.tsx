
import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { nanoid } from 'nanoid';
import { WidgetPanel } from '@/components/WidgetPanel';
import { Canvas } from '@/components/Canvas';
import { Widget, WidgetType } from '@/lib/types';
import useWidgetStore from '@/lib/widgetStore';

const Index = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { widgets, addWidget, updateWidget, deleteWidget, clearWidgets, undo, redo } = useWidgetStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);

    if (over && over.id === 'canvas') {
      const type = active.data.current?.type as WidgetType;
      if (!type) return;

      const newWidget: Widget = {
        id: nanoid(),
        type,
        content: getDefaultContent(type),
        position: { x: 0, y: 0 },
      };

      addWidget(newWidget);
    }
  };

  const getDefaultContent = (type: WidgetType) => {
    switch (type) {
      case 'text':
        return { text: 'New Text' };
      case 'image':
        return { url: '', alt: '' };
      case 'button':
        return { text: 'New Button', variant: 'primary' };
      case 'table':
        return { rows: [[{ type: 'text', content: '' }]], columns: 1 };
      default:
        return {};
    }
  };

  const handleLayoutChange = (id: string, position: { x: number; y: number }, size?: { w: number; h: number }) => {
    updateWidget(id, { position, ...(size && { size }) });
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen bg-gray-50">
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          <button
            onClick={undo}
            className="px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
          >
            Undo
          </button>
          <button
            onClick={redo}
            className="px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
          >
            Redo
          </button>
          <button
            onClick={clearWidgets}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:shadow-md transition-shadow hover:bg-red-600"
          >
            Clear Widgets
          </button>
        </div>
        <WidgetPanel onDragStart={(type) => console.log('Dragging', type)} />
        <Canvas
          widgets={widgets}
          onWidgetChange={updateWidget}
          onWidgetDelete={deleteWidget}
          onLayoutChange={handleLayoutChange}
        />
      </div>
    </DndContext>
  );
};

export default Index;
