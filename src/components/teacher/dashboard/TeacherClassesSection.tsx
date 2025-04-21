
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherCourses } from "@/hooks/useTeacherCourses";
import { Users } from "lucide-react";

const TeacherClassesSection = () => {
  const { myCourses, myCoursesLoading } = useTeacherCourses();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Classes</CardTitle>
        <CardDescription>Manage your active classes and assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        {myCoursesLoading ? (
          <p>Loading classes...</p>
        ) : myCourses.length === 0 ? (
          <p>You are not assigned to any classes yet.</p>
        ) : (
          <div className="space-y-4">
            {myCourses.map((course) => (
              <div 
                key={course.id} 
                className="border rounded px-4 py-3 flex flex-col gap-1 bg-muted"
              >
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <span className="font-semibold text-lg">{course.title}</span>
                    {course.level && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-secondary rounded">
                        {course.level}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Students badge */}
                    <span className="flex items-center text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded" title="Number of students">
                      <Users className="w-4 h-4 mr-1" aria-hidden="true" />
                      {(course.student_ids && course.student_ids.length) || 0} students
                    </span>
                    {/* Duration */}
                    <span className="text-xs text-muted-foreground">
                      {course.duration} {course.duration_type}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{course.description}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherClassesSection;
