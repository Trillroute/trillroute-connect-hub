
import React from 'react';
import { formatTimeDisplay } from './legacyViewUtils';
import { CellInfo } from './useCellInfo';

interface TableCellProps {
  timeSlot: string;
  cellInfos: CellInfo[];
  isExpired: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ timeSlot, cellInfos, isExpired }) => {
  // Ensure cellInfos is always an array, even if undefined is passed
  const safeInfos = Array.isArray(cellInfos) ? cellInfos : [];
  
  // If no infos, render an empty cell
  if (safeInfos.length === 0) {
    return <td className="p-2 border bg-gray-50 h-16"></td>;
  }
  
  return (
    <td className="p-2 border relative min-h-[120px]">
      <div className="flex flex-col gap-1">
        {safeInfos.map((cellInfo, idx) => {
          // Determine the cell color based on type and expiration status
          let bgColorClass = '';
          
          if (cellInfo.isEvent) {
            // Events use blue colors
            bgColorClass = isExpired ? 'bg-blue-300' : 'bg-blue-500';
          } else {
            // Availability slots use green colors
            bgColorClass = isExpired ? 'bg-green-300' : 'bg-green-500';
          }
          
          return (
            <div 
              key={`${cellInfo?.id || timeSlot}-${idx}`}
              className={`p-2 rounded ${bgColorClass} text-white mb-1 shadow`}
            >
              <div className="font-medium truncate">{cellInfo.name || "Unnamed"}</div>
              {isExpired && <div className="text-red-100 text-xs">Expired</div>}
              <div className="text-sm">{cellInfo.category || (cellInfo.isEvent ? 'Event' : 'Regular slot')}</div>
              {cellInfo.description && (
                <div className="text-xs line-clamp-2 mt-1 text-white/90">{cellInfo.description}</div>
              )}
              <div className="mt-1 text-xs font-light">{formatTimeDisplay(timeSlot)}</div>
            </div>
          );
        })}
      </div>
    </td>
  );
};

export default TableCell;
