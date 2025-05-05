
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Calendar as CalendarIcon, 
  List 
} from 'lucide-react';
import { useCalendar } from './CalendarContext';
import LayersDropdown from './LayersDropdown';

interface CalendarHeaderProps {
  title: string;
  showEventListToggle?: boolean;
  onToggleEventList?: () => void;
  isEventListShown?: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  title,
  showEventListToggle = true,
  onToggleEventList,
  isEventListShown = false
}) => {
  const { 
    viewMode, 
    setViewMode, 
    goToPrevious, 
    goToNext, 
    goToToday 
  } = useCalendar();
  
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <LayersDropdown />
        <h3 className="text-xl font-semibold ml-2">{title}</h3>
      </div>
      
      <div className="flex items-center gap-2">
        {/* View toggle buttons */}
        <div className="flex border rounded-md overflow-hidden shadow-sm mr-2">
          <Button
            variant={viewMode === 'day' ? "default" : "ghost"}
            className="px-2 rounded-none"
            onClick={() => setViewMode('day')}
          >
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>Day</span>
          </Button>
          
          <Button
            variant={viewMode === 'week' ? "default" : "ghost"}
            className="px-2 rounded-none"
            onClick={() => setViewMode('week')}
          >
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>Week</span>
          </Button>
          
          <Button
            variant={viewMode === 'month' ? "default" : "ghost"}
            className="px-2 rounded-none"
            onClick={() => setViewMode('month')}
          >
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>Month</span>
          </Button>
        </div>
        
        {/* List view toggle for all views */}
        {showEventListToggle && onToggleEventList && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleEventList}
            className="mr-2"
          >
            {isEventListShown ? (
              <>
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Calendar</span>
              </>
            ) : (
              <>
                <List className="w-4 h-4 mr-1" />
                <span>List</span>
              </>
            )}
          </Button>
        )}
        
        {/* Navigation buttons */}
        <div className="flex border rounded-md overflow-hidden shadow-sm">
          <Button variant="ghost" className="px-2 rounded-none" onClick={goToToday}>
            Today
          </Button>
          <Button variant="ghost" className="px-2 rounded-none" onClick={goToPrevious}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="px-2 rounded-none" onClick={goToNext}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
