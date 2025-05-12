import React, { useState, useEffect } from 'react';
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
import { calculateEventPosition } from './week-view/weekViewUtils';

interface WeekViewProps {
  onCreateEvent?: () => void;
}

interface AvailabilitySlot {
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  userId: string;
  userName?: string;
  category: string;
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
      Object.entries(availabilities).forEach(([userId, userData]) => {
        userData.slots.forEach(slot => {
          const [startHour, startMinute] = slot.startTime.split(':').map(Number);
          const [endHour, endMinute] = slot.endTime.split(':').map(Number);
          
          processedSlots.push({
            dayOfWeek: slot.dayOfWeek,
            startHour,
            startMinute,
            endHour,
            endMinute,
            userId: slot.userId,
            userName: userData.name,
            category: slot.category
          });
        });
      });
      
      setAvailabilitySlots(processedSlots);
    };
    
    processAvailabilities();
  }, [availabilities]);
  
  // Getting events for each day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.start, date)
    );
  };

  // Get availability for a specific day of the week
  const getAvailabilityForDay = (dayOfWeek: number) => {
    return availabilitySlots.filter(slot => slot.dayOfWeek === dayOfWeek);
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
    if (onCreateEvent && isTimeAvailable(hour, dayIndex)) {
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

  // Get color based on category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'session':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'break':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'office':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'meeting':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'class setup':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'qc':
        return 'bg-pink-100 border-pink-300 text-pink-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Render an availability slot
  const renderAvailabilitySlot = (slot: AvailabilitySlot, dayIndex: number) => {
    const startPercentage = ((slot.startHour - 7) + slot.startMinute / 60) * 60; // 60px per hour
    const duration = (slot.endHour - slot.startHour) + (slot.endMinute - slot.startMinute) / 60;
    const height = duration * 60; // 60px per hour
    
    return (
      <div
        key={`avail-${dayIndex}-${slot.startHour}-${slot.startMinute}-${slot.userId}`}
        className={`absolute left-1 right-1 rounded px-2 py-1 border overflow-hidden text-sm group cursor-pointer hover:opacity-90 z-10 ${getCategoryColor(slot.category)}`}
        style={{
          top: `${startPercentage}px`,
          height: `${height}px`,
        }}
        onClick={() => handleAvailabilityClick(slot)}
      >
        <div className="flex justify-between">
          <span className="font-semibold group-hover:underline">
            {slot.userName ? `${slot.userName}` : 'Available'}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/50">
            {slot.category}
          </span>
        </div>
        <div className="text-xs opacity-90">
          {`${slot.startHour}:${slot.startMinute.toString().padStart(2, '0')} - ${slot.endHour}:${slot.endMinute.toString().padStart(2, '0')}`}
        </div>
      </div>
    );
  };

  // Check if a time slot has availability for a specific day
  const isTimeAvailable = (hour: number, dayOfWeek: number) => {
    return availabilitySlots.some(slot => 
      slot.dayOfWeek === dayOfWeek && (slot.startHour <= hour && slot.endHour > hour)
    );
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
                    isTimeAvailable(hour, dayIndex) 
                      ? 'cursor-pointer hover:bg-blue-50' 
                      : 'bg-gray-300 cursor-not-allowed'
                  } ${isSameDay(day, new Date()) ? 'bg-blue-50' : ''}`}
                  onClick={() => handleCellClick(dayIndex, hour)}
                  aria-disabled={!isTimeAvailable(hour, dayIndex)}
                ></div>
              ))}
            </div>
            
            {/* Availability slots */}
            <div className="absolute top-0 left-0 right-0">
              {getAvailabilityForDay(dayIndex).map((slot, slotIndex) => 
                renderAvailabilitySlot(slot, slotIndex)
              )}
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
