
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Option } from '@/components/ui/multi-select';

interface UseFilterOptionsProps {
  filterType: string | null;
}

export function useFilterOptions({ filterType }: UseFilterOptionsProps) {
  const [filterOptions, setFilterOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!filterType) {
        setFilterOptions([]);
        return;
      }

      setIsLoading(true);

      try {
        switch (filterType) {
          case 'course':
            const { data: courses, error: coursesError } = await supabase
              .from('courses')
              .select('id, title')
              .order('title');

            if (coursesError) throw coursesError;
            setFilterOptions(
              courses.map(course => ({
                value: course.id,
                label: course.title,
              }))
            );
            break;

          case 'skill':
            const { data: skills, error: skillsError } = await supabase
              .from('skills')
              .select('id, name')
              .order('name');

            if (skillsError) throw skillsError;
            setFilterOptions(
              skills.map(skill => ({
                value: skill.id,
                label: skill.name,
              }))
            );
            break;

          case 'teacher':
            const { data: teachers, error: teachersError } = await supabase
              .from('custom_users')
              .select('id, first_name, last_name')
              .eq('role', 'teacher')
              .order('last_name');

            if (teachersError) throw teachersError;
            setFilterOptions(
              teachers.map(teacher => ({
                value: teacher.id,
                label: `${teacher.first_name} ${teacher.last_name}`.trim(),
              }))
            );
            break;

          case 'student':
            const { data: students, error: studentsError } = await supabase
              .from('custom_users')
              .select('id, first_name, last_name')
              .eq('role', 'student')
              .order('last_name');

            if (studentsError) throw studentsError;
            setFilterOptions(
              students.map(student => ({
                value: student.id,
                label: `${student.first_name} ${student.last_name}`.trim(),
              }))
            );
            break;

          case 'admin':
            const { data: admins, error: adminsError } = await supabase
              .from('custom_users')
              .select('id, first_name, last_name')
              .in('role', ['admin', 'superadmin'])
              .order('last_name');

            if (adminsError) throw adminsError;
            setFilterOptions(
              admins.map(admin => ({
                value: admin.id,
                label: `${admin.first_name} ${admin.last_name}`.trim(),
              }))
            );
            break;

          case 'staff':
            const { data: staff, error: staffError } = await supabase
              .from('custom_users')
              .select('id, first_name, last_name, role')
              .in('role', ['teacher', 'admin', 'superadmin'])
              .order('last_name');

            if (staffError) throw staffError;
            setFilterOptions(
              staff.map(member => ({
                value: member.id,
                label: `${member.first_name} ${member.last_name} (${member.role})`.trim(),
              }))
            );
            break;

          case 'unit':
            // Since we don't have a 'units' table, we'll provide static mock data
            // This avoids the database query error
            setFilterOptions([
              { value: 'unit1', label: 'Math Department' },
              { value: 'unit2', label: 'Science Department' },
              { value: 'unit3', label: 'Arts Department' },
              { value: 'unit4', label: 'Music Department' },
              { value: 'unit5', label: 'Physical Education' },
              { value: 'unit6', label: 'Languages' },
            ]);
            break;

          default:
            setFilterOptions([]);
        }
      } catch (error) {
        console.error(`Error fetching ${filterType} options:`, error);
        setFilterOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [filterType]);

  return { filterOptions, isLoading };
}
