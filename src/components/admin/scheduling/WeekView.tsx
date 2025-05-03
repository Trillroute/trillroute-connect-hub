
import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { useCalendar } from './CalendarContext';
import { getWeekDays, getHourCells } from './calendarUtils';
import { CalendarEvent } from './types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from 'lucide-react';
import EventFormDialog from './EventFormDialog';

interface WeekViewProps {
  onCreateEvent: () => void;
}

const WeekView: React.FC<WeekViewProps> = ({ onCreateEvent }) => {
  const { currentDate, events, handleUpdateEvent, handleDeleteEvent } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Generate days and hours for the week view
  const weekDays = getWeekDays(currentDate);
  const hours = getHourCells();
  
  // Getting events for each day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.start, date)
    );
  };
  
  // Position calculation for events
  const calculateEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();
    
    const startPercentage = ((startHour - 7) + startMinute / 60) * 60; // 60px per hour
    const duration = (endHour - startHour) + (endMinute - startMinute) / 60;
    const height = duration * 60; // 60px per hour
    
    return {
      top: `${startPercentage}px`,
      height: `${height}px`,
      backgroundColor: event.color || '#4285F4',
    };
  };

  const openEventActions = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      handleUpdateEvent(selectedEvent.id, eventData);
    }
    setIsEditDialogOpen(false);
  };

  const confirmDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEvent) {
      handleDeleteEvent(selectedEvent.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="relative h-full">
      {/* Time column */}
      <div className="flex">
        {/* Corner cell */}
        <div className="w-16 border-b border-r border-gray-200 bg-white">
          <div className="text-xs text-gray-500 h-12 flex items-center justify-center">
            GMT+05:30
          </div>
        </div>
        
        {/* Day headers */}
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`flex-1 border-b border-r border-gray-200 h-12 ${
              isSameDay(day, new Date()) ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-xs uppercase text-gray-500">{format(day, 'EEE')}</div>
              <div className={`text-base font-medium ${
                isSameDay(day, new Date()) ? 'text-blue-600' : ''
              }`}>
                {format(day, 'd')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Time grid */}
      <div className="flex overflow-y-auto" style={{ height: 'calc(100% - 48px)' }}>
        {/* Time labels */}
        <div className="w-16 flex-shrink-0">
          {hours.map(hour => (
            <div 
              key={hour} 
              className="relative h-[60px] border-b border-r border-gray-200"
            >
              <div className="absolute -top-3 right-2 text-xs text-gray-500">
                {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour-12} PM`}
              </div>
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {weekDays.map((day, dayIndex) => (
          <div 
            key={dayIndex} 
            className="flex-1 relative"
          >
            {/* Hour cells */}
            {hours.map(hour => (
              <div
                key={hour}
                className={`h-[60px] border-b border-r border-gray-200 ${
                  isSameDay(day, new Date()) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onCreateEvent()}
              ></div>
            ))}
            
            {/* Events */}
            <div className="absolute top-0 left-0 right-0">
              {getEventsForDay(day).map((event, eventIndex) => (
                <div
                  key={eventIndex}
                  className="absolute left-1 right-1 rounded px-2 py-1 text-white overflow-hidden text-sm group cursor-pointer"
                  style={calculateEventPosition(event)}
                  onClick={() => openEventActions(event)}
                >
                  <div className="font-semibold group-hover:underline">{event.title}</div>
                  <div className="text-xs opacity-90">
                    {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                  </div>
                  {selectedEvent?.id === event.id && (
                    <div className="absolute top-1 right-1 flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-5 w-5 bg-white/20 hover:bg-white/40"
                        onClick={(e) => { 
                          e.stopPropagation();
                          handleEdit();
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-5 w-5 bg-white/20 hover:bg-white/40"
                        onClick={(e) => { 
                          e.stopPropagation();
                          confirmDelete();
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Event Dialog */}
      {selectedEvent && (
        <EventFormDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
          initialEvent={{
            title: selectedEvent.title,
            description: selectedEvent.description,
            location: selectedEvent.location,
            start: selectedEvent.start,
            end: selectedEvent.end,
            color: selectedEvent.color || '#4285F4'
          }}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WeekView;
