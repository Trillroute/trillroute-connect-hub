
import React from 'react';
import { CalendarEvent } from './types';
import EventFormDialog from './EventFormDialog';

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
  const initialEvent: Omit<CalendarEvent, 'id'> = {
    title: '',
    description: '',
    location: '',
    start: startDate,
    end: new Date(new Date(startDate).setHours(startDate.getHours() + 1)),
    color: '#4285F4',
  };

  return (
    <EventFormDialog
      open={open}
      onOpenChange={onOpenChange}
      onSave={onSave}
      initialEvent={initialEvent}
      mode="create"
    />
  );
};

export default CreateEventDialog;
