
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
  const { courses } = useCourses();
  const { skills } = useSkills();
  const { teachers } = useTeachers();
  const { students } = useStudents();

  // Reset selected filters when filter type changes
  useEffect(() => {
    setSelectedFilter(null);
    setSelectedFilters([]);
  }, [filterType, setSelectedFilter, setSelectedFilters]);

  // Get appropriate options based on filter type
  const getFilterOptions = (): Option[] => {
    switch (filterType) {
      case 'course':
        return courses.map(course => ({ 
          value: course.id, 
          label: course.title 
        }));
      case 'skill':
        return skills.map(skill => ({ 
          value: skill.id, 
          label: skill.name 
        }));
      case 'teacher':
        return teachers.map(teacher => ({ 
          value: teacher.id, 
          label: `${teacher.first_name} ${teacher.last_name}` 
        }));
      case 'student':
        return students.map(student => ({ 
          value: student.id, 
          label: `${student.first_name} ${student.last_name}` 
        }));
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
    setSelectedFilters(selected);
    // Also update the single selection state for backward compatibility
    setSelectedFilter(selected.length > 0 ? selected[0] : null);
  };

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

      {/* Secondary filter dropdown with multi-select (appears only when Course/Skill/etc is selected) */}
      {(['course', 'skill', 'teacher', 'student'].includes(filterType || '') && getFilterOptions().length > 0) && (
        <MultiSelect
          options={getFilterOptions()}
          selected={selectedFilters}
          onChange={handleMultiSelectChange}
          placeholder={`Select ${filterType}(s)`}
          className="w-full bg-white"
        />
      )}
    </div>
  );
};

export default FilterSelector;
