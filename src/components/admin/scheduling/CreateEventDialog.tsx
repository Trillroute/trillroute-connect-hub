
import React from 'react';
import { CalendarEvent } from './types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import EventForm, { EventFormValues } from './EventForm';
import { useCalendar } from './CalendarContext';

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  startDate: Date;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  startDate,
}) => {
  const initialValues: EventFormValues = {
    title: '',
    description: '',
    location: '',
    date: startDate,
    startTime: '09:00',
    endTime: '10:00',
    color: '#4285F4',
  };
  
  const handleSubmit = (values: EventFormValues) => {
    // Create start and end date objects from date and times
    const [startHour, startMinute] = values.startTime.split(':').map(Number);
    const [endHour, endMinute] = values.endTime.split(':').map(Number);
    
    const start = new Date(values.date);
    start.setHours(startHour, startMinute);
    
    const end = new Date(values.date);
    end.setHours(endHour, endMinute);
    
    const newEvent: Omit<CalendarEvent, 'id'> = {
      title: values.title,
      description: values.description,
      location: values.location,
      start,
      end,
      color: values.color,
    };
    
    onSave(newEvent);
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        
        <EventForm 
          initialValues={initialValues} 
          onSubmit={handleSubmit}
          onCancel={handleCancel} 
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form="event-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
