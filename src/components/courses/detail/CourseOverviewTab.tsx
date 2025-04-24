
import { CheckCircle, Clock, Users, Calendar } from "lucide-react";
import { Course } from "@/types/course";

interface CourseOverviewTabProps {
  course: Course;
}

export const CourseOverviewTab = ({ course }: CourseOverviewTabProps) => (
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
          <span>{course.duration} ({course.duration_type || 'fixed'})</span>
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
);
