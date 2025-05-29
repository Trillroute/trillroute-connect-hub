
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm from './EventForm';  // Changed from { EventForm } to EventForm
import { CalendarEvent } from './context/calendarTypes';
import { addMinutes } from 'date-fns';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => void;
  startDate?: Date;
}

interface AvailabilitySlot {
  dayOfWeek?: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  userId: string;
  userName?: string;
  category: string;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  startDate = new Date(),
}) => {
  const [initialEvent, setInitialEvent] = useState<Omit<CalendarEvent, 'id'>>({
    title: '',
    description: '',
    location: '',
    start: startDate,
    end: addMinutes(startDate, 60),
    color: '#4285F4'
  });

  useEffect(() => {
    if (open) {
      // Check for start and end time data in session storage
      const startTimeStr = sessionStorage.getItem('newEventStartTime');
      const endTimeStr = sessionStorage.getItem('newEventEndTime');
      const titleStr = sessionStorage.getItem('newEventTitle');
      
      let eventStart = startDate;
      let eventEnd = addMinutes(startDate, 60);
      let eventTitle = '';
      
      // Use session storage times if available
      if (startTimeStr) {
        eventStart = new Date(startTimeStr);
        sessionStorage.removeItem('newEventStartTime');
      }
      
      if (endTimeStr) {
        eventEnd = new Date(endTimeStr);
        sessionStorage.removeItem('newEventEndTime');
      }
      
      if (titleStr) {
        eventTitle = titleStr;
        sessionStorage.removeItem('newEventTitle');
      }
      
      // Check for availability slot data in session storage
      const availabilitySlotData = sessionStorage.getItem('availabilitySlot');
      if (availabilitySlotData) {
        try {
          const slot: AvailabilitySlot = JSON.parse(availabilitySlotData);
          
          // Use the slot data to override the title if not already set
          if (!eventTitle) {
            eventTitle = `${slot.category} - ${slot.userName || 'Available Slot'}`;
          }
          
          // Clear the session storage item
          sessionStorage.removeItem('availabilitySlot');
        } catch (error) {
          console.error('Error parsing availability slot data:', error);
        }
      }
      
      // Set the initial event data
      setInitialEvent({
        title: eventTitle,
        description: eventTitle ? `Created from an available time slot` : '',
        location: '',
        start: eventStart,
        end: eventEnd,
        color: eventTitle ? '#4CAF50' : '#4285F4' // Green color for events created from availability slots
      });
    }
  }, [open, startDate]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Add a new event to your calendar.
          </DialogDescription>
        </DialogHeader>
        <EventForm 
          initialData={initialEvent as any} // Temporary type cast to fix the type error
          onSubmit={onSave} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
