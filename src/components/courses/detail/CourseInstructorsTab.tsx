
import { Course } from "@/types/course";
import { Teacher } from "@/types/course";

interface CourseInstructorsTabProps {
  course: Course;
  getInstructorNames: (instructorIds: string[] | undefined) => string;
}

export const CourseInstructorsTab = ({ course, getInstructorNames }: CourseInstructorsTabProps) => (
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
);
