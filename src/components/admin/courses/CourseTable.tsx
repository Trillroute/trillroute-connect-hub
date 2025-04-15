
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, BookOpen } from 'lucide-react';
import { Course } from '@/types/course';
import { useTeachers } from '@/hooks/useTeachers';
import { Badge } from '@/components/ui/badge';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, loading, onEdit, onDelete }) => {
  const { teachers = [] } = useTeachers();

  const getInstructorName = (instructorId: string) => {
    const teacher = teachers.find(t => t.id === instructorId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unknown";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center border rounded-md">
        <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No courses yet</h3>
        <p className="text-gray-500 max-w-sm mb-4">
          Add your first course by clicking the "Add New Course" button.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Instructors</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">{course.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(course.instructor_ids) && course.instructor_ids.length > 0 ? (
                    course.instructor_ids.map((instructorId) => (
                      <Badge key={instructorId} variant="outline" className="bg-gray-100">
                        {getInstructorName(instructorId)}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No instructors assigned</span>
                  )}
                </div>
              </TableCell>
              <TableCell>{course.category}</TableCell>
              <TableCell>{course.level}</TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>
                <Badge variant="outline" className={course.duration_type === 'recurring' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                  {course.duration_type === 'recurring' ? 'Recurring' : 'Fixed'}
                </Badge>
              </TableCell>
              <TableCell>{course.students}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  course.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => onEdit(course)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit course</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => onDelete(course)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete course</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
