
import React from 'react';
import { formatTimeDisplay } from './legacyViewUtils';
import { CellInfo } from './useCellInfo';

interface TableCellProps {
  timeSlot: string;
  cellInfos: CellInfo[];
  isExpired: boolean;
}

const TableCell: React.FC<TableCellProps> = ({ timeSlot, cellInfos, isExpired }) => {
  if (!cellInfos.length) {
    return <td className="p-2 border bg-gray-100"></td>;
  }
  
  return (
    <td className="p-2 border relative min-h-[120px]">
      <div className="flex flex-col gap-1">
        {cellInfos.map((cellInfo, idx) => (
          <div 
            key={idx}
            className={`p-2 rounded ${
              cellInfo.isEvent 
                ? (isExpired ? 'bg-red-700' : 'bg-blue-700') 
                : (isExpired ? 'bg-red-800' : 'bg-green-700')
            } text-white mb-1`}
          >
            <div className="font-medium">{cellInfo.name}</div>
            {isExpired && <div className="text-red-300">Expired</div>}
            <div>{cellInfo.category || (cellInfo.isEvent ? 'Event' : 'Regular slot')}</div>
            {cellInfo.description && <div className="text-sm">{cellInfo.description}</div>}
            <div className="mt-1 text-xs">{formatTimeDisplay(timeSlot)}</div>
          </div>
        ))}
      </div>
    </td>
  );
};

export default TableCell;
