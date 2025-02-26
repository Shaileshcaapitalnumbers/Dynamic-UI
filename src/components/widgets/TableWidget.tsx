import { useRef, useState, useEffect } from 'react';
import { TableContent } from '@/lib/types';
import { Edit, Save, Trash, Plus, MinusCircle, Image as ImageIcon, Type, X } from 'lucide-react';
import { TableCellConfigPanel } from './TableCellConfigPanel';
import { TableSetupDialog } from './TableSetupDialog';
import { createPortal } from 'react-dom';

interface TableWidgetProps {
  content: TableContent;
  onChange: (content: TableContent) => void;
  onDelete: () => void;
  style?: any;
  onStyleChange?: (style: any) => void;
  isEditing?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
  onSizeChange?: (size: { w: number; h: number }) => void;
}

interface TableControlPanelProps {
  onAddRow: () => void;
  onAddColumn: () => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  maxColumns: number;
  currentColumns: number;
}

interface CellEditorProps {
  cellId: string;
  content: { type: 'text' | 'image'; content: string };
  onChange: (content: { type: 'text' | 'image'; content: string }) => void;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

const CellEditor = ({
  cellId,
  content,
  onChange,
  onClose,
  containerRef
}: CellEditorProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [type, setType] = useState<'text' | 'image'>(content.type);
  const [valueText, setValueText] = useState(content.type ==="text"?content.content:"");
  const [valueImage, setValueImage] = useState(content.type ==="image"?content.content:"");

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !panelRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Check if there's more space on the right or left
    const spaceOnRight = viewportWidth - containerRect.right > 300; // 300px minimum for panel

    setPosition({
      top: containerRect.top,
      left: spaceOnRight ? containerRect.right + 16 : containerRect.left - panelRect.width - 16
    });
  }, [containerRef]);

  const handleSave = () => {
    onChange({ type, content:type === 'text'? valueText:valueImage });
    onClose();
  };

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[300px]"
      style={{ top: position.top, left: position.left }}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Cell {cellId}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            {/* <MinusCircle className="w-5 h-5" /> */}
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => setType('text')}
              className={`flex-1 p-2 rounded ${type === 'text' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50'}`}
            >
              <Type className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => setType('image')}
              className={`flex-1 p-2 rounded ${type === 'image' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50'}`}
            >
              <ImageIcon className="w-4 h-4 mx-auto" />
            </button>
          </div>

          {type === 'text' ? (
            <textarea
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              rows={3}
              placeholder="Enter text..."
            />
          ) : (
            <input
              type="text"
              value={valueImage}
              onChange={(e) => setValueImage(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              placeholder="Enter image URL..."
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const TableControlPanel = ({
  onAddRow,
  onAddColumn,
  onClose,
  containerRef,
  maxColumns,
  currentColumns
}: TableControlPanelProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !panelRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const panelRect = panelRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if there's more space above or below
    const spaceBelow = viewportHeight - containerRect.bottom;
    const spaceAbove = containerRect.top;

    setPosition({
      top: spaceBelow > spaceAbove 
        ? containerRect.bottom + 16 
        : containerRect.top - panelRect.height - 16,
      left: containerRect.left
    });
  }, [containerRef]);

  return createPortal(
    <div
      ref={panelRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[200px]"
      style={{ top: position.top, left: position.left }}
    >
      <div className="space-y-3">
        <button
          onClick={() => onAddRow()}
          className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Row</span>
        </button>
        {currentColumns * 2 < maxColumns && (
          <button
            onClick={() => onAddColumn()}
            className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Column</span>
          </button>
        )}
        <button
          onClick={onClose}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>,
    document.body
  );
};
export interface TextStyle {
  fontSize?: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

export interface TextContent {
  text: string;
  style?: TextStyle;
}
export const TableWidget = ({
  content,
  onChange,
  onDelete,
  style = {},
  onStyleChange,
  isEditing = false,
  onEditingChange,
  onSizeChange
}: TableWidgetProps) => {
  const [showSetup, setShowSetup] = useState(!content.rows || content.rows.length === 0);
  const [editMode, setEditMode] = useState(false);
  const [editingCell, setEditingCell] = useState<{ id: string; row: number; col: number } | null>(null);
  const [showControls, setShowControls] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Calculate table dimensions based on content
  const calculateTableDimensions = () => {
    if (!content.rows?.length) return { w: 4, h: 2 };
    
    const calculatedWidth = Math.min(content.columns * 2, 12);
    
    // Calculate height based on content type
    let maxRowHeight = 0;
    content.rows.forEach(row => {
      let rowHeight = 1; // Default height for text
      row.forEach(cell => {
        if (cell.type === 'image' && cell.content) {
          rowHeight = Math.max(rowHeight, 2); // Increase height for rows with images
        }
        if (cell.type === 'text' && cell.content) {
          const content = cell.content as any;
          const text = content || '';
          const fontSize =  16;
          const lineHeight = 1.5;
          const padding = 32; // 2rem (p-4 * 2)
          const linesOfText = Math.ceil(text.length / 3); // Rough estimate of characters per line
          


          const estimatedHeight = Math.max(2, Math.ceil((fontSize * lineHeight * linesOfText + padding) / 30));
          rowHeight = estimatedHeight 
        }
      });
      maxRowHeight += rowHeight;
    });
    
    return { w: calculatedWidth, h: maxRowHeight + (2/content.rows?.length)};
  };

  // Position control buttons based on available space
  const [controlsPosition, setControlsPosition] = useState<'left' | 'right'>('right');
  
  useEffect(() => {
    if (!tableRef.current) return;
    
    const tableRect = tableRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Check available space on both sides
    const spaceOnRight = viewportWidth - tableRect.right;
    const spaceOnLeft = tableRect.left;
    
    setControlsPosition(spaceOnRight >= 48 ? 'right' : 'left');
  }, []);

  // Update dimensions when content changes
  useEffect(() => {
    const newDimensions = calculateTableDimensions();
    if (onSizeChange) {
      onSizeChange(newDimensions);
    }
  }, [content.rows?.length, content.columns,editingCell]);

  // Check if content is empty to show setup
  useEffect(() => {
    setShowSetup(!content.rows || content.rows.length === 0);
  }, [content.rows]);

  // Update parent about editing state
  useEffect(() => {
    if (onEditingChange) {
      onEditingChange(editMode || showSetup || editingCell !== null);
    }
  }, [editMode, showSetup, editingCell]);

  const handleSetupConfirm = (rows: number, columns: number) => {
    const newRows = Array(rows)
      .fill(null)
      .map(() =>
        Array(columns)
          .fill(null)
          .map(() => ({ type: 'text' as const, content: '' }))
      );
    
    onChange({ rows: newRows, columns });
    setShowSetup(false);
    setEditMode(true);

    if (onSizeChange) {
      onSizeChange({
        w: Math.min(columns * 2, 12),
        h: rows * 1 
      });
    }
  };

  const handleSaveChanges = () => {
    setEditMode(false);
    setShowControls(false);
    setEditingCell(null);
    // Ensure we notify parent about edit state change
    if (onEditingChange) {
      onEditingChange(false);
    }
  };

  // Show setup dialog for empty content
  if (showSetup) {
    return <TableSetupDialog onConfirm={handleSetupConfirm} onCancel={onDelete} />;
  }

  const handleDeleteRow = (rowIndex: number) => {
    if (content.rows.length <= 1) return; // Prevent deleting last row
    const newRows = [...content.rows];
    newRows.splice(rowIndex, 1);
    onChange({ ...content, rows: newRows });
  };

  const handleDeleteColumn = (colIndex: number) => {
    if (content.columns <= 1) return; // Prevent deleting last column
    const newRows = content.rows.map(row => {
      const newRow = [...row];
      newRow.splice(colIndex, 1);
      return newRow;
    });
    onChange({ ...content, rows: newRows, columns: content.columns - 1 });
  };

  const handleAddRow = () => {
    const newRow = Array(content.columns)
      .fill(null)
      .map(() => ({ type: 'text' as const, content: '' }));
    onChange({ ...content, rows: [...content.rows, newRow] });
  };

  const handleAddColumn = () => {
    if (content.columns * 2 >= 16) return;
    const newRows = content.rows.map(row => [
      ...row,
      { type: 'text' as const, content: '' }
    ]);
    onChange({ ...content, rows: newRows, columns: content.columns + 1 });
  };

  const getCellId = (rowIndex: number, colIndex: number) => {
    return `R${rowIndex + 1}C${colIndex + 1}`;
  };

  return (
    <div ref={tableRef} className="relative w-full h-full group">
      <div className="w-full h-full">
        {/* Control Buttons - Modified for hover visibility */}
        <div className="absolute -top-2 -right-0 flex items-center gap-2 bg-white p-1.5 rounded-lg shadow-md z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {editMode && (
            <button
              onClick={() => setShowControls(true)}
              className="p-1.5 bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
              title="Add row/column"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => editMode ? handleSaveChanges() : setEditMode(true)}
            className={`p-1.5 border flex items-center justify-center ${
              editMode 
                ? 'bg-blue-500 text-white hover:bg-blue-600 ' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
            } rounded-md transition-colors`}
            title={editMode ? "Save changes" : "Edit table"}
          >
            {editMode ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 bg-white border border-gray-200 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center"
            title="Delete table"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full h-full bg-white rounded-lg p-4 overflow-hidden">
          <div className="relative ">
            {/* Column Delete Buttons - Only show in edit mode */}
            {editMode && (
              <div className="absolute -top-6 left-0 right-0 flex z-20">
                {Array(content.columns)
                  .fill(null)
                  .map((_, colIndex) => (
                    <div
                      key={`col-delete-${colIndex}`}
                      className="flex-1 flex justify-start"
                    >
                      <button
                        onClick={() => handleDeleteColumn(colIndex)}
                        className="p-1 bg-white rounded-full shadow-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete column"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
              </div>
            )}

            {/* Table Structure - Always visible */}
            <div className=" overflow-hidden mt-2">
              {content.rows.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex items-center group">
                  <div className="flex-1 border-b-1 border-gray-300 last:border-b-0">
                    <div className="flex">
                      {row.map((cell, colIndex) => (
                        <div
                          key={`cell-${rowIndex}-${colIndex}`}
                          className="relative group/cell border border-gray-300"
                          style={{
                            width: `${100 / content.columns}%`,
                            minHeight: '2rem'
                          }}
                        >
                          <div className="p-2">
                            {cell.type === 'text' ? (
                              <p className="break-words text-sm ">
                                {cell.content || (editMode ? 'Click to edit' : '')}
                              </p>
                            ) : (
                              cell.content && (
                                <img
                                  src={cell.content}
                                  alt="Cell content"
                                  className="w-full h-auto rounded"
                                />
                              )
                            )}
                          </div>

                          {/* Edit button - Only show in edit mode */}
                          {editMode && (
                            <button
                              onClick={() => setEditingCell({
                                id: getCellId(rowIndex, colIndex),
                                row: rowIndex,
                                col: colIndex
                              })}
                              className="absolute top-1 right-1 opacity-0 group-hover/cell:opacity-100 p-1 bg-white shadow-sm text-gray-600 rounded hover:bg-gray-50 transition-opacity"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row Delete Button - Only show in edit mode */}
                  {editMode && (
                    <button
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="p-1 ml-2 bg-white rounded-full shadow-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete row"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Control Panel */}
      {showControls && (
        <TableControlPanel
          onAddRow={handleAddRow}
          onAddColumn={handleAddColumn}
          onClose={() => setShowControls(false)}
          containerRef={tableRef}
          maxColumns={12}
          currentColumns={content.columns}
        />
      )}

      {/* Cell Editor */}
      {editingCell !== null && (
        <CellEditor
          cellId={editingCell.id}
          content={content.rows[editingCell.row][editingCell.col]}
          onChange={(newContent) => {
            const newRows = [...content.rows];
            newRows[editingCell.row][editingCell.col] = newContent;
            onChange({ ...content, rows: newRows });
            setEditingCell(null);
          }}
          onClose={() => setEditingCell(null)}
          containerRef={tableRef}
        />
      )}
    </div>
  );
};
