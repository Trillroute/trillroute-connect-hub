import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Users, Clock, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSkills } from '@/hooks/useSkills';
import { useCourseInstructors } from '@/hooks/useCourseInstructors';
import { useTeachers } from '@/hooks/useTeachers';
import { Course } from '@/types/course';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { skills = [] } = useSkills();
  const { teachers = [] } = useTeachers();
  
  // Only pass course IDs if courses array is not empty
  const courseIds = Array.isArray(courses) ? courses.map(course => course.id) : [];
  const { courseInstructorsMap } = useCourseInstructors(courseIds);
  
  // Fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('Fetching courses...');
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching courses:', error);
          toast({
            title: 'Error',
            description: 'Failed to load courses. Please try again later.',
            variant: 'destructive',
          });
          return;
        }
        
        console.log('Courses data fetched:', data);
        // Process all courses with proper types
        const typedCourses = (data || []).map(course => {
          return {
            ...course,
            instructor_ids: Array.isArray(course.instructor_ids) ? course.instructor_ids : []
          } as Course;
        });
        
        setCourses(typedCourses);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('public:courses')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, (payload) => {
        console.log('Change received:', payload);
        fetchCourses();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  // Get instructor names for a course
  const getInstructorNames = (courseId: string) => {
    if (!courseInstructorsMap[courseId] || !Array.isArray(courseInstructorsMap[courseId]) || !courseInstructorsMap[courseId].length) {
      return 'No instructors';
    }
    
    return courseInstructorsMap[courseId].map(instructorId => {
      const teacher = teachers.find(t => t.id === instructorId);
      return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
    }).join(', ');
  };
  
  // Filter courses based on search term
  const filteredCourses = (courses || []).filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (courseInstructorsMap[course.id] && getInstructorNames(course.id).toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Get all unique categories from courses
  const uniqueCategories = [...new Set((courses || []).map(course => course.category))];
  
  // Group courses by category for the tabs
  const coursesByCategory = {
    all: filteredCourses,
    ...Object.fromEntries(
      uniqueCategories.map(category => [
        category.toLowerCase().replace(/\s+/g, '-'),
        filteredCourses.filter(course => course.category === category)
      ])
    )
  };
  
  // Render a course card
  const CourseCard = ({ course }) => (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-bold">
          {course.status}
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{course.title}</CardTitle>
        <CardDescription className="flex items-center text-sm">
          <span className="mr-2">{getInstructorNames(course.id)}</span> • 
          <span className="mx-2">{course.level}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{course.description}</p>
        <div className="flex items-center mt-4 text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="mr-3">{course.duration} ({course.duration_type})</span>
          <Users className="h-4 w-4 mr-1" />
          <span>{course.students} students</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-music-500 hover:bg-music-600">
          View Course
        </Button>
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for courses, instructors, or topics..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline">Level</Button>
          <Button variant="outline">Duration</Button>
          <Button variant="outline">Rating</Button>
        </div>
      </div>
      
      {/* Course Categories Tabs */}
      <Tabs defaultValue="all">
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            {skills.map(skill => (
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
              <p className="text-gray-600">No courses are currently available. Check back soon!</p>
            </div>
          )}
        </TabsContent>
        
        {skills.map(skill => (
          <TabsContent key={skill.id} value={skill.name.toLowerCase().replace(/\s+/g, '-')}>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
              </div>
            ) : filteredCourses.filter(course => course.category === skill.name).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses
                  .filter(course => course.category === skill.name)
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
