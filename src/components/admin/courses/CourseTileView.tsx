
import React from 'react';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { Eye } from 'lucide-react';

interface CourseTileViewProps {
  courses: Course[];
  onView: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CourseTileView: React.FC<CourseTileViewProps> = ({
  courses,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      {courses.map(course => (
        <div key={course.id} className="w-56 bg-muted rounded-lg shadow p-4 flex flex-col items-center">
          {course.image && (
            <img
              src={course.image}
              alt={course.title}
              className="h-10 w-10 rounded object-cover flex-shrink-0 mb-2"
            />
          )}
          <div className="font-semibold">{course.title}</div>
          <div className="text-xs text-gray-500">{course.level} • {course.skill}</div>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onView(course)}>
              <Eye className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button size="sm" variant="ghost" onClick={() => onEdit(course)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="ghost" onClick={() => onDelete(course)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseTileView;
