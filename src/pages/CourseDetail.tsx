
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Users, ChevronLeft, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { useTeachers } from '@/hooks/useTeachers';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourses } from '@/hooks/useCourses';

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
  
  // Fetch the course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        if (!courseId) return;
        
        const courseData = await getCourseById(courseId);
        
        if (courseData) {
          setCourse(courseData);
        }
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
    
    fetchCourseDetails();
  }, [courseId, toast, getCourseById]);
  
  // Enrollment function (placeholder for now)
  const handleEnroll = () => {
    toast({
      title: 'Enrollment Request Sent',
      description: 'Your enrollment request has been submitted successfully.',
    });
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center mb-8">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-8 w-2/3 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // If the course doesn't exist
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="py-12 bg-gray-50 rounded-lg">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link to="/courses">
            <Button>Browse All Courses</Button>
          </Link>
        </div>
      </div>
    );
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="bg-music-50 text-music-700 border-music-200">
                {course.level}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {course.skill}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {course.duration}
              </Badge>
            </div>
            <p className="text-gray-600">{course.description}</p>
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="instructors">Instructors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">About this Course</h3>
                  <p className="text-gray-600">{course.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">What You'll Learn</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Foundational skills in {course.skill}</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Professional techniques taught by industry experts</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Practical experience through guided exercises</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Course Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-music-500 mr-2" />
                      <span>{course.duration} ({course.duration_type})</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-music-500 mr-2" />
                      <span>{course.students || 0} students enrolled</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-music-500 mr-2" />
                      <span>Flexible schedule</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Course Content</h3>
                  <p className="text-gray-600 mb-4">
                    This course is structured to provide progressive learning from basic to advanced concepts.
                  </p>
                  
                  <div className="space-y-2">
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">Module 1: Introduction to {course.skill}</CardTitle>
                      </CardHeader>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">Module 2: Core Techniques</CardTitle>
                      </CardHeader>
                    </Card>
                    
                    <Card>
                      <CardHeader className="py-3">
                        <CardTitle className="text-lg">Module 3: Advanced Applications</CardTitle>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="instructors" className="pt-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Meet Your Instructors</h3>
                <p className="text-gray-600 mb-4">
                  Learn from experienced professionals in the field of {course.skill}.
                </p>
                
                <div>
                  <p className="text-lg font-medium">{getInstructorNames(course.instructor_ids)}</p>
                  <p className="text-gray-600">
                    Our instructors bring years of professional experience and a passion for teaching.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Enrollment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.image && (
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-48 object-cover rounded-md mb-4"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              )}
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Price:</span>
                <span className="text-2xl font-bold text-music-600">
                  ₹{course.final_price || course.base_price || 0}
                </span>
              </div>
              
              {course.discount_value > 0 && (
                <div className="flex items-center">
                  <span className="line-through text-gray-500 mr-2">₹{course.base_price}</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {course.discount_metric === 'percentage'
                      ? `${course.discount_value}% OFF`
                      : `₹${course.discount_value} OFF`}
                  </Badge>
                </div>
              )}
              
              <div className="pt-4">
                <Button onClick={handleEnroll} className="w-full bg-music-500 hover:bg-music-600">
                  Enroll Now
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start pt-0">
              <div className="text-sm text-gray-500 mt-4">
                <p>• Access to all course materials</p>
                <p>• Certificate of completion</p>
                <p>• Lifetime access to updates</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
