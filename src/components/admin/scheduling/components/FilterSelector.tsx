
import React, { useState, useEffect, useCallback } from 'react';
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
  showFilterTypeTabs?: boolean; // New prop to control filter type tabs visibility
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  filterType,
  setFilterType,
  selectedFilter,
  setSelectedFilter,
  selectedFilters = [],
  setSelectedFilters = () => {},
  showFilterTypeTabs = true // Default to true for backward compatibility
}) => {
  const { courses = [], loading: coursesLoading } = useCourses();
  const { skills = [], loading: skillsLoading } = useSkills();
  const { teachers = [], loading: teachersLoading } = useTeachers();
  const { students = [], loading: studentsLoading } = useStudents();
  const [allUsers, setAllUsers] = useState<{id: string, name: string}[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [filterOptions, setFilterOptions] = useState<Option[]>([]);

  // Fetch staff members from Supabase
  const fetchStaffMembers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('custom_users')
        .select('id, first_name, last_name, role')
        .in('role', ['teacher', 'admin', 'superadmin']);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        const mappedUsers = data.map(user => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''} (${user.role || ''})`
        }));
        
        setAllUsers(mappedUsers);
        console.log('Fetched staff members:', mappedUsers.length);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Reset selected filters when filter type changes
  useEffect(() => {
    setSelectedFilter(null);
    setSelectedFilters([]);
    
    // If filterType is staff, load all staff members from Supabase
    if (filterType === 'staff') {
      fetchStaffMembers();
    }
    
    // Update filter options based on the new filter type
    updateFilterOptions();
  }, [filterType]);
  
  // Update filter options whenever dependencies change
  const updateFilterOptions = useCallback(() => {
    let newOptions: Option[] = [];
    
    switch (filterType) {
      case 'course':
        newOptions = Array.isArray(courses) ? courses.map(course => ({ 
          value: course.id, 
          label: course.title || 'Unnamed Course'
        })) : [];
        break;
      case 'skill':
        newOptions = Array.isArray(skills) ? skills.map(skill => ({ 
          value: skill.id, 
          label: skill.name || 'Unnamed Skill'
        })) : [];
        break;
      case 'teacher':
        newOptions = Array.isArray(teachers) ? teachers.map(teacher => ({ 
          value: teacher.id, 
          label: `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || 'Unnamed Teacher'
        })) : [];
        break;
      case 'student':
        newOptions = Array.isArray(students) ? students.map(student => ({ 
          value: student.id, 
          label: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed Student'
        })) : [];
        break;
      case 'staff':
        newOptions = Array.isArray(allUsers) ? allUsers.map(user => ({
          value: user.id,
          label: user.name
        })) : [];
        break;
      default:
        newOptions = [];
    }
    
    setFilterOptions(newOptions);
    console.log(`Generated ${newOptions.length} options for ${filterType}`);
  }, [filterType, courses, skills, teachers, students, allUsers]);
  
  // Update filter options when dependencies change
  useEffect(() => {
    updateFilterOptions();
  }, [courses, skills, teachers, students, allUsers, updateFilterOptions]);

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

  const options = [
    { type: 'all', label: 'All' },
    { type: 'teacher', label: 'Teachers' },
    { type: 'student', label: 'Students' },
    { type: 'admin', label: 'Admins' },
    { type: 'staff', label: 'Staff' },
    { type: 'course', label: 'Course' },
    { type: 'skill', label: 'Skill' }
  ];

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Segmented control for primary filter types - only show if showFilterTypeTabs is true */}
      {showFilterTypeTabs && (
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
      )}

      {/* Secondary filter dropdown with multi-select */}
      {(['course', 'skill', 'teacher', 'student', 'staff'].includes(filterType || '')) && (
        <MultiSelect
          options={filterOptions || []}
          selected={selectedFilters || []}
          onChange={handleMultiSelectChange}
          placeholder={`Select ${filterType || ''}(s)${isLoading() ? ' (Loading...)' : ''}`}
          className="w-full bg-white"
        />
      )}
    </div>
  );
};

export default FilterSelector;
