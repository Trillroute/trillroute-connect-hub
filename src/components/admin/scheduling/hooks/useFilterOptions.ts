
import { useState, useEffect, useCallback } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useSkills } from '@/hooks/useSkills';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';
import { supabase } from '@/integrations/supabase/client';
import { Option } from '@/components/ui/multi-select';

export interface UseFilterOptionsProps {
  filterType: string | null;
}

export const useFilterOptions = ({ filterType }: UseFilterOptionsProps) => {
  const {
    courses = [],
    loading: coursesLoading
  } = useCourses();
  const {
    skills = [],
    loading: skillsLoading
  } = useSkills();
  const {
    teachers = [],
    loading: teachersLoading
  } = useTeachers();
  const {
    students = [],
    loading: studentsLoading
  } = useStudents();
  const [allUsers, setAllUsers] = useState<{
    id: string;
    name: string;
  }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [filterOptions, setFilterOptions] = useState<Option[]>([]);

  // Fetch staff members from Supabase
  const fetchStaffMembers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const {
        data,
        error
      } = await supabase.from('custom_users').select('id, first_name, last_name, role').in('role', ['teacher', 'admin', 'superadmin']);
      if (error) {
        throw error;
      }
      if (data) {
        const mappedUsers = data.map(user => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User' + ` (${user.role || ''})`
        }));
        setAllUsers(mappedUsers);
        console.log('Fetched staff members:', mappedUsers.length);
      }
    } catch (error) {
      console.error('Error fetching staff members:', error);
      setAllUsers([]); // Ensure we reset to empty array on error
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Fetch admin users from Supabase
  const fetchAdminUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const {
        data,
        error
      } = await supabase.from('custom_users').select('id, first_name, last_name, role').in('role', ['admin', 'superadmin']);
      if (error) {
        throw error;
      }
      if (data) {
        const mappedUsers = data.map(user => ({
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User' + ` (${user.role || ''})`
        }));
        setAllUsers(mappedUsers);
        console.log('Fetched admin users:', mappedUsers.length);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      setAllUsers([]); // Ensure we reset to empty array on error
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // Effect to fetch appropriate user data when filter type changes
  useEffect(() => {
    // If filterType is staff, load all staff members from Supabase
    if (filterType === 'staff') {
      fetchStaffMembers();
    }
    // If filterType is admin, load admin and superadmin users from Supabase
    else if (filterType === 'admin') {
      fetchAdminUsers();
    }
  }, [filterType, fetchStaffMembers, fetchAdminUsers]);

  // Update filter options based on the current filter type
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
      case 'admin':
        newOptions = Array.isArray(allUsers) ? allUsers.map(user => ({
          value: user.id,
          label: user.name
        })) : [];
        break;
      default:
        newOptions = [];
    }
    
    setFilterOptions(newOptions);
    console.log(`Generated ${newOptions.length} options for ${filterType || 'null'}`);
  }, [filterType, courses, skills, teachers, students, allUsers]);

  // Update filter options when dependencies change
  useEffect(() => {
    updateFilterOptions();
  }, [courses, skills, teachers, students, allUsers, updateFilterOptions]);

  const isLoading = () => {
    if (filterType === 'course') return coursesLoading;
    if (filterType === 'skill') return skillsLoading;
    if (filterType === 'teacher') return teachersLoading;
    if (filterType === 'student') return studentsLoading;
    if (filterType === 'staff') return loadingUsers;
    if (filterType === 'admin') return loadingUsers;
    return false;
  };

  return {
    filterOptions,
    isLoading: isLoading()
  };
};
