
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

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  initialEvent?: Omit<CalendarEvent, 'id'>;
  mode: 'create' | 'edit';
}

const EventFormDialog: React.FC<EventFormDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  initialEvent,
  mode
}) => {
  const defaultValues: EventFormValues = {
    title: '',
    description: '',
    location: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    color: '#4285F4',
  };

  const initialValues = initialEvent 
    ? {
        title: initialEvent.title,
        description: initialEvent.description || '',
        location: initialEvent.location || '',
        date: initialEvent.start,
        startTime: `${initialEvent.start.getHours().toString().padStart(2, '0')}:${initialEvent.start.getMinutes().toString().padStart(2, '0')}`,
        endTime: `${initialEvent.end.getHours().toString().padStart(2, '0')}:${initialEvent.end.getMinutes().toString().padStart(2, '0')}`,
        color: initialEvent.color || '#4285F4',
      }
    : defaultValues;
  
  const handleSubmit = (values: EventFormValues) => {
    // Create start and end date objects from date and times
    const [startHour, startMinute] = values.startTime.split(':').map(Number);
    const [endHour, endMinute] = values.endTime.split(':').map(Number);
    
    const start = new Date(values.date);
    start.setHours(startHour, startMinute);
    
    const end = new Date(values.date);
    end.setHours(endHour, endMinute);
    
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: values.title,
      description: values.description,
      location: values.location,
      start,
      end,
      color: values.color,
    };
    
    onSave(eventData);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Event' : 'Edit Event'}
          </DialogTitle>
        </DialogHeader>
        
        <EventForm 
          initialData={initialEvent as CalendarEvent} 
          onSubmit={onSave}
          onCancel={handleCancel} 
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form="event-form">
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
