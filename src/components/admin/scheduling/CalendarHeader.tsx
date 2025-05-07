
import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCalendar } from './context/CalendarContext';

interface CalendarHeaderProps {
  title: string;
  showEventListToggle?: boolean;
  onToggleEventList?: () => void;
  isEventListShown?: boolean;
  hasAdminAccess?: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  showEventListToggle = false,
  onToggleEventList,
  isEventListShown = false,
  hasAdminAccess = false
}) => {
  const { 
    viewMode, 
    setViewMode, 
    goToToday, 
    goToPrevious, 
    goToNext, 
    isCreateEventOpen
  } = useCalendar();

  return (
    <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
        <h3 className="text-lg font-semibold ml-2">{title}</h3>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as 'day' | 'week' | 'month')}>
          <TabsList className="grid grid-cols-3 w-[240px]">
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>

        {showEventListToggle && (
          <Button 
            variant={isEventListShown ? "default" : "outline"} 
            size="icon" 
            onClick={onToggleEventList}
            className={isEventListShown ? "bg-primary text-primary-foreground" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CalendarHeader;
