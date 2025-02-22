
import { useState } from 'react';
import { TableContent } from '@/lib/types';

interface TableWidgetProps {
  content: TableContent;
  onChange: (content: TableContent) => void;
  onDelete: () => void;
  style?: any;
  onStyleChange?: (style: any) => void;
}

type CellType = 'text' | 'image';

export const TableWidget = ({ content, onChange, onDelete, style, onStyleChange }: TableWidgetProps) => {
  const [rows, setRows] = useState<Array<Array<{ type: CellType; content: string }>>>(
    content.rows || [[{ type: 'text' as CellType, content: '' }]]
  );
  const [columns, setColumns] = useState(content.columns || 1);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellChange = (rowIndex: number, colIndex: number, value: string, type: CellType) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = { type, content: value };
    setRows(newRows);
    onChange({ rows: newRows, columns });
  };

  const addRow = () => {
    const newRow = Array(columns).fill(null).map(() => ({ type: 'text' as CellType, content: '' }));
    const newRows = [...rows, newRow];
    setRows(newRows);
    onChange({ rows: newRows, columns });
  };

  const addColumn = () => {
    const newRows = rows.map(row => [...row, { type: 'text' as CellType, content: '' }]);
    setRows(newRows);
    setColumns(columns + 1);
    onChange({ rows: newRows, columns: columns + 1 });
  };

  return (
    <div className="group relative p-4">
      {/* Style controls */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 z-10">
        <div className="bg-white p-2 rounded shadow-lg">
          <input
            type="color"
            value={style?.backgroundColor || '#ffffff'}
            onChange={(e) => onStyleChange?.({ ...style, backgroundColor: e.target.value })}
            className="mb-2"
          />
          <input
            type="color"
            value={style?.borderColor || '#e5e7eb'}
            onChange={(e) => onStyleChange?.({ ...style, borderColor: e.target.value })}
          />
        </div>
        <button
          onClick={addRow}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          Add Column
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="relative p-2 border min-h-[40px]"
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {cell.type === 'image' && cell.content ? (
                      <img src={cell.content} alt="cell content" className="max-h-20" />
                    ) : (
                      <div className="flex gap-2 min-h-[32px]">
                        <input
                          type="text"
                          value={cell.content}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value, cell.type)}
                          className="w-full p-1 border rounded"
                        />
                        {hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex && (
                          <select
                            value={cell.type}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, cell.content, e.target.value as CellType)}
                            className="absolute top-0 right-0 p-1 border rounded bg-white shadow-sm"
                          >
                            <option value="text">Text</option>
                            <option value="image">Image</option>
                          </select>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
