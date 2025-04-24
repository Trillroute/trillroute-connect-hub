
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course } from '@/types/course';
import CoursesGrid from './CoursesGrid';

interface CourseTabsProps {
  loading: boolean;
  filteredCourses: Course[];
  skills: any[];
  getInstructorNames: (course: Course) => string;
}

const CourseTabs: React.FC<CourseTabsProps> = ({ 
  loading, 
  filteredCourses, 
  skills, 
  getInstructorNames 
}) => {
  return (
    <Tabs defaultValue="all">
      <div className="overflow-x-auto pb-2">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          {skills.map(skill => skill?.name && (
            <TabsTrigger key={skill.id} value={skill.name.toLowerCase().replace(/\s+/g, '-')}>
              {skill.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="all">
        <CoursesGrid 
          courses={filteredCourses}
          loading={loading}
          getInstructorNames={getInstructorNames}
        />
      </TabsContent>

      {skills.map(skill => skill?.name && (
        <TabsContent key={skill.id} value={skill.name.toLowerCase().replace(/\s+/g, '-')}>
          <CoursesGrid 
            courses={filteredCourses.filter(course => course.skill === skill.name)}
            loading={loading}
            getInstructorNames={getInstructorNames}
            emptyMessage={`No ${skill.name} courses found`}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CourseTabs;
