
import React from 'react';
import { CalendarEvent } from './context/calendarTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EventForm from './EventForm';

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
      </DialogContent>
    </Dialog>
  );
};

export default EventFormDialog;
