
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
        const courseOptions = Array.isArray(courses) ? courses.map(course => ({
          value: course.id || '',
          label: course.title || 'Unnamed Course'
        })) : [];
        console.log("Course options:", courseOptions);
        return courseOptions;
        
      case 'skill':
        const skillOptions = Array.isArray(skills) ? skills.map(skill => ({
          value: skill.id || '',
          label: skill.name || 'Unnamed Skill'
        })) : [];
        console.log("Skill options:", skillOptions);
        return skillOptions;
        
      case 'teacher':
        const teacherOptions = Array.isArray(teachers) ? teachers.map(teacher => ({
          value: teacher.id || '',
          label: `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Unnamed Teacher'
        })) : [];
        console.log("Teacher options:", teacherOptions);
        return teacherOptions;
        
      case 'student':
        const studentOptions = Array.isArray(students) ? students.map(student => ({
          value: student.id || '',
          label: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed Student'
        })) : [];
        console.log("Student options:", studentOptions);
        return studentOptions;
        
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
    // Ensure selected is an array
    const safeSelected = Array.isArray(selected) ? selected : [];
    setSelectedFilters(safeSelected);
    // Also update the single selection state for backward compatibility
    setSelectedFilter(safeSelected.length > 0 ? safeSelected[0] : null);
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
  
  // Ensure we have valid options
  console.log(`Filter options for ${filterType}:`, filterOptions);
  console.log("Selected filters:", selectedFilters);

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
      {(['course', 'skill', 'teacher', 'student'].includes(filterType || '') && filterOptions.length > 0) && (
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
