import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertCircle } from 'lucide-react';

interface TableSetupDialogProps {
  onConfirm: (rows: number, columns: number) => void;
  onCancel: () => void;
}

export const TableSetupDialog = ({ onConfirm, onCancel }: TableSetupDialogProps) => {
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [error, setError] = useState('');

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (columns * 1 > 10) { // Max width constraint (12 grid units)
      setError('Too many columns would exceed maximum width. Please reduce.');
      return;
    }

    onConfirm(rows, columns);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Create New Table</h3>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={validateAndSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rows
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={rows}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                  setRows(value);
                  setError('');
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <p className="mt-1 text-sm text-gray-500">
                Each row has a default height of 2 units
              </p> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Columns
              </label>
              <input
                type="number"
                min="1"
                // max="3" // Max 3 columns (4 units each = 12 total)
                value={columns}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(12, parseInt(e.target.value) || 1));
                  setColumns(value);
                  setError('');
                }}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <p className="mt-1 text-sm text-gray-500">
                Each column has a default width of 4 units (max 3 columns)
              </p> */}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Table
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}; 