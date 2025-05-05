
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarEvent } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import EventColorPicker from './EventColorPicker';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';

// Export this type for use in EventFormDialog
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
  initialData?: CalendarEvent;
  onSubmit: (data: Omit<CalendarEvent, 'id'>) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save Event'
}) => {
  const { role } = useAuth();
  const [selectedColor, setSelectedColor] = useState(initialData?.color || '#4285F4');
  const form = useForm<Omit<CalendarEvent, 'id'>>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      start: initialData?.start || new Date(),
      end: initialData?.end || new Date(Date.now() + 60 * 60 * 1000),
      location: initialData?.location || '',
      color: initialData?.color || '#4285F4'
    }
  });
  
  // Fetch courses based on user role
  const { courses } = useCourses();
  const { myCourses } = useTeacherCourses();
  const { enrolledCourses } = useEnrolledCourses();
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [availableCourses, setAvailableCourses] = useState<{id: string, title: string}[]>([]);
  
  // Determine which courses to show based on role
  useEffect(() => {
    if (role === 'admin' || role === 'superadmin') {
      setAvailableCourses(courses.map(c => ({ id: c.id, title: c.title })));
    } else if (role === 'teacher') {
      setAvailableCourses(myCourses.map(c => ({ id: c.id, title: c.title })));
    } else if (role === 'student') {
      setAvailableCourses(enrolledCourses.map(c => ({ id: c.id, title: c.title })));
    }
  }, [role, courses, myCourses, enrolledCourses]);
  
  // Extract course ID from description if it exists
  useEffect(() => {
    if (initialData?.description) {
      const match = initialData.description.match(/course_id:([a-zA-Z0-9-]+)/);
      if (match && match[1]) {
        setSelectedCourseId(match[1]);
      }
    }
  }, [initialData]);

  const handleFormSubmit = (data: Omit<CalendarEvent, 'id'>) => {
    // Update description to include course ID if selected
    let finalDescription = data.description || '';
    
    if (selectedCourseId) {
      // Remove any existing course_id tag
      finalDescription = finalDescription.replace(/course_id:[a-zA-Z0-9-]+/, '').trim();
      
      // Add the course_id tag
      finalDescription = `${finalDescription} course_id:${selectedCourseId}`.trim();
    }
    
    onSubmit({
      ...data,
      description: finalDescription,
      color: selectedColor
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        {availableCourses.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Related Course</FormLabel>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a course (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {availableCourses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Event description"
                  rows={3}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
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
        
        <div className="space-y-2">
          <FormLabel>Color</FormLabel>
          <EventColorPicker
            selectedColor={selectedColor}
            onColorSelect={setSelectedColor}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </form>
    </Form>
  );
};

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default EventForm;
