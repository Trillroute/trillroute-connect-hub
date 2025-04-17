
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Course } from '@/types/course';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onView?: (course: Course) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, loading, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();

  const viewCourse = (event: React.MouseEvent, course: Course) => {
    event.stopPropagation();
    if (onView) {
      onView(course);
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-music-500"></div>
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No courses found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>A list of all courses in the system.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead className="hidden md:table-cell">Level</TableHead>
          <TableHead className="hidden md:table-cell">Skill</TableHead>
          <TableHead className="hidden md:table-cell">Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow 
            key={course.id}
            data-course-id={course.id}
            onClick={() => onView && onView(course)}
            className={onView ? "cursor-pointer" : ""}
          >
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                {course.image && (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-10 w-10 rounded object-cover"
                  />
                )}
                <div>
                  <div className="font-semibold">{course.title}</div>
                  <div className="text-xs text-gray-500 md:hidden">
                    {course.level} • {course.skill}
                  </div>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{course.level}</TableCell>
            <TableCell className="hidden md:table-cell">{course.skill}</TableCell>
            <TableCell className="hidden md:table-cell">{course.duration}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => viewCourse(e, course)}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Button>
                
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(course);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(course);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CourseTable;
