
import React from 'react';
import { Course } from '@/types/course';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import BulkDeleteButton from './table/BulkDeleteButton';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onView?: (course: Course) => void;
  onBulkDelete?: (ids: string[]) => void;
  selectedCourseIds?: string[];
  setSelectedCourseIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
  selectedCourseIds = [],
  setSelectedCourseIds
}) => {
  // Toggle selection for a single row
  const toggleRowSelection = (course: Course) => {
    if (!setSelectedCourseIds) return;
    
    setSelectedCourseIds(prev => {
      if (prev.includes(course.id)) {
        return prev.filter(id => id !== course.id);
      } else {
        return [...prev, course.id];
      }
    });
  };

  // Toggle selection for all rows
  const toggleSelectAll = () => {
    if (!setSelectedCourseIds) return;
    
    if (selectedCourseIds.length === courses.length) {
      setSelectedCourseIds([]);
    } else {
      const allIds = courses.map(course => course.id);
      setSelectedCourseIds(allIds);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedCourseIds.length > 0) {
      onBulkDelete(selectedCourseIds);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-music-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {selectedCourseIds.length > 0 && onBulkDelete && (
        <BulkDeleteButton 
          selectedCount={selectedCourseIds.length}
          onBulkDelete={handleBulkDelete}
        />
      )}

      <div className="w-full rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCourseIds.length === courses.length && courses.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No courses found
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    {setSelectedCourseIds && (
                      <Checkbox 
                        checked={selectedCourseIds.includes(course.id)}
                        onCheckedChange={() => toggleRowSelection(course)}
                      />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>
                    {typeof course.final_price === 'number' ? `₹${course.final_price.toFixed(2)}` : ''}
                  </TableCell>
                  <TableCell>
                    {course.created_at ? format(new Date(course.created_at), 'MMM d, yyyy') : ''}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onView && (
                        <Button variant="ghost" size="sm" onClick={() => onView(course)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(course)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDelete(course)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseTable;

