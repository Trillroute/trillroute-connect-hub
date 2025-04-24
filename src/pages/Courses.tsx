import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSkills } from '@/hooks/useSkills';
import { useTeachers } from '@/hooks/useTeachers';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';
import { Link } from 'react-router-dom';
import SearchBar from '@/components/courses/SearchBar';
import FiltersSection from '@/components/courses/FiltersSection';

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
  
  // Get all unique skills from courses
  const uniqueSkills = [...new Set((courses || [])
    .map(course => course.skill)
    .filter(skill => skill && skill !== ''))];
  
  // Group courses by skill for the tabs
  const coursesBySkill = {
    all: filteredCourses,
    ...Object.fromEntries(
      uniqueSkills.map(skill => [
        skill.toLowerCase().replace(/\s+/g, '-'),
        filteredCourses.filter(course => course.skill === skill)
      ])
    )
  };
  
  const clearFilters = () => {
    setLevelFilter(null);
    setDurationFilter(null);
  };

  // Count active filters
  const activeFiltersCount = [levelFilter, durationFilter].filter(Boolean).length;
  
  // Render a course card
  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image || '/placeholder.svg'} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold">
          Active
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <span className="mr-2">{getInstructorNames(course)}</span> • 
          <span className="mx-2">{course.level}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{course.description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="mr-3">{course.duration} ({course.duration_type || 'fixed'})</span>
          <Users className="h-4 w-4 mr-1" />
          <span>{course.students || 0} students</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/courses/${course.id}`} className="w-full">
          <Button className="w-full bg-music-500 hover:bg-music-600">
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );

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
      <Tabs defaultValue="all">
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            {skills.map(skill => skill?.name && (
              <TabsTrigger key={skill.id} value={skill.name.toLowerCase().replace(/\s+/g, '-')}>
                {skill.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value="all">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-600">No courses are currently available with your filter criteria. Try adjusting your filters!</p>
            </div>
          )}
        </TabsContent>
        
        {skills.map(skill => skill?.name && (
          <TabsContent key={skill.id} value={skill.name.toLowerCase().replace(/\s+/g, '-')}>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
              </div>
            ) : filteredCourses.filter(course => course.skill === skill.name).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses
                  .filter(course => course.skill === skill.name)
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No {skill.name} courses found</h3>
                <p className="text-gray-600">No courses in this category are currently available. Check back soon!</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Courses;
