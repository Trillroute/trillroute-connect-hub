
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { CalendarEvent } from '../types';
import { formatDateForInput } from '../utils/dateUtils';

interface EventTimeFieldsProps {
  form: UseFormReturn<Omit<CalendarEvent, 'id'>>;
}

const EventTimeFields: React.FC<EventTimeFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>Start</FormLabel>
            <FormControl>
              <Input 
                type="datetime-local"
                value={formatDateForInput(value)}
                onChange={(e) => onChange(new Date(e.target.value))}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="end"
        render={({ field: { value, onChange } }) => (
          <FormItem>
            <FormLabel>End</FormLabel>
            <FormControl>
              <Input 
                type="datetime-local"
                value={formatDateForInput(value)}
                onChange={(e) => onChange(new Date(e.target.value))}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default EventTimeFields;
