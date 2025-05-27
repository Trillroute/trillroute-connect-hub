
import React from 'react';
import { Course } from '@/types/course';

interface CourseDetailsCardProps {
  course: Course;
}

export const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({ course }) => {
  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
      <p className="text-sm font-medium">Course Details</p>
      <p className="text-xs text-gray-600 mt-1">
        {course.title} - ₹{course.final_price || 0}
        {course.final_price === 0 && <span className="text-green-600 font-medium"> (FREE)</span>}
      </p>
      <p className="text-xs text-gray-500">
        {course.course_type} course, {course.duration_type} duration
      </p>
    </div>
  );
};
