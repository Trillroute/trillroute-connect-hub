
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search, Settings, List, Calendar as CalendarIcon } from 'lucide-react';
import { useCalendar } from './CalendarContext';

interface CalendarHeaderProps {
  title: string;
  showEventListToggle?: boolean;
  onToggleEventList?: () => void;
  isEventListShown?: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  showEventListToggle = false,
  onToggleEventList = () => {},
  isEventListShown = false
}) => {
  const { viewMode, setViewMode, goToPrevious, goToNext, goToToday } = useCalendar();
  
  return (
    <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={goToToday}
          className="text-sm h-8"
        >
          Today
        </Button>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToPrevious}
            className="h-7 w-7"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNext}
            className="h-7 w-7"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      
      <div className="flex items-center gap-2 mt-0">
        <div>
          <Select
            value={viewMode}
            onValueChange={(value) => setViewMode(value as 'day' | 'week' | 'month')}
          >
            <SelectTrigger className="w-[90px] h-8 text-xs">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {showEventListToggle && (
          <Button
            variant="outline"
            size="sm"
            className="ml-2 h-8"
            onClick={onToggleEventList}
          >
            {isEventListShown ? (
              <>
                <CalendarIcon className="h-4 w-4 mr-1" />
                Calendar
              </>
            ) : (
              <>
                <List className="h-4 w-4 mr-1" />
                List
              </>
            )}
          </Button>
        )}
        
        <div className="hidden md:flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
