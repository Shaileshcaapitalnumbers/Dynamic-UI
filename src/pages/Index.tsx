import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { WidgetPanel } from '@/components/WidgetPanel';
import { Canvas } from '@/components/Canvas';
import { Widget, WidgetType } from '@/lib/types';
import { useWidgets } from '@/contexts/WidgetContext';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<WidgetType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { widgets, addWidget, updateWidget, deleteWidget, clearWidgets, undo, redo } = useWidgets();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 20,
        delay: 10,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 10,
        tolerance: 8,
      },
    })
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    setActiveDragType(active.data.current?.type as WidgetType);
  };
  function nanoid(size = 21): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    const array = new Uint8Array(size);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => alphabet[byte % alphabet.length]).join('');
  }
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    setActiveDragType(null);

    if (over && over.id === 'canvas') {
      const type = active.data.current?.type as WidgetType;
      if (!type) return;

      // Get the drop point coordinates relative to the canvas
      const canvasElement = document.getElementById('grid-container');
      if (!canvasElement) return;

      const canvasRect = canvasElement.getBoundingClientRect();
      const dropPoint = {
        x: Math.round((active.rect.current.translated?.left ?? 0) - canvasRect.left),
        y: Math.round((active.rect.current.translated?.top ?? 0) - canvasRect.top)
      };

      // Convert drop coordinates to grid positions (12 columns)
      const gridX = Math.floor((dropPoint.x / canvasRect.width) * 12);
      const gridY = Math.floor(dropPoint.y / 30); // 30 is rowHeight

      // Get the size of the new widget
      const newWidgetSize = getDefaultSize(type);

      // Check for overlaps with existing widgets
      const hasOverlap = widgets.some(widget => {
        const widgetRight = widget.position.x + (widget.size?.w || 4);
        const widgetBottom = widget.position.y + (widget.size?.h || 2);
        const newWidgetRight = gridX + newWidgetSize.w;
        const newWidgetBottom = gridY + newWidgetSize.h;

        return !(
          gridX >= widgetRight || // New widget is to the right
          newWidgetRight <= widget.position.x || // New widget is to the left
          gridY >= widgetBottom || // New widget is below
          newWidgetBottom <= widget.position.y // New widget is above
        );
      });

      // If there's an overlap, find the nearest valid position
      let finalPosition = { x: gridX, y: gridY };
      if (hasOverlap) {
        // Find all occupied spaces
        const occupiedSpaces = widgets.map(widget => ({
          x1: widget.position.x,
          y1: widget.position.y,
          x2: widget.position.x + (widget.size?.w || 4),
          y2: widget.position.y + (widget.size?.h || 2)
        }));

        // Sort spaces by distance from original drop point
        const validPositions = [];
        for (let y = 0; y < Math.floor(canvasRect.height / 30); y++) {
          for (let x = 0; x < 12 - newWidgetSize.w; x++) {
            const hasConflict = occupiedSpaces.some(space => 
              !(x >= space.x2 || 
                x + newWidgetSize.w <= space.x1 || 
                y >= space.y2 || 
                y + newWidgetSize.h <= space.y1)
            );
            
            if (!hasConflict) {
              validPositions.push({
                x,
                y,
                distance: Math.sqrt(Math.pow(x - gridX, 2) + Math.pow(y - gridY, 2))
              });
            }
          }
        }

        // Use the nearest valid position
        if (validPositions.length > 0) {
          validPositions.sort((a, b) => a.distance - b.distance);
          finalPosition = validPositions[0];
        }
      }

      // Create the new widget at the final position
      const newWidget: Widget = {
        id: nanoid(),
        type,
        content: getDefaultContent(type),
        position: {
          x: Math.max(0, Math.min(finalPosition.x, 12 - newWidgetSize.w)),
          y: finalPosition.y
        },
        isEditing: true,
        style: getDefaultStyle(type),
        size: newWidgetSize
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
          rows: [],
          columns: 0
        };
      default:
        return { text: '' };
    }
  };

  const getDefaultSize = (type: WidgetType) => {
    switch (type) {
      case 'image':
        return { w: 4, h: 4 };
      case 'table':
        return { w: 8, h: 4 };
      case 'text':
        return { w: 4, h: 3 };
      case 'button':
        return { w: 3, h: 2 };
      default:
        return { w: 4, h: 2 };
    }
  };

  const handleLayoutChange = (id: string, position: { x: number; y: number }, size?: { w: number; h: number }) => {
    updateWidget(id, { position, ...(size && { size }) });
  };

  // Add a function to render the drag overlay content
  const renderDragOverlay = () => {
    if (!activeDragType) return null;
    
    return (
      <div className="p-3 bg-white rounded-md shadow-md border border-gray-200 drag-overlay-item">
        <span className="font-medium text-gray-700">
          {activeDragType.charAt(0).toUpperCase() + activeDragType.slice(1)}
        </span>
      </div>
    );
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
          className={`hidden md:flex fixed top-4 ${isSidebarOpen?"left-64":"left-4"} z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors items-center justify-center"
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
            fixed md:sticky top-0 left-0 h-screen
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

        <DragOverlay dropAnimation={null} modifiers={[]}>
          {activeId ? renderDragOverlay() : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Index;
