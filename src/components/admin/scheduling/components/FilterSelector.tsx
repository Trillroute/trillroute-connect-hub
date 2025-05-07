
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses } from '@/hooks/useCourses';
import { useSkills } from '@/hooks/useSkills';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectorProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  selectedFilter: string | null;
  setSelectedFilter: (id: string | null) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter
}) => {
  const { courses } = useCourses();
  const { skills } = useSkills();
  const { teachers } = useTeachers();
  const { students } = useStudents();

  // Reset selected filter when filter type changes
  useEffect(() => {
    setSelectedFilter(null);
  }, [filterType, setSelectedFilter]);

  // Filter options
  const filterOptions: FilterOption[] = [
    { value: 'course', label: 'Filter by Course' },
    { value: 'skill', label: 'Filter by Skill' },
    { value: 'teacher', label: 'Filter by Teacher' },
    { value: 'student', label: 'Filter by Student' }
  ];

  // Get appropriate options based on filter type
  const getFilterOptions = (): FilterOption[] => {
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

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Filter type selector */}
      <Select 
        value={filterType || 'none'} 
        onValueChange={(value) => {
          setFilterType(value === 'none' ? null : value);
          setSelectedFilter(null);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No filter</SelectItem>
          {filterOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Conditional filter value selector */}
      {filterType && (
        <Select 
          value={selectedFilter || 'none'} 
          onValueChange={setSelectedFilter}
          disabled={getFilterOptions().length === 0}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={`Select a ${filterType}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Select an option</SelectItem>
            {getFilterOptions().map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default FilterSelector;
