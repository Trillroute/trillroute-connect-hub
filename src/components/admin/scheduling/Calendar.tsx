
import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, addWeeks, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import MiniCalendar from './MiniCalendar';
import WeekView from './WeekView';
import CalendarHeader from './CalendarHeader';
import { useToast } from '@/hooks/use-toast';
import CreateEventDialog from './CreateEventDialog';

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  color?: string;
};

const SchedulingCalendar = () => {
  // State for calendar view
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const { toast } = useToast();

  // Example events - would be replaced with API data in a real implementation
  useEffect(() => {
    const today = new Date();
    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Piano Lesson',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
        color: '#4285F4'
      },
      {
        id: '2',
        title: 'Guitar Class',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 14, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 30),
        color: '#0F9D58'
      },
      {
        id: '3',
        title: 'Violin Recital',
        start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
        end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 18, 0),
        color: '#F4B400'
      },
    ];
    setEvents(sampleEvents);
  }, []);

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goToPrevious = () => {
    if (viewMode === 'day') {
      setCurrentDate(prev => addDays(prev, -1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, -1));
    } else {
      // Month logic would go here
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }
  };
  
  const goToNext = () => {
    if (viewMode === 'day') {
      setCurrentDate(prev => addDays(prev, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      // Month logic would go here
      setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }
  };

  // Title string based on current view
  const calendarTitle = () => {
    if (viewMode === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      
      // If same month
      if (start.getMonth() === end.getMonth()) {
        return `${format(start, 'MMMM')} ${format(start, 'yyyy')}`;
      }
      // If different months
      return `${format(start, 'MMM')} – ${format(end, 'MMM')} ${format(end, 'yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy');
  };

  // Event handlers
  const handleCreateEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
    };
    
    setEvents(prev => [...prev, newEvent]);
    setIsCreateEventOpen(false);
    
    toast({
      title: "Event created",
      description: `"${newEvent.title}" has been added to your schedule.`,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] md:h-[calc(100vh-120px)]">
      {/* Main calendar header */}
      <CalendarHeader 
        title={calendarTitle()}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onToday={goToToday}
      />
      
      {/* Calendar body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="hidden md:flex flex-col w-56 p-4 border-r border-gray-200 bg-white">
          <Button 
            className="flex items-center gap-2 mb-4 shadow-sm" 
            onClick={() => setIsCreateEventOpen(true)}
          >
            <Plus size={18} />
            <span>Create</span>
          </Button>
          
          <MiniCalendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center justify-between">
              My calendars
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </h3>
            <div className="space-y-1">
              <div className="flex items-center">
                <input type="checkbox" id="mycal" className="rounded text-blue-500" checked />
                <label htmlFor="mycal" className="ml-2 text-sm">My Schedule</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="classes" className="rounded text-green-500" checked />
                <label htmlFor="classes" className="ml-2 text-sm">Classes</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="events" className="rounded text-yellow-500" checked />
                <label htmlFor="events" className="ml-2 text-sm">Events</label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calendar view */}
        <div className="flex-1 overflow-auto">
          <WeekView 
            currentDate={currentDate} 
            events={events}
            onCreateEvent={() => setIsCreateEventOpen(true)}
          />
        </div>
      </div>

      {/* Create event dialog */}
      <CreateEventDialog 
        open={isCreateEventOpen} 
        onOpenChange={setIsCreateEventOpen} 
        onSave={handleCreateEvent}
        startDate={currentDate}
      />
    </div>
  );
};

export default SchedulingCalendar;
