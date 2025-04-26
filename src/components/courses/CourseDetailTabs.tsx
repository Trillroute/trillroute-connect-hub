
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course } from '@/types/course';

interface CourseDetailTabsProps {
  course: Course;
  getInstructorNames: () => string;
}

export const CourseDetailTabs = ({ course, getInstructorNames }: CourseDetailTabsProps) => (
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
);
