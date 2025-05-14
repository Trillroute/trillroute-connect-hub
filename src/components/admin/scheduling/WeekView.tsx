import React, { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import EventFormDialog from './EventFormDialog';
import WeekViewEvent from './week-view/WeekViewEvent';
import WeekTimeGrid from './week-view/WeekTimeGrid';
import WeekDayHeader from './week-view/WeekDayHeader';
import WeekAvailabilitySlots from './week-view/WeekAvailabilitySlots';
import { calculateEventPosition, AvailabilitySlot, isTimeAvailable } from './week-view/weekViewUtils';

interface WeekViewProps {
  onCreateEvent?: () => void;
}

const WeekView: React.FC<WeekViewProps> = ({ onCreateEvent }) => {
  const { currentDate, events, handleUpdateEvent, handleDeleteEvent, availabilities } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  
  // Generate days and hours for the week view
  const weekDays = getWeekDays(currentDate);
  const hours = getHourCells();

  // Process availability data for the week
  useEffect(() => {
    const processAvailabilities = () => {
      const processedSlots: AvailabilitySlot[] = [];
      
      // Process all user availabilities
      Object.entries(availabilities || {}).forEach(([userId, userData]) => {
        if (userData?.slots && Array.isArray(userData.slots)) {
          userData.slots.forEach(slot => {
            if (slot.startTime && slot.endTime && typeof slot.dayOfWeek === 'number') {
              const startTimeParts = slot.startTime.split(':');
              const endTimeParts = slot.endTime.split(':');
              
              if (startTimeParts.length >= 2 && endTimeParts.length >= 2) {
                const startHour = parseInt(startTimeParts[0], 10);
                const startMinute = parseInt(startTimeParts[1], 10);
                const endHour = parseInt(endTimeParts[0], 10);
                const endMinute = parseInt(endTimeParts[1], 10);
                
                processedSlots.push({
                  dayOfWeek: slot.dayOfWeek,
                  startHour,
                  startMinute,
                  endHour,
                  endMinute,
                  userId: slot.user_id || userId,
                  userName: userData.name,
                  category: slot.category || 'General'
                });
              }
            }
          });
        }
      });
      
      setAvailabilitySlots(processedSlots);
    };
    
    processAvailabilities();
  }, [availabilities]);
  
  // Getting events for each day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
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
  
  const handleCellClick = (dayIndex: number, hour: number) => {
    // Only create event if the time slot is available
    if (onCreateEvent && isTimeAvailable(hour, dayIndex, availabilitySlots)) {
      // Store hour in session storage for event creation dialog
      const newEventDate = new Date(weekDays[dayIndex]);
      newEventDate.setHours(hour, 0, 0, 0);
      sessionStorage.setItem('newEventStartTime', newEventDate.toISOString());
      
      const endTime = new Date(newEventDate);
      endTime.setHours(hour + 1, 0, 0, 0);
      sessionStorage.setItem('newEventEndTime', endTime.toISOString());
      
      onCreateEvent();
    }
  };
  
  const handleAvailabilityClick = (slot: AvailabilitySlot) => {
    if (onCreateEvent) {
      // Create a date object for this slot
      const slotDate = new Date(weekDays[slot.dayOfWeek]);
      slotDate.setHours(slot.startHour, slot.startMinute, 0, 0);
      
      const endDate = new Date(weekDays[slot.dayOfWeek]);
      endDate.setHours(slot.endHour, slot.endMinute, 0, 0);
      
      // Store data for event creation
      sessionStorage.setItem('newEventStartTime', slotDate.toISOString());
      sessionStorage.setItem('newEventEndTime', endDate.toISOString());
      sessionStorage.setItem('newEventTitle', `Session with ${slot.userName || 'Instructor'}`);
      
      onCreateEvent();
    }
  };
  
  // Get availability class for a cell
  const getAvailabilityClass = (dayIndex: number, hour: number) => {
    const isAvailable = isTimeAvailable(hour, dayIndex, availabilitySlots);
    const isToday = isSameDay(weekDays[dayIndex], new Date());
    
    if (isAvailable) {
      return `cursor-pointer hover:bg-blue-50 ${isToday ? 'bg-blue-50/50' : ''}`;
    } else {
      return 'bg-gray-100 cursor-not-allowed';
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Day headers */}
      <div className="flex border-b">
        {/* Corner cell */}
        <div className="w-16 border-r border-gray-200 bg-white">
          <div className="text-xs text-gray-500 h-12 flex items-center justify-center">
            Hours
          </div>
        </div>
        
        {/* Day headers */}
        {weekDays.map((day, i) => (
          <WeekDayHeader key={i} day={day} />
        ))}
      </div>
      
      {/* Scrollable content container */}
      <ScrollArea className="h-[calc(100%-48px)] flex-grow">
        <div className="relative min-h-[720px]"> {/* Ensure minimum height for content */}
          {/* Time grid with events */}
          <WeekTimeGrid
            hours={hours}
            weekDays={weekDays}
            onCellClick={handleCellClick}
            getAvailabilityClass={getAvailabilityClass}
          />
          
          {/* Day columns with events and availability slots */}
          <div className="absolute top-0 left-16 right-0 bottom-0">
            {weekDays.map((day, dayIndex) => (
              <div 
                key={dayIndex} 
                className="absolute top-0 bottom-0"
                style={{
                  left: `${(dayIndex * 100) / weekDays.length}%`,
                  width: `${100 / weekDays.length}%`
                }}
              >
                {/* Availability slots */}
                <WeekAvailabilitySlots
                  availabilitySlots={availabilitySlots}
                  dayIndex={dayIndex}
                  onAvailabilityClick={handleAvailabilityClick}
                />
                
                {/* Events */}
                {getEventsForDay(day).map((event, eventIndex) => (
                  <WeekViewEvent
                    key={`${eventIndex}-${event.id}`}
                    event={event}
                    isSelected={selectedEvent?.id === event.id}
                    onSelect={openEventActions}
                    onEdit={handleEdit}
                    onDelete={confirmDelete}
                    style={calculateEventPosition(event)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

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
