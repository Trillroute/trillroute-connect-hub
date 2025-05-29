
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarEvent } from './types';
import { Form } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { useTeacherCourses } from '@/hooks/useTeacherCourses';
import { useEnrolledCourses } from '@/hooks/useEnrolledCourses';
import EventBasicInfo from './form-components/EventBasicInfo';
import EventTimeFields from './form-components/EventTimeFields';
import CourseSelector from './form-components/CourseSelector';
import EventFormActions from './form-components/EventFormActions';

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
  initialData?: Partial<CalendarEvent> | Omit<CalendarEvent, 'id'>;
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
  const [selectedColor] = useState(initialData?.color || '#4285F4');
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
        <EventBasicInfo form={form} />
        
        <CourseSelector 
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
          availableCourses={availableCourses}
        />
        
        <EventTimeFields form={form} />
        
        <EventFormActions 
          onCancel={onCancel} 
          submitLabel={submitLabel}
        />
      </form>
    </Form>
  );
};

export default EventForm;
