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
        distance: 20,
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8,
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
        content: getDefaultContent(type) as any,
        position: { x: 0, y: 0 },
        isEditing: true,
        style: getDefaultStyle(type)
      };

      addWidget(newWidget);
    }
  };

  const getDefaultStyle = (type: WidgetType) => {
    return {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderColor: '#e5e7eb',
      borderWidth: '1px',
      borderRadius: '0.375rem',
      padding: '1rem'
    };
  };

  const getDefaultContent = (type: WidgetType) => {
    switch (type) {
      case 'text':
        return { text: '' };
      case 'image':
        return { url: '', alt: '' };
      case 'button':
        return { text: '', variant: 'primary' };
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
        <div className="fixed left-0 top-0 w-64 bg-white shadow-md z-20 p-4">
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <button
                onClick={undo}
                className="flex-1 px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                Undo
              </button>
              <button
                onClick={redo}
                className="flex-1 px-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                Redo
              </button>
            </div>
            <button
              onClick={clearWidgets}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-sm hover:shadow-md transition-shadow hover:bg-red-600"
            >
              Clear Widgets
            </button>
          </div>
          <div className="mt-4">
            <WidgetPanel onDragStart={(type) => console.log('Dragging', type)} />
          </div>
        </div>
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
