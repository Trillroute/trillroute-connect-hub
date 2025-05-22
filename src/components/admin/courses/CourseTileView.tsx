
import React from 'react';
import { Course } from '@/types/course';

interface CourseTileViewProps {
  courses: Course[];
  isLoading: boolean;
  onView: (course: Course) => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

const CourseTileView: React.FC<CourseTileViewProps> = ({
  courses,
  isLoading,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <div>
      {/* Course tile implementation */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {courses.map(course => (
            <div key={course.id} className="border p-4 rounded-lg shadow">
              <h3 className="font-medium">{course.title}</h3>
              <div className="flex space-x-2 mt-2">
                <button onClick={() => onView(course)}>View</button>
                {onEdit && <button onClick={() => onEdit(course)}>Edit</button>}
                {onDelete && <button onClick={() => onDelete(course)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseTileView;
