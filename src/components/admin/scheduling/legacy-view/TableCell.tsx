
import React from 'react';
import { formatTimeDisplay } from './legacyViewUtils';

interface CellInfo {
  name: string;
  status: string;
  category?: string;
  description?: string;
}

interface TableCellProps {
  timeSlot: string;
  cellInfo: CellInfo | null;
  isExpired: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ timeSlot, cellInfo, isExpired }) => {
  const cellColorClass = cellInfo 
    ? (isExpired ? 'bg-red-800' : 'bg-green-800')
    : 'bg-gray-100';
  
  return (
    <td className={`p-2 border ${cellColorClass} text-white`}>
      {cellInfo && (
        <div className="p-2">
          <div className="font-medium">{cellInfo.name}</div>
          {isExpired && <div className="text-red-300">Expired</div>}
          <div>{cellInfo.category || 'Regular slot'}</div>
          <div className="mt-2">{formatTimeDisplay(timeSlot)}</div>
        </div>
      )}
    </td>
  );
};

export default TableCell;
