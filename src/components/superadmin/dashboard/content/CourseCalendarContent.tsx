
import React, { useState, useEffect } from 'react';
import ContentWrapper from './ContentWrapper';
import { FilteredCalendar } from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CourseCalendarContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  const { courses, loading } = useCourses();
  
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);
  
  return (
    <ContentWrapper
      title="Course Calendar"
      description="View and manage schedule for specific courses"
    >
      <div className="mb-6">
        <Select 
          value={selectedCourseId} 
          onValueChange={setSelectedCourseId}
          disabled={loading || courses.length === 0}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map(course => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[calc(100vh-280px)]">
        {selectedCourseId ? (
          <FilteredCalendar
            filterType="course"
            filterId={selectedCourseId}
            filterIds={[selectedCourseId]}
            filters={{ users: [], courses: [selectedCourseId], skills: [] }}
          />
        ) : (
          <div className="flex items-center justify-center h-full border rounded-md bg-gray-50">
            <p className="text-gray-500">Please select a course to view its calendar</p>
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};

export default CourseCalendarContent;
