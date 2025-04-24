
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTeachers } from '@/hooks/useTeachers';
import { useAuth } from '@/hooks/useAuth';
import { useCourses } from '@/hooks/useCourses';
import { Course } from '@/types/course';

// Imported Components
import { CourseDetailSkeleton } from '@/components/courses/detail/CourseDetailSkeleton';
import { CourseNotFound } from '@/components/courses/detail/CourseNotFound';
import { CourseHeader } from '@/components/courses/detail/CourseHeader';
import { CourseOverviewTab } from '@/components/courses/detail/CourseOverviewTab';
import { CourseCurriculumTab } from '@/components/courses/detail/CourseCurriculumTab';
import { CourseInstructorsTab } from '@/components/courses/detail/CourseInstructorsTab';
import { CoursePriceCard } from '@/components/courses/detail/CoursePriceCard';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { teachers = [] } = useTeachers();
  const { user } = useAuth();
  const { getCourseById } = useCourses();
  
  // Function to get instructor names
  const getInstructorNames = (instructorIds: string[] | undefined) => {
    if (!instructorIds || !Array.isArray(instructorIds) || !instructorIds.length) {
      return 'No instructors';
    }
    
    return instructorIds.map(instructorId => {
      const teacher = teachers.find(t => t.id === instructorId);
      return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
    }).join(', ');
  };

  // Enrollment function
  const handleEnroll = () => {
    toast({
      title: 'Enrollment Request Sent',
      description: 'Your enrollment request has been submitted successfully.',
    });
  };
  
  // Fetch the course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        if (!courseId) {
          console.error('No course ID provided in URL params');
          toast({
            title: 'Error',
            description: 'Could not load course details. Missing course ID.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        
        console.log('Fetching course with ID:', courseId);
        const courseData = await getCourseById(courseId);
        console.log('Course data received:', courseData);
        
        if (courseData) {
          setCourse(courseData);
        } else {
          toast({
            title: 'Error',
            description: 'Course not found.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Unexpected error fetching course:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred while loading course details.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseDetails();
  }, [courseId, toast, getCourseById]);
  
  if (loading) {
    return <CourseDetailSkeleton />;
  }
  
  if (!course) {
    return <CourseNotFound />;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link to="/courses" className="flex items-center text-music-500 hover:text-music-600">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Courses
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CourseHeader course={course} />
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructors">Instructors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <CourseOverviewTab course={course} />
            </TabsContent>
            
            <TabsContent value="curriculum" className="pt-4">
              <CourseCurriculumTab />
            </TabsContent>
            
            <TabsContent value="instructors" className="pt-4">
              <CourseInstructorsTab course={course} getInstructorNames={getInstructorNames} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <CoursePriceCard course={course} onEnroll={handleEnroll} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
