import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourses } from '@/hooks/useCourses';
import { useTeachers } from '@/hooks/useTeachers';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/sonner';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { getCourseById } = useCourses();
  const { teachers } = useTeachers();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourse = async () => {
      if (courseId) {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, getCourseById]);

  const handleEnrollNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in this course', {
        description: 'You need to be logged in to enroll in a course.'
      });
      navigate('/auth/login', { 
        state: { redirectTo: `/courses/${courseId}` } 
      });
      return;
    }

    // TODO: Implement actual enrollment logic
    toast.success('Course Enrollment', {
      description: `You are now enrolled in ${course.title}`
    });
  };

  if (loading) {
    return <CourseDetailSkeleton />;
  }

  if (!course) {
    return <CourseNotFound />;
  }

  const getInstructorNames = () => {
    if (!course.instructor_ids || !Array.isArray(course.instructor_ids)) {
      return 'No instructors assigned';
    }
    return course.instructor_ids
      .map(id => {
        const teacher = teachers.find(t => t.id === id);
        return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
      })
      .join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        
        <Button 
          onClick={handleEnrollNow}
          className="bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
        >
          <Check className="mr-2 h-4 w-4" />
          Enroll Now
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-4">Level: {course.level}</span>
            <span className="mr-4">Duration: {course.duration}</span>
            <span>Students: {course.students || 0}</span>
          </div>
        </div>
        <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
          <img
            src={course.image || '/placeholder.svg'}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Course Overview</h3>
            <p>{course.description}</p>
            <h4 className="font-semibold mt-4">What you'll learn</h4>
            <ul className="list-disc pl-5 mt-2">
              <li>Master the fundamentals of {course.skill}</li>
              <li>Develop practical skills through hands-on exercises</li>
              <li>Gain confidence in your musical abilities</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="curriculum">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Course Curriculum</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p>Course Duration: {course.duration}</p>
              <p>Duration Type: {course.duration_type}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="instructors">
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-4">Course Instructors</h3>
            <p>{getInstructorNames()}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CourseDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-10 w-32 bg-gray-200 rounded mb-6" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div className="md:col-span-2">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-20 bg-gray-200 rounded mb-4" />
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      </div>
      <div className="h-48 md:h-64 bg-gray-200 rounded" />
    </div>
  </div>
);

const CourseNotFound = () => (
  <div className="container mx-auto px-4 py-8 text-center">
    <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
    <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
    <Button onClick={() => window.history.back()}>Go Back</Button>
  </div>
);

export default CourseDetail;
