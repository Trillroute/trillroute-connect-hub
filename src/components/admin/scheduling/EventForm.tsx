
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import EventColorPicker from './EventColorPicker';
import { CalendarEvent } from './types';

export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  date: Date;
  startTime: string;
  endTime: string;
  color: string;
}

interface EventFormProps {
  initialValues: EventFormValues;
  onSubmit: (values: EventFormValues) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [location, setLocation] = useState(initialValues.location);
  const [date, setDate] = useState<Date>(initialValues.date);
  const [startTime, setStartTime] = useState(initialValues.startTime);
  const [endTime, setEndTime] = useState(initialValues.endTime);
  const [color, setColor] = useState(initialValues.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      location,
      date,
      startTime,
      endTime,
      color,
    });
  };

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add title"
            required
          />
        </div>
        
        <div className="grid w-full gap-1.5">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="start-time">Start Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-400" />
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>
          
          <div className="grid gap-1.5">
            <Label htmlFor="end-time">End Time</Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-400" />
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="grid w-full gap-1.5">
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Add location"
          />
        </div>
        
        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description"
            className="resize-none"
            rows={3}
          />
        </div>
        
        <div className="grid w-full gap-1.5">
          <Label>Color</Label>
          <EventColorPicker selectedColor={color} onColorSelect={setColor} />
        </div>
      </div>
    </form>
  );
};

export default EventForm;
