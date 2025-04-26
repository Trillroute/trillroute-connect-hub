
import { Course } from '@/types/course';
import { Teacher } from '@/types/course';

interface CourseContentProps {
  course: Course;
  getInstructorNames: () => string;
}

export const CourseContent = ({ course, getInstructorNames }: CourseContentProps) => (
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
    <div className="relative h-48 md:h-full rounded-lg overflow-hidden bg-gray-100">
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
);
