
import React from 'react';
import { formatTimeDisplay } from './legacyViewUtils';
import { CellInfo } from './useCellInfo';

interface TableCellProps {
  timeSlot: string;
  cellInfos: CellInfo[];
  isExpired: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ timeSlot, cellInfos, isExpired }) => {
  // If no infos, render an empty cell
  if (!cellInfos || cellInfos.length === 0) {
    return <td className="p-2 border bg-gray-50 h-16"></td>;
  }
  
  return (
    <td className="p-2 border relative min-h-[120px]">
      <div className="flex flex-col gap-1">
        {cellInfos.map((cellInfo, idx) => (
          <div 
            key={`${timeSlot}-${idx}-${cellInfo.name}`}
            className={`p-2 rounded ${
              cellInfo.isEvent 
                ? (isExpired ? 'bg-gray-500' : 'bg-blue-500') 
                : (isExpired ? 'bg-green-300' : 'bg-green-500')
            } text-white mb-1 shadow`}
          >
            <div className="font-medium truncate">{cellInfo.name || "Unnamed"}</div>
            {isExpired && <div className="text-red-100 text-xs">Expired</div>}
            <div className="text-sm">{cellInfo.category || (cellInfo.isEvent ? 'Event' : 'Regular slot')}</div>
            {cellInfo.description && (
              <div className="text-xs line-clamp-2 mt-1 text-white/90">{cellInfo.description}</div>
            )}
            <div className="mt-1 text-xs font-light">{formatTimeDisplay(timeSlot)}</div>
          </div>
        ))}
      </div>
    </td>
  );
};

export default TableCell;
