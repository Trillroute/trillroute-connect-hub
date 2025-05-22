
import { useState, useMemo } from 'react';
import { Course } from '@/types/course';

export const useCourseSearch = (courses: Course[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skill.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredCourses
  };
};
