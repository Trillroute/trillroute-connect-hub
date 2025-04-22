import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Course } from '@/types/course';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onView?: (course: Course) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({ courses, loading, onEdit, onDelete, onView, onBulkDelete }) => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => courses.some(c => c.id === id)));
  }, [courses]);

  const isAllSelected = courses.length > 0 && selectedIds.length === courses.length;
  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(courses.map(course => course.id));
  };
  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
    }
  };

  const viewCourse = (event: React.MouseEvent, course: Course) => {
    event.stopPropagation();
    if (onView) onView(course);
    else navigate(`/courses/${course.id}`);
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
    <div>
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-end mb-2">
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}
      <ResizablePanelGroup direction="horizontal" className="w-full">
        <ResizablePanel minSize={8} defaultSize={8}>
          <Table>
            <TableCaption>A list of all courses in the system.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all courses"
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.includes(course.id)}
                      onCheckedChange={() => toggleSelectOne(course.id)}
                      aria-label={`Select ${course.title}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle isHeader />
        <ResizablePanel minSize={24} defaultSize={24}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Course</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium max-w-[250px]" onClick={() => onView && onView(course)}>
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
                        <div className="text-xs text-gray-500 md:hidden truncate">
                          {course.level} • {course.skill}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle isHeader />
        <ResizablePanel minSize={12} defaultSize={12}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="hidden md:table-cell truncate" onClick={() => onView && onView(course)}>
                    {course.level}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle isHeader />
        <ResizablePanel minSize={12} defaultSize={12}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Skill</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="hidden md:table-cell truncate" onClick={() => onView && onView(course)}>
                    {course.skill}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle isHeader />
        <ResizablePanel minSize={10} defaultSize={10}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="hidden md:table-cell truncate" onClick={() => onView && onView(course)}>
                    {course.duration}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
        <ResizableHandle withHandle isHeader />
        <ResizablePanel minSize={12} defaultSize={12}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => viewCourse(e, course)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CourseTable;
