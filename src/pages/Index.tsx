
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
import { WidgetPanel } from '@/components/WidgetPanel';
import { Canvas } from '@/components/Canvas';
import { Widget, WidgetType } from '@/lib/types';
import { useWidgets } from '@/contexts/WidgetContext';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { widgets, addWidget, updateWidget, deleteWidget, clearWidgets, undo, redo } = useWidgets();

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
  function nanoid(size = 21): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    const array = new Uint8Array(size);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => alphabet[byte % alphabet.length]).join('');
  }
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
        return { text: '', variant: 'primary' as const };
      case 'table':
        return {
          rows: [[{ type: 'text' as const, content: '' }]],
          columns: 1
        };
      default:
        return { text: '' };
    }
  };

  const handleLayoutChange = (id: string, position: { x: number; y: number }, size?: { w: number; h: number }) => {
    updateWidget(id, { position, ...(size && { size }) });
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen bg-gray-100 relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`hidden md:flex fixed top-4 ${isSidebarOpen?"left-72":"left-4"} z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors items-center justify-center"
          aria-label="Toggle sidebar`}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-0 left-0 h-full
            ${isSidebarOpen ? 'w-72' : 'w-0'}
            transform transition-all duration-300 ease-in-out
            bg-white border-r border-gray-200 z-40 overflow-hidden
            flex flex-col
          `}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Actions Section */}
            <div className="p-6 space-y-6 border-b border-gray-200">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">Actions</h2>
                <div className="flex gap-3">
                  <button
                    onClick={undo}
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Undo
                  </button>
                  <button
                    onClick={redo}
                    className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Redo
                  </button>
                </div>
                <button
                  onClick={clearWidgets}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow-sm hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  Clear Canvas
                </button>
              </div>
            </div>

            {/* Widgets Section */}
            <div className="flex-1 p-6 overflow-y-auto">
              <WidgetPanel onDragStart={(type) => console.log('Dragging', type)} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`
          flex-1 transition-all duration-300
          ${isSidebarOpen ? 'md:ml-0' : 'md:ml-0'}
        `}>
          <Canvas
            widgets={widgets}
            onWidgetChange={updateWidget}
            onWidgetDelete={deleteWidget}
            onLayoutChange={handleLayoutChange}
          />
        </main>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </DndContext>
  );
};

export default Index;
