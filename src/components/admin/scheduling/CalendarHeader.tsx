
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Search, Settings } from 'lucide-react';
import { useCalendar } from './CalendarContext';

interface CalendarHeaderProps {
  title: string;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
}) => {
  const { viewMode, setViewMode, goToPrevious, goToNext, goToToday } = useCalendar();
  
  return (
    <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={goToToday}
          className="text-sm"
        >
          Today
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToPrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <div className="relative">
          <Select
            value={viewMode}
            onValueChange={(value) => setViewMode(value as 'day' | 'week' | 'month')}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
