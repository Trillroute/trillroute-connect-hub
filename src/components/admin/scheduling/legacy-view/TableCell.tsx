
import React from 'react';
import { formatTimeDisplay } from './legacyViewUtils';
import { CellInfo } from './useCellInfo';
import { useCalendar } from '../context/CalendarContext';
import { format } from 'date-fns';

interface TableCellProps {
  timeSlot: string;
  cellInfos: CellInfo[];
  isExpired: boolean;
  date: Date;
}

const TableCell: React.FC<TableCellProps> = ({ timeSlot, cellInfos, isExpired, date }) => {
  const { setIsCreateEventOpen, handleDateSelect } = useCalendar();
  
  // Ensure cellInfos is always an array, even if undefined is passed
  const safeInfos = Array.isArray(cellInfos) ? cellInfos : [];
  
  const handleCellClick = () => {
    // If this is an empty cell (available slot)
    if (safeInfos.length === 0) {
      // Parse the timeSlot to get hours and minutes
      const timeParts = timeSlot.split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      
      // Create a new date with the day from the date prop but hours/minutes from timeSlot
      const clickedDate = new Date(date);
      clickedDate.setHours(hours, minutes, 0, 0);
      
      // Select the date in the calendar context which stores it for the event creation dialog
      handleDateSelect(clickedDate);
      
      // Open the create event dialog
      setIsCreateEventOpen(true);
    }
  };
  
  // If no infos, render an empty cell that's clickable to add an event
  if (safeInfos.length === 0) {
    return (
      <td 
        className="p-2 border bg-gray-50 h-16 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={handleCellClick}
        title={`Add event at ${timeSlot} on ${format(date, 'EEEE, MMM d')}`}
      >
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          <span>+</span>
        </div>
      </td>
    );
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
