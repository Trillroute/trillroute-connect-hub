
import React from 'react';
import { useCalendar } from './context/CalendarContext';
import { getWeekDays, getHourCells } from './calendarUtils';
import { CalendarEvent } from './context/calendarTypes';
import { AvailabilitySlot, isTimeAvailable } from './week-view/weekViewUtils';
import WeekViewLayout from './week-view/WeekViewLayout';
import WeekViewContent from './week-view/WeekViewContent';
import WeekViewEventDialogs from './week-view/WeekViewEventDialogs';
import { useWeekView } from './week-view/useWeekView';
import { handleAvailabilitySlotClick } from './utils/availabilitySlotHandlers';

interface WeekViewProps {
  onCreateEvent?: () => void;
}

const WeekView: React.FC<WeekViewProps> = ({ onCreateEvent }) => {
  const { currentDate, events, handleUpdateEvent, handleDeleteEvent, availabilities } = useCalendar();
  
  // Add detailed logging for week view
  console.log('WeekView: Rendering with current date:', currentDate);
  console.log('WeekView: Events received from context:', events);
  console.log('WeekView: Number of events:', events.length);
  
  events.forEach((event, index) => {
    console.log(`WeekView: Event ${index + 1}:`, {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      startType: typeof event.start,
      endType: typeof event.end,
      startValid: event.start instanceof Date && !isNaN(event.start.getTime()),
      endValid: event.end instanceof Date && !isNaN(event.end.getTime())
    });
  });
  
  // Generate days and hours for the week view
  const weekDays = getWeekDays(currentDate);
  const hours = getHourCells();

  console.log('WeekView: Week days:', weekDays.map(d => d.toDateString()));
  console.log('WeekView: Hours:', hours);

  // Custom hook for week view state and handlers
  const {
    selectedEvent,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen, 
    availabilitySlots,
    openEventActions,
    handleEdit,
    confirmDelete,
    clearSelectedEvent
  } = useWeekView(availabilities, events, handleUpdateEvent, handleDeleteEvent);
  
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
      // First use the shared handler to store availability information
      handleAvailabilitySlotClick(slot);
      
      // Then create a date object for this slot
      const slotDate = new Date(weekDays[slot.dayOfWeek]);
      slotDate.setHours(slot.startHour, slot.startMinute, 0, 0);
      
      const endDate = new Date(weekDays[slot.dayOfWeek]);
      endDate.setHours(slot.endHour, slot.endMinute, 0, 0);
      
      // Store additional data for event creation
      sessionStorage.setItem('newEventStartTime', slotDate.toISOString());
      sessionStorage.setItem('newEventEndTime', endDate.toISOString());
      
      onCreateEvent();
    }
  };

  return (
    <WeekViewLayout weekDays={weekDays}>
      <WeekViewContent
        hours={hours}
        weekDays={weekDays}
        events={events}
        availabilitySlots={availabilitySlots}
        selectedEvent={selectedEvent}
        openEventActions={openEventActions}
        handleCellClick={handleCellClick}
        handleAvailabilityClick={handleAvailabilityClick}
        handleEdit={handleEdit}
        confirmDelete={confirmDelete}
      />

      <WeekViewEventDialogs
        selectedEvent={selectedEvent}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleUpdateEvent={handleUpdateEvent}
        handleDeleteEvent={handleDeleteEvent}
        onDeleteSuccess={clearSelectedEvent}
      />
    </WeekViewLayout>
  );
};

export default WeekView;
