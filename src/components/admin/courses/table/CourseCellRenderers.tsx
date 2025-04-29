
import React from 'react';
import { Course } from '@/types/course';
import { ICellRendererParams } from 'ag-grid-community';
import CourseActionButtons from './CourseActionButtons';

export const CourseTitleRenderer: React.FC<ICellRendererParams<Course>> = (params) => {
  const course = params.data as Course;
  if (!course) return null;
  
  return (
    <div className="flex items-center gap-3">
      {course.image && (
        <img
          src={course.image}
          alt={course.title}
          className="h-10 w-10 rounded object-cover flex-shrink-0"
        />
      )}
      <div className="overflow-hidden">
        <div className="font-semibold truncate">{course.title}</div>
        <div className="text-xs text-gray-500 truncate">
          {course.level} • {course.skill}
        </div>
      </div>
    </div>
  );
};

export const CourseActionsRenderer = (
  onView?: (course: Course) => void,
  onEdit?: (course: Course) => void,
  onDelete?: (course: Course) => void,
) => {
  return (params: ICellRendererParams<Course>) => {
    const course = params.data as Course;
    if (!course) return null;
    
    return (
      <CourseActionButtons 
        course={course}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  };
};
