
import React from 'react';
import ContentWrapper from './ContentWrapper';
import FilteredCalendar from '@/components/admin/scheduling/FilteredCalendar';
import { useAuth } from '@/hooks/useAuth';
import { useSkills } from '@/hooks/useSkills';
import { useCourses } from '@/hooks/useCourses';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';

const SchedulingContent: React.FC = () => {
  const { role, isAdmin, isSuperAdmin } = useAuth();
  const hasAdminAccess = isAdmin() || isSuperAdmin();
  
  // For skill calendar
  const { skills } = useSkills();
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  
  // For course calendar
  const { courses } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  // Set initial values when data loads
  useEffect(() => {
    if (skills.length > 0 && !selectedSkillId) {
      setSelectedSkillId(skills[0]?.id || '');
    }
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0]?.id || '');
    }
  }, [skills, courses, selectedSkillId, selectedCourseId]);
  
  return (
    <ContentWrapper
      title="Calendar"
      description="View and manage all calendar events"
    >
      <div className="space-y-6">
        {/* Main Calendar (Always open) */}
        <div className="h-[500px]">
          <FilteredCalendar
            title="Master Calendar"
            description="All events across the system"
            hasAdminAccess={hasAdminAccess}
          />
        </div>
        
        {/* Role-Based Calendars (Collapsible) */}
        <FilteredCalendar
          title="Teacher Calendar"
          description="Events for all teacher accounts"
          filterType="role"
          filterValues={['teacher']}
          hasAdminAccess={hasAdminAccess}
          isCollapsible={true}
          defaultOpen={false}
        />
        
        <FilteredCalendar
          title="Student Calendar"
          description="Events for all student accounts"
          filterType="role"
          filterValues={['student']}
          hasAdminAccess={hasAdminAccess}
          isCollapsible={true}
          defaultOpen={false}
        />
        
        <FilteredCalendar
          title="Admin Calendar"
          description="Events for all admin and superadmin accounts"
          filterType="role"
          filterValues={['admin', 'superadmin']}
          hasAdminAccess={hasAdminAccess}
          isCollapsible={true}
          defaultOpen={false}
        />
        
        <FilteredCalendar
          title="Staff Calendar"
          description="Events for all teachers, admins, and superadmins"
          filterType="role"
          filterValues={['teacher', 'admin', 'superadmin']}
          hasAdminAccess={hasAdminAccess}
          isCollapsible={true}
          defaultOpen={false}
        />
        
        {/* Course Calendar (Collapsible with selector) */}
        <div className="border rounded-lg bg-white mb-6">
          <Collapsible className="w-full">
            <div className="flex items-center p-4 border-b">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <div>
                <h2 className="text-lg font-semibold">Course Calendar</h2>
                <p className="text-sm text-gray-500">View events for specific courses</p>
              </div>
            </div>
            <CollapsibleContent className="p-4">
              <div className="mb-4">
                <Select 
                  value={selectedCourseId} 
                  onValueChange={setSelectedCourseId}
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
              </div>
              
              <div className="h-[400px]">
                {selectedCourseId ? (
                  <FilteredCalendar
                    title={courses.find(c => c.id === selectedCourseId)?.title || "Course Calendar"}
                    filterType="course"
                    filterValues={[selectedCourseId]}
                    hasAdminAccess={hasAdminAccess}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full border rounded-md bg-gray-50">
                    <p className="text-gray-500">Please select a course to view its calendar</p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Skill Calendar (Collapsible with selector) */}
        <div className="border rounded-lg bg-white mb-6">
          <Collapsible className="w-full">
            <div className="flex items-center p-4 border-b">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <div>
                <h2 className="text-lg font-semibold">Skill Calendar</h2>
                <p className="text-sm text-gray-500">View events by skill</p>
              </div>
            </div>
            <CollapsibleContent className="p-4">
              <div className="mb-4">
                <Select 
                  value={selectedSkillId} 
                  onValueChange={setSelectedSkillId}
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
              </div>
              
              <div className="h-[400px]">
                {selectedSkillId ? (
                  <FilteredCalendar
                    title={skills.find(s => s.id === selectedSkillId)?.name || "Selected Skill"}
                    filterType="skill"
                    filterValues={[selectedSkillId]}
                    hasAdminAccess={hasAdminAccess}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full border rounded-md bg-gray-50">
                    <p className="text-gray-500">Please select a skill to view its calendar</p>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default SchedulingContent;
