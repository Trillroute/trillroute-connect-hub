
import React, { useState } from 'react';
import { Course } from '@/types/course';
import DataTable, { Column } from '@/components/ui/data-table/DataTable';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
  onView?: (course: Course) => void;
  onBulkDelete?: (ids: string[]) => void;
}

const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  loading,
  onEdit,
  onDelete,
  onView,
  onBulkDelete
}) => {
  const columns: Column[] = [
    {
      key: 'title',
      label: 'Course',
      sortable: true,
      filterable: true,
      render: (_, course) => (
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
      )
    },
    {
      key: 'level',
      label: 'Level',
      sortable: true,
      filterable: true
    },
    {
      key: 'skill',
      label: 'Skill',
      sortable: true,
      filterable: true
    },
    {
      key: 'duration',
      label: 'Duration',
      sortable: true
    }
  ];

  return (
    <DataTable
      data={courses}
      columns={columns}
      loading={loading}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      onBulkDelete={onBulkDelete}
    />
  );
};

export default CourseTable;
