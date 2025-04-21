
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherCourses } from "@/hooks/useTeacherCourses";

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
              <div key={course.id} className="border rounded px-4 py-3 flex flex-col gap-1 bg-muted">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <span className="font-semibold text-lg">{course.title}</span>
                    {course.level && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-secondary rounded">
                        {course.level}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {course.duration} {course.duration_type}
                  </span>
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
