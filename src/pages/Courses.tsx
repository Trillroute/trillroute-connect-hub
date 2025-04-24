
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSkills } from '@/hooks/useSkills';
import { useTeachers } from '@/hooks/useTeachers';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import SearchBar from '@/components/courses/SearchBar';
import FiltersSection from '@/components/courses/FiltersSection';
import CourseTabs from '@/components/courses/CourseTabs';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();
  const { skills = [] } = useSkills();
  const { teachers = [] } = useTeachers();
  const { courses, loading } = useCourses();
  
  // Get instructor names for a course
  const getInstructorNames = (course: Course) => {
    if (!course.instructor_ids || !Array.isArray(course.instructor_ids) || !course.instructor_ids.length) {
      return 'No instructors';
    }
    
    return course.instructor_ids.map(instructorId => {
      const teacher = teachers.find(t => t.id === instructorId);
      return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
    }).join(', ');
  };
  
  // Filter courses based on search term and filters
  const filteredCourses = (courses || []).filter(course => {
    // Apply search filter
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getInstructorNames(course).toLowerCase().includes(searchTerm.toLowerCase());
      
    // Apply level filter if selected
    const matchesLevel = !levelFilter || course.level === levelFilter;
    
    // Apply duration filter if selected
    const matchesDuration = !durationFilter || course.duration.includes(durationFilter);
    
    return matchesSearch && matchesLevel && matchesDuration;
  });
  
  // Extract unique levels and durations for filters
  const uniqueLevels = [...new Set((courses || []).map(course => course.level))];
  const uniqueDurations = [...new Set((courses || [])
    .map(course => {
      const durationParts = course.duration.split(' ');
      return durationParts.length > 0 ? durationParts[0] : 'unknown';
    })
    .filter(duration => duration && duration !== 'unknown'))];
  
  const clearFilters = () => {
    setLevelFilter(null);
    setDurationFilter(null);
  };

  // Count active filters
  const activeFiltersCount = [levelFilter, durationFilter].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Our Music Courses</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover a wide range of music courses taught by professional instructors to help you achieve your musical goals.
        </p>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div className="w-full md:w-1/2">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
        
        <div className="flex items-center gap-2 self-start">
          <FiltersSection 
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            durationFilter={durationFilter}
            setDurationFilter={setDurationFilter}
            uniqueLevels={uniqueLevels}
            uniqueDurations={uniqueDurations}
            clearFilters={clearFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </div>
      </div>
      
      {/* Course Categories Tabs */}
      <CourseTabs 
        loading={loading}
        filteredCourses={filteredCourses}
        skills={skills}
        getInstructorNames={getInstructorNames}
      />
    </div>
  );
};

export default Courses;
