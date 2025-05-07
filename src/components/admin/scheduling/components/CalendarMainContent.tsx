
import React, { useState } from 'react';
import CalendarHeader from '../CalendarHeader';
import CalendarSidebar from '../CalendarSidebar';
import EventListView from '../EventListView';
import CalendarViewRenderer from '../CalendarViewRenderer';
import { useCalendar } from '../context/CalendarContext';
import CalendarTitle from './CalendarTitle';
import { useEventHandlers } from './EventHandlers';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface CalendarMainContentProps {
  hasAdminAccess?: boolean;
}

const CalendarMainContent: React.FC<CalendarMainContentProps> = ({
  hasAdminAccess = false
}) => {
  const [showEventList, setShowEventList] = useState(false);
  const { 
    currentDate, 
    viewMode, 
    setViewMode,
    isCreateEventOpen, 
    setIsCreateEventOpen
  } = useCalendar();
  
  const { 
    handleCreateEventClick, 
    handleEditEvent, 
    handleDeleteEvent, 
    handleDateClick 
  } = useEventHandlers();

  const viewOptions = [
    { value: 'month', label: 'Month View' },
    { value: 'week', label: 'Week View' },
    { value: 'day', label: 'Day View' },
  ];

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader 
        title={
          <CalendarTitle viewMode={viewMode} currentDate={currentDate} />
        }
        showEventListToggle={true}
        onToggleEventList={() => setShowEventList(!showEventList)}
        isEventListShown={showEventList}
        hasAdminAccess={hasAdminAccess}
      />
      
      <div className="flex px-4 py-2 border-b">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {viewOptions.find(opt => opt.value === viewMode)?.label || 'Select View'}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {viewOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => setViewMode(option.value as any)}
                className={viewMode === option.value ? "bg-gray-100" : ""}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <CalendarSidebar />
        
        <div className="flex-1 overflow-auto">
          {showEventList ? (
            <EventListView 
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <CalendarViewRenderer 
              viewMode={viewMode}
              showEventList={showEventList}
              onCreateEvent={() => setIsCreateEventOpen(true)}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onDateClick={handleDateClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarMainContent;
