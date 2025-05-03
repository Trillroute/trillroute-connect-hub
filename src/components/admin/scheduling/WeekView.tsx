
import React, { useState } from 'react';
import { isSameDay } from 'date-fns';
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
import EventFormDialog from './EventFormDialog';
import WeekViewEvent from './week-view/WeekViewEvent';
import WeekTimeGrid from './week-view/WeekTimeGrid';
import WeekDayHeader from './week-view/WeekDayHeader';
import { calculateEventPosition } from './week-view/weekViewUtils';

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
          <WeekDayHeader key={i} day={day} currentDate={new Date()} />
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
            <WeekTimeGrid 
              hours={hours} 
              day={day} 
              currentDate={new Date()} 
              onCellClick={onCreateEvent} 
            />
            
            {/* Events */}
            <div className="absolute top-0 left-0 right-0">
              {getEventsForDay(day).map((event, eventIndex) => (
                <WeekViewEvent
                  key={eventIndex}
                  event={event}
                  isSelected={selectedEvent?.id === event.id}
                  onSelect={openEventActions}
                  onEdit={handleEdit}
                  onDelete={confirmDelete}
                  style={calculateEventPosition(event)}
                />
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
