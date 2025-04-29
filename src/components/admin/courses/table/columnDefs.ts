
import { ColDef } from 'ag-grid-community';
import { Course } from '@/types/course';
import { CourseTitleRenderer, CourseActionsRenderer } from './CourseCellRenderers';

export const getCourseColumnDefs = (
  onView?: (course: Course) => void,
  onEdit?: (course: Course) => void,
  onDelete?: (course: Course) => void,
): ColDef<Course>[] => [
  {
    headerName: '',
    field: 'id',
    width: 50,
    headerCheckboxSelection: true,
    checkboxSelection: true,
    filter: false,
    sortable: false,
  },
  {
    headerName: 'Course',
    field: 'title',
    filter: true,
    sortable: true,
    flex: 2,
    minWidth: 200,
    cellRenderer: CourseTitleRenderer
  },
  {
    headerName: 'Level',
    field: 'level',
    filter: true,
    sortable: true
  },
  {
    headerName: 'Skill',
    field: 'skill',
    filter: true,
    sortable: true
  },
  {
    headerName: 'Duration',
    field: 'duration',
    filter: true,
    sortable: true
  },
  {
    headerName: 'Actions',
    sortable: false,
    filter: false,
    width: 150,
    cellRenderer: CourseActionsRenderer(onView, onEdit, onDelete)
  }
];
