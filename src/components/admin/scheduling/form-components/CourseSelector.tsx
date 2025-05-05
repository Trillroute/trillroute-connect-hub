
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';

interface CourseSelectorProps {
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  availableCourses: { id: string; title: string }[];
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ 
  selectedCourseId, 
  setSelectedCourseId, 
  availableCourses 
}) => {
  if (availableCourses.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <FormLabel>Related Course</FormLabel>
      <Select
        value={selectedCourseId}
        onValueChange={setSelectedCourseId}
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            {selectedCourseId && <BookOpen className="h-4 w-4" />}
            <SelectValue placeholder="Select a course (optional)" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {availableCourses.map(course => (
            <SelectItem key={course.id} value={course.id}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseSelector;
