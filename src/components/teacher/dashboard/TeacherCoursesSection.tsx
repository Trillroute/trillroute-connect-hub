
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeacherCourses } from "@/hooks/useTeacherCourses";
import { Users, Edit } from "lucide-react";
import EditCourseStudentsDialog from "./EditCourseStudentsDialog";

const TeacherCoursesSection = () => {
  const { myCourses, myCoursesLoading } = useTeacherCourses();
  const [editingCourse, setEditingCourse] = useState(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
        <CardDescription>Manage your active courses and assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        {myCoursesLoading ? (
          <p>Loading courses...</p>
        ) : myCourses.length === 0 ? (
          <p>You are not assigned to any courses yet.</p>
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
                    {/* Edit students */}
                    <button
                      className="ml-2 px-2 py-1 rounded bg-primary text-primary-foreground text-xs flex items-center gap-1 hover:bg-primary/90 transition"
                      onClick={() => setEditingCourse(course)}
                      title="Edit students"
                    >
                      <Edit className="w-4 h-4" /> Edit Students
                    </button>
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
        {editingCourse && (
          <EditCourseStudentsDialog
            open={!!editingCourse}
            onOpenChange={(open) => open ? null : setEditingCourse(null)}
            course={editingCourse}
            afterSave={() => setEditingCourse(null)}
            fetchOnOpen // tell dialog to always fetch fresh student data
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherCoursesSection;

// Updated text for “My Courses”, passed `fetchOnOpen` to dialog
