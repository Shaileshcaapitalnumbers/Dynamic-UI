
import { useState } from 'react';
import { TableContent } from '@/lib/types';

interface TableWidgetProps {
  content: TableContent;
  onChange: (content: TableContent) => void;
  onDelete: () => void;
}

type CellType = 'text' | 'image';

export const TableWidget = ({ content, onChange, onDelete }: TableWidgetProps) => {
  const [rows, setRows] = useState<Array<Array<{ type: CellType; content: string }>>>(
    content.rows || [[{ type: 'text' as CellType, content: '' }]]
  );
  const [columns, setColumns] = useState(content.columns || 1);

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
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-2 border">
                    {cell.type === 'image' && cell.content ? (
                      <img src={cell.content} alt="cell content" className="max-h-20" />
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cell.content}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value, cell.type)}
                          className="w-full p-1 border rounded"
                        />
                        <select
                          value={cell.type}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, cell.content, e.target.value as CellType)}
                          className="p-1 border rounded"
                        >
                          <option value="text">Text</option>
                          <option value="image">Image</option>
                        </select>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={addRow}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Row
        </button>
        <button
          onClick={addColumn}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Column
        </button>
      </div>
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-500"
      >
        ×
      </button>
    </div>
  );
};
