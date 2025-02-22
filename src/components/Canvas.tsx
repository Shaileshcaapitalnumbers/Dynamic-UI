
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
        return 4;
      case 'table':
        return Math.max(2, widget.content.rows.length + 1);
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
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                backgroundColor: widget.style?.backgroundColor,
                color: widget.style?.textColor,
                borderColor: widget.style?.borderColor,
                borderWidth: widget.style?.borderWidth,
                borderRadius: widget.style?.borderRadius,
                padding: widget.style?.padding,
              }}
              className="border hover:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md overflow-hidden"
            >
              {renderWidget(widget)}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
};
