
import React, { useState, useEffect } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useSkills } from '@/hooks/useSkills';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { MultiSelect, Option } from '@/components/ui/multi-select';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectorProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  selectedFilter: string | null;
  setSelectedFilter: (id: string | null) => void;
  selectedFilters?: string[];
  setSelectedFilters?: (ids: string[]) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters = [],
  setSelectedFilters = () => {}
}) => {
  const { courses = [], loading: coursesLoading } = useCourses();
  const { skills = [], loading: skillsLoading } = useSkills();
  const { teachers = [], loading: teachersLoading } = useTeachers();
  const { students = [], loading: studentsLoading } = useStudents();

  // Reset selected filters when filter type changes
  useEffect(() => {
    setSelectedFilter(null);
    setSelectedFilters([]);
  }, [filterType, setSelectedFilter, setSelectedFilters]);

  // Get appropriate options based on filter type
  const getFilterOptions = (): Option[] => {
    console.log(`Getting filter options for ${filterType}`);
    
    switch (filterType) {
      case 'course':
        return Array.isArray(courses) ? courses.map(course => ({
          value: course.id || '',
          label: course.title || 'Unnamed Course'
        })) : [];
        
      case 'skill':
        return Array.isArray(skills) ? skills.map(skill => ({
          value: skill.id || '',
          label: skill.name || 'Unnamed Skill'
        })) : [];
        
      case 'teacher':
        return Array.isArray(teachers) ? teachers.map(teacher => ({
          value: teacher.id || '',
          label: `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Unnamed Teacher'
        })) : [];
        
      case 'student':
        return Array.isArray(students) ? students.map(student => ({
          value: student.id || '',
          label: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed Student'
        })) : [];
        
      default:
        return [];
    }
  };

  const options = [
    { type: 'all', label: 'All' },
    { type: 'teacher', label: 'Teachers' },
    { type: 'student', label: 'Students' },
    { type: 'admin', label: 'Admins' },
    { type: 'staff', label: 'Staff' },
    { type: 'course', label: 'Course' },
    { type: 'skill', label: 'Skill' }
  ];

  const handleMultiSelectChange = (selected: string[]) => {
    console.log("MultiSelect change:", selected);
    // Update multi-select state
    setSelectedFilters(selected);
    // Also update single selection for backward compatibility
    setSelectedFilter(selected.length > 0 ? selected[0] : null);
  };

  const isLoading = () => {
    if (filterType === 'course') return coursesLoading;
    if (filterType === 'skill') return skillsLoading;
    if (filterType === 'teacher') return teachersLoading;
    if (filterType === 'student') return studentsLoading;
    return false;
  };

  // Get filter options
  const filterOptions = getFilterOptions();

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Segmented control for primary filter types */}
      <div className="flex rounded-md bg-gray-100 p-1">
        {options.map((option) => (
          <button
            key={option.type}
            onClick={() => {
              setFilterType(option.type === 'all' ? null : option.type);
              setSelectedFilter(null);
              setSelectedFilters([]);
            }}
            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              (option.type === 'all' && !filterType) || filterType === option.type
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Secondary filter dropdown with multi-select */}
      {['course', 'skill', 'teacher', 'student'].includes(filterType || '') && (
        <MultiSelect
          options={filterOptions}
          selected={Array.isArray(selectedFilters) ? selectedFilters : []}
          onChange={handleMultiSelectChange}
          placeholder={`Select ${filterType}(s)${isLoading() ? ' (Loading...)' : ''}`}
          className="w-full bg-white"
        />
      )}

      {/* Show loading or empty state when needed */}
      {(['course', 'skill', 'teacher', 'student'].includes(filterType || '') && filterOptions.length === 0) && (
        <div className="p-2 bg-white border rounded text-center text-sm text-gray-600">
          {isLoading() 
            ? `Loading ${filterType} options...` 
            : `No ${filterType} options available`}
        </div>
      )}
    </div>
  );
};

export default FilterSelector;
