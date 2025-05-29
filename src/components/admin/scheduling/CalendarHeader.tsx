
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import CalendarTitle from './components/CalendarTitle';
import ViewModeSelector, { ViewOption } from './components/ViewModeSelector';
import { useCalendar } from './context/CalendarContext';

interface CalendarHeaderProps {
  onCreateEvent: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onCreateEvent }) => {
  const { viewMode, setViewMode, currentDate, handleDateSelect } = useCalendar();

  const viewOptions: ViewOption[] = [
    { value: 'day', label: 'Day View' },
    { value: 'week', label: 'Week View' },
    { value: 'list', label: 'List View' },
    { value: 'legacy', label: 'Legacy View' }
  ];
  
  const handleViewModeChange = (mode: string) => {
    console.log('Setting view mode from header:', mode);
    setViewMode(mode);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 py-2">
      <CalendarTitle viewMode={viewMode} currentDate={currentDate} />
      
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "justify-start text-left font-normal",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              {format(currentDate, "MMM dd, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={handleDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <ViewModeSelector 
          viewMode={viewMode} 
          setViewMode={handleViewModeChange} 
          viewOptions={viewOptions}
        />
        <Button 
          onClick={onCreateEvent}
          className="bg-primary text-white hover:bg-primary-darker"
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
