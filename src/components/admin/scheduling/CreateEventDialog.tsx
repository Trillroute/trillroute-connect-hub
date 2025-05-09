
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from './EventForm';
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
    // Check for availability slot data in session storage
    const availabilitySlotData = sessionStorage.getItem('availabilitySlot');
    if (availabilitySlotData) {
      try {
        const slot: AvailabilitySlot = JSON.parse(availabilitySlotData);
        
        // Create a new date object for start time
        const startDateTime = new Date(startDate);
        startDateTime.setHours(slot.startHour, slot.startMinute, 0, 0);
        
        // Create a new date object for end time
        const endDateTime = new Date(startDate);
        endDateTime.setHours(slot.endHour, slot.endMinute, 0, 0);
        
        // Set the initial event data based on the availability slot
        setInitialEvent({
          title: `${slot.category} - ${slot.userName || 'Available Slot'}`,
          description: `Created from an available time slot for ${slot.userName || 'user'}`,
          location: '',
          start: startDateTime,
          end: endDateTime,
          color: '#4CAF50' // Green color for events created from availability slots
        });
        
        // Clear the session storage item
        sessionStorage.removeItem('availabilitySlot');
      } catch (error) {
        console.error('Error parsing availability slot data:', error);
      }
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
          initialEvent={initialEvent} 
          onSave={onSave} 
          onCancel={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
