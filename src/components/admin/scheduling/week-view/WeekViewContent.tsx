
import React from 'react';
import { CalendarEvent } from '../context/calendarTypes';
import { AvailabilitySlot } from './weekViewUtils';
import WeekTimeGrid from './WeekTimeGrid';

interface WeekViewContentProps {
  hours: number[];
  weekDays: Date[];
  events: CalendarEvent[];
  availabilitySlots: AvailabilitySlot[];
  selectedEvent: CalendarEvent | null;
  openEventActions: (event: CalendarEvent) => void;
  handleCellClick: (dayIndex: number, hour: number) => void;
  handleAvailabilityClick: (slot: AvailabilitySlot) => void;
  handleEdit: (event: CalendarEvent) => void;
  confirmDelete: (event: CalendarEvent) => void;
}

const WeekViewContent: React.FC<WeekViewContentProps> = ({
  hours,
  weekDays,
  events,
  availabilitySlots,
  selectedEvent,
  openEventActions,
  handleCellClick,
  handleAvailabilityClick,
  handleEdit,
  confirmDelete
}) => {
  console.log('WeekViewContent: Rendering with events:', events.length);
  console.log('WeekViewContent: Events details:', events);
  console.log('WeekViewContent: Week days:', weekDays);
  
  return (
    <div className="flex-1 overflow-auto">
      <WeekTimeGrid
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
    </div>
  );
};

export default WeekViewContent;
