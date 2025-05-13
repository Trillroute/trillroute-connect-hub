
import React, { useState, useEffect, useMemo } from 'react';
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
}

const WeekView: React.FC<WeekViewProps> = ({ onCreateEvent }) => {
  const { currentDate, events, handleUpdateEvent, handleDeleteEvent, availabilities } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  
  // Generate days and hours for the week view
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const hours = getHourCells();

  // Debug data
  useEffect(() => {
    console.log("WeekView rendered with:", {
      eventCount: events?.length || 0,
      availabilityCount: Object.keys(availabilities || {})?.length || 0,
      weekDays: weekDays?.length || 0,
    });
  }, [events, availabilities, weekDays]);

  // Process availability data for the week
  useEffect(() => {
    const processAvailabilities = () => {
      if (!availabilities || Object.keys(availabilities).length === 0) {
        console.log("No availability data to process in WeekView");
        setAvailabilitySlots([]);
        return;
      }
      
      const processedSlots: AvailabilitySlot[] = [];
      
      try {
        // Process all user availabilities
        Object.entries(availabilities).forEach(([userId, userData]) => {
          if (!userData || !userData.slots || !Array.isArray(userData.slots)) {
            console.log(`No valid slots for user ${userId}`);
            return;
          }
          
          userData.slots.forEach(slot => {
            if (slot.dayOfWeek === undefined || !slot.startTime || !slot.endTime) {
              console.warn("Invalid slot data:", slot);
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
              console.error("Error processing slot time:", err, slot);
            }
          });
        });
        
        console.log(`Processed ${processedSlots.length} availability slots`);
        setAvailabilitySlots(processedSlots);
      } catch (err) {
        console.error("Error processing availability data:", err);
        setAvailabilitySlots([]);
      }
    };
    
    processAvailabilities();
  }, [availabilities]);
  
  // Getting events for each day
  const getEventsForDay = (date: Date) => {
    if (!events || !Array.isArray(events)) return [];
    
    return events.filter(event => {
      if (!event || !event.start) return false;
      
      const eventStart = event.start instanceof Date ? event.start : new Date(event.start);
      return isSameDay(eventStart, date);
    });
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
      onCreateEvent();
    }
  };
  
  const handleAvailabilityClick = (slot: AvailabilitySlot) => {
    if (onCreateEvent) {
      // Store slot data in session storage for the create event dialog to use
      sessionStorage.setItem('availabilitySlot', JSON.stringify(slot));
      onCreateEvent();
    }
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
      <div className="flex h-[calc(100%-48px)]">
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
            {/* Hour cells - with improved availability indication */}
            <div>
              {hours.map(hour => (
                <div
                  key={hour}
                  className={`h-[60px] border-b border-r border-gray-200 ${
                    isTimeAvailable(hour, dayIndex, availabilitySlots) 
                      ? 'cursor-pointer hover:bg-blue-50' 
                      : 'bg-gray-50 cursor-not-allowed'
                  } ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}
                  onClick={() => handleCellClick(dayIndex, hour)}
                  aria-disabled={!isTimeAvailable(hour, dayIndex, availabilitySlots)}
                ></div>
              ))}
            </div>
            
            {/* Availability slots */}
            <div className="absolute top-0 left-0 right-0">
              <WeekAvailabilitySlots 
                availabilitySlots={availabilitySlots}
                dayIndex={dayIndex}
                onAvailabilityClick={handleAvailabilityClick}
              />
            </div>
            
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
