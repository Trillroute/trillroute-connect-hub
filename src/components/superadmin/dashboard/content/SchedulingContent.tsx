
import React, { useState } from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import { useSkills } from '@/hooks/useSkills';
import { useCourses } from '@/hooks/useCourses';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  const { skills } = useSkills();
  const { courses } = useCourses();
  
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>('');
  
  // Calculate which values to pass to FilteredCalendar based on the filter type
  const getFilterProps = () => {
    switch(filterType) {
      case 'role-teacher':
        return { 
          filterType: 'role' as const, 
          filterValues: ['teacher'],
          title: 'Teacher Calendar' 
        };
      case 'role-student':
        return { 
          filterType: 'role' as const, 
          filterValues: ['student'],
          title: 'Student Calendar' 
        };
      case 'role-admin':
        return { 
          filterType: 'role' as const, 
          filterValues: ['admin', 'superadmin'],
          title: 'Admin Calendar' 
        };
      case 'role-staff':
        return { 
          filterType: 'role' as const, 
          filterValues: ['teacher', 'admin', 'superadmin'],
          title: 'Staff Calendar' 
        };
      case 'course':
        return { 
          filterType: 'course' as const, 
          filterValues: [selectedId],
          title: courses.find(c => c.id === selectedId)?.title || 'Course Calendar' 
        };
      case 'skill':
        return { 
          filterType: 'skill' as const, 
          filterValues: [selectedId],
          title: skills.find(s => s.id === selectedId)?.name || 'Skill Calendar' 
        };
      default:
        return { 
          title: 'All Events',
          filterType: undefined,
          filterValues: undefined
        };
    }
  };

  return (
    <ContentWrapper
      title="Calendar"
      description="View and manage all calendar events"
    >
      <div className="space-y-6">
        <div className="border rounded-lg bg-white p-4">
          <Tabs defaultValue="all" onValueChange={setFilterType} className="w-full">
            <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="role-teacher">Teachers</TabsTrigger>
              <TabsTrigger value="role-student">Students</TabsTrigger>
              <TabsTrigger value="role-admin">Admins</TabsTrigger>
              <TabsTrigger value="role-staff">Staff</TabsTrigger>
              <TabsTrigger value="course">Course</TabsTrigger>
              <TabsTrigger value="skill">Skill</TabsTrigger>
            </TabsList>
            
            {(filterType === 'course' || filterType === 'skill') && (
              <div className="mb-4">
                {filterType === 'course' && (
                  <Select 
                    value={selectedId} 
                    onValueChange={setSelectedId}
                  >
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {filterType === 'skill' && (
                  <Select 
                    value={selectedId} 
                    onValueChange={setSelectedId}
                  >
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Select a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map(skill => (
                        <SelectItem key={skill.id} value={skill.id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
            
            <div className="h-[600px]">
              <FilteredCalendar
                {...getFilterProps()}
                hasAdminAccess={hasAdminAccess}
              />
            </div>
          </Tabs>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
