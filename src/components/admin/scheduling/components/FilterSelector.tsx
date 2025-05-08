
import React, { useState, useEffect } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useSkills } from '@/hooks/useSkills';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import { supabase } from '@/integrations/supabase/client';

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
  const [allUsers, setAllUsers] = useState<{id: string, name: string}[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Reset selected filters when filter type changes
  useEffect(() => {
    setSelectedFilter(null);
    setSelectedFilters([]);
    
    // If filterType is staff, load all staff members from Supabase
    if (filterType === 'staff') {
      fetchStaffMembers();
    }
  }, [filterType, setSelectedFilter, setSelectedFilters]);
  
  // Fetch staff members from Supabase
  const fetchStaffMembers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('custom_users')
        .select('id, first_name, last_name, role')
        .in('role', ['teacher', 'admin', 'superadmin']);
        
      if (error) {
        throw error;
      }
      
      const mappedUsers = data.map(user => ({
        id: user.id,
        name: `${user.first_name} ${user.last_name} (${user.role})`
      }));
      
      setAllUsers(mappedUsers);
      console.log('Fetched staff members:', mappedUsers);
    } catch (error) {
      console.error('Error fetching staff members:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Get appropriate options based on filter type
  const getFilterOptions = (): Option[] => {
    switch (filterType) {
      case 'course':
        return Array.isArray(courses) ? courses.map(course => ({ 
          value: course.id, 
          label: course.title || 'Unnamed Course'
        })) : [];
      case 'skill':
        return Array.isArray(skills) ? skills.map(skill => ({ 
          value: skill.id, 
          label: skill.name || 'Unnamed Skill'
        })) : [];
      case 'teacher':
        return Array.isArray(teachers) ? teachers.map(teacher => ({ 
          value: teacher.id, 
          label: `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Unnamed Teacher'
        })) : [];
      case 'student':
        return Array.isArray(students) ? students.map(student => ({ 
          value: student.id, 
          label: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed Student'
        })) : [];
      case 'staff':
        return allUsers.map(user => ({
          value: user.id,
          label: user.name
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
    console.log("MultiSelect selection changed:", selected);
    setSelectedFilters(selected || []);
    // Also update the single selection state for backward compatibility
    setSelectedFilter(selected && selected.length > 0 ? selected[0] : null);
  };

  const isLoading = () => {
    if (filterType === 'course') return coursesLoading;
    if (filterType === 'skill') return skillsLoading;
    if (filterType === 'teacher') return teachersLoading;
    if (filterType === 'student') return studentsLoading;
    if (filterType === 'staff') return loadingUsers;
    return false;
  };

  // Get filter options and log information
  const filterOptions = getFilterOptions();
  console.log(`Filter options for ${filterType}:`, filterOptions);
  console.log("Selected filters:", selectedFilters);

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Segmented control for primary filter types */}
      <div className="flex rounded-md bg-gray-100 p-1 overflow-x-auto">
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
      {(['course', 'skill', 'teacher', 'student', 'staff'].includes(filterType || '')) && (
        <MultiSelect
          options={filterOptions}
          selected={selectedFilters}
          onChange={handleMultiSelectChange}
          placeholder={`Select ${filterType}(s)${isLoading() ? ' (Loading...)' : ''}`}
          className="w-full bg-white"
        />
      )}
    </div>
  );
};

export default FilterSelector;
