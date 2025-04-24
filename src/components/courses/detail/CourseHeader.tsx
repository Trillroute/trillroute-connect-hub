
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types/course";

interface CourseHeaderProps {
  course: Course;
}

export const CourseHeader = ({ course }: CourseHeaderProps) => (
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
);
