
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { isSameDay, format } from 'date-fns';
import { useCalendar } from './context/CalendarContext';
import { getWeekDays, getHourCells } from './calendarUtils';
import { CalendarEvent } from './context/calendarTypes';
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
import WeekAvailabilitySlots from './week-view/WeekAvailabilitySlots';
import { calculateEventPosition, AvailabilitySlot, isTimeAvailable } from './week-view/weekViewUtils';

interface WeekViewProps {
  onCreateEvent?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ onCreateEvent, onEditEvent, onDeleteEvent }) => {
  const { currentDate, events, handleUpdateEvent, handleDeleteEvent, availabilities } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  
  // Generate days and hours for the week view - memoized to avoid recalculation
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const hours = useMemo(() => getHourCells(), []);

  // Process availability data for the week - memoized
  useEffect(() => {
    const processAvailabilities = () => {
      if (!availabilities || Object.keys(availabilities).length === 0) {
        setAvailabilitySlots([]);
        return;
      }
      
      try {
        const processedSlots: AvailabilitySlot[] = [];
        
        // Process all user availabilities
        Object.entries(availabilities).forEach(([userId, userData]) => {
          if (!userData || !userData.slots || !Array.isArray(userData.slots)) {
            return;
          }
          
          userData.slots.forEach(slot => {
            if (slot.dayOfWeek === undefined || !slot.startTime || !slot.endTime) {
              return;
            }
            
            try {
              const [startHour, startMinute] = slot.startTime.split(':').map(Number);
              const [endHour, endMinute] = slot.endTime.split(':').map(Number);
              
              processedSlots.push({
                dayOfWeek: slot.dayOfWeek,
                startHour,
                startMinute: startMinute || 0,
                endHour,
                endMinute: endMinute || 0,
                userId: userId,
                userName: userData.name || 'Staff',
                category: slot.category || 'Session'
              });
            } catch (err) {
              console.error("Error processing slot time:", err);
            }
          });
        });
        
        setAvailabilitySlots(processedSlots);
      } catch (err) {
        console.error("Error processing availability data:", err);
        setAvailabilitySlots([]);
      }
    };
    
    processAvailabilities();
  }, [availabilities]);
  
  // Event handlers - memoized with useCallback
  const handleEdit = useCallback(() => {
    setIsEditDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      handleUpdateEvent(selectedEvent.id, eventData);
    }
    setIsEditDialogOpen(false);
  }, [selectedEvent, handleUpdateEvent]);

  const confirmDelete = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedEvent) {
      handleDeleteEvent(selectedEvent.id);
    }
    setIsDeleteDialogOpen(false);
    setSelectedEvent(null);
  }, [selectedEvent, handleDeleteEvent]);
  
  const handleAvailabilityClick = useCallback((slot: AvailabilitySlot) => {
    if (onCreateEvent) {
      // Store slot data in session storage for the create event dialog to use
      sessionStorage.setItem('availabilitySlot', JSON.stringify(slot));
      onCreateEvent();
    }
  }, [onCreateEvent]);

  // Use provided event handlers when available
  const handleEditEvent = useCallback((event: CalendarEvent) => {
    if (onEditEvent) {
      onEditEvent(event);
    } else {
      setSelectedEvent(event);
      setIsEditDialogOpen(true);
    }
  }, [onEditEvent]);

  const handleDeleteEventClick = useCallback((event: CalendarEvent) => {
    if (onDeleteEvent) {
      onDeleteEvent(event);
    } else {
      setSelectedEvent(event);
      setIsDeleteDialogOpen(true);
    }
  }, [onDeleteEvent]);

  // Filter valid events
  const validEvents = useMemo(() => {
    return events.filter(event => {
      if (!event || !event.start || !event.end) {
        return false;
      }
      return true;
    });
  }, [events]);

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
      <WeekTimeGrid
        days={weekDays}
        onCreateEvent={onCreateEvent}
        onEditEvent={onEditEvent || handleEditEvent}
        onDeleteEvent={onDeleteEvent || handleDeleteEventClick}
      />

      {/* Edit Event Dialog - only show if we're handling editing internally */}
      {!onEditEvent && selectedEvent && (
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

      {/* Delete Confirmation Dialog - only show if we're handling deletion internally */}
      {!onDeleteEvent && (
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
      )}
    </div>
  );
};

export default WeekView;
